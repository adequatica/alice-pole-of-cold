"use strict";
// https://nodejs.org/api/https.html
const https = require("https");

// Weather API
// https://openweathermap.org/current
const apiWeater = "https://api.openweathermap.org/data/2.5/weather";
// Secret key is stored in environment variable
// https://nodejs.org/api/process.html#process_process_env
const apiWeatherKey = process.env.key;

const freezingPoint = JSON.parse('{"main": {"temp": 0}}');

// For a serverless application, you need to write API calls on a «pure node» (probably)
// https://cloud.yandex.com/en/docs/functions/concepts/function
//
// This function is used only for Weather API requests
const getHttps = (url) =>
  new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode === 200) {
        let rawData = "";
        res.on("data", (chunk) => {
          rawData += chunk;
        });
        res
          .on("end", () => {
            try {
              const response = JSON.parse(rawData);
              resolve(response);
            } catch (err) {
              reject(err.message);
            }
          })
          .on("error", (err) => {
            // Instead of an error, here returns freezing point to prevent a failed skill
            resolve(freezingPoint);
            console.log(`Error: ${err.message}`);
          });
      } else {
        // Instead of an error, here returns freezing point to prevent a failed skill
        resolve(freezingPoint);
        console.log("Error");
      }
    });

    req.setTimeout(2500, () => {
      // Instead of an error by timeout, here returns freezing point to prevent a failed skill
      resolve(freezingPoint);
    });
  });

// Creating skills for Alice
// https://cloud.yandex.com/en/docs/functions/tutorials/alice-skill
// Creating a serverless function in Yandex.Cloud
// https://yandex.ru/dev/dialogs/alice/doc/deploy-ycloud-function-docpage/#create-function
// Example of a skill using a serverless function
// https://github.com/yandex-cloud/examples/blob/master/serverless/functions/alice/nodejs/parrot/index.js
/**
 * Entry-point for Serverless Function.
 *
 * @param event {Object} request payload.
 *
 * @return {Promise<Object>} response to be serialized as JSON.
 */
module.exports.handler = async (event) => {
  // https://yandex.ru/dev/dialogs/alice/doc/protocol-docpage/
  const { request, version, session } = event;

  // Skill MUST contain welcome message and help
  // https://yandex.ru/dev/dialogs/alice/doc/requirements-docpage/#specific__content
  // "Ask which pole is colder, north or south?"
  const textWelcome = "Спросите какой полюс холоднее, северный или южный?";
  // "I will answer any question with the weather at the poles"
  const textHelp = "На любой вопрос отвечу погодой на полюсах";

  if (session.new) {
    return {
      version,
      session,
      response: {
        text: textWelcome,
        end_session: false,
      },
    };
  }

  const command = request.command.toLowerCase();

  // "help" || "what can you do"
  if (command.includes("помощь") || command.includes("что ты умеешь")) {
    return {
      version,
      session,
      response: {
        text: textHelp,
        end_session: false,
      },
    };
  }

  const weatherNorth = await getHttps(
    `${apiWeater}?lat=90.00000&lon=0.00000&units=metric&appid=${apiWeatherKey}`
  );
  const weatherSouth = await getHttps(
    `${apiWeater}?lat=-90.00000&lon=0.00000&units=metric&appid=${apiWeatherKey}`
  );

  let tempNorth = Math.round(weatherNorth.main.temp);
  let tempSouth = Math.round(weatherSouth.main.temp);

  let answer;

  // Easter egg ("warmer")
  if (command.includes("теплее")) {
    if (tempNorth > tempSouth) {
      // `It is warmer at the North Pole now, there is ${tempNorth}. At the South Pole is ${tempSouth}`
      answer = `Сейчас теплее на Северном полюсе, там ${tempNorth}. На Южном полюсе ${tempSouth}`;
    } else if (tempNorth < tempSouth) {
      // `It is warmer at the South Pole now, there is ${tempNorth}. At the North Pole is ${tempSouth}`
      answer = `Сейчас теплее на Южном полюсе, там ${tempSouth}. На Северном полюсе ${tempNorth}`;
    } else {
      // `It is equally ${tempNorth} at both poles`
      answer = `На обоих полюсах одинаково ${tempNorth}`;
    }

    return {
      version,
      session,
      response: {
        text: answer,
        // Finish dialog after answer
        end_session: true,
      },
    };
  }

  if (tempNorth > tempSouth) {
    // `It is colder at the South Pole now, there is ${tempNorth}. At the North Pole is ${tempSouth}`
    answer = `Сейчас холоднее на Южном полюсе, там ${tempSouth}. На Северном полюсе ${tempNorth}`;
  } else if (tempNorth < tempSouth) {
    // `It is colder at the North Pole now, there is ${tempNorth}. At the South Pole is ${tempSouth}`
    answer = `Сейчас холоднее на Северном полюсе, там ${tempNorth}. На Южном полюсе ${tempSouth}`;
  } else {
    // `It is equally ${tempNorth} at both poles`
    answer = `На обоих полюсах одинаково ${tempNorth}`;
  }

  return {
    version,
    session,
    response: {
      text: answer,
      // Finish dialog after answer
      end_session: true,
    },
  };
};
