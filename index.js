"use strict";
// https://nodejs.org/api/https.html
const https = require("https");

// Погодное API https://openweathermap.org/current
const apiWeater = "https://api.openweathermap.org/data/2.5/weather";
// Секретик ключа лежит в переменной окружения
// https://nodejs.org/api/process.html#process_process_env
const apiWeatherKey = process.env.key;

// Для serverless приложения нужно написать вызовы к API на «чистой ноде» (наверное)
// https://cloud.yandex.ru/docs/functions/concepts/function
const getHttps = (url) => new Promise((resolve, reject) => {
    https.get(url, res => {
        if (res.statusCode === 200) {
            let rawData = "";
            res.on("data", chunk => {
                rawData += chunk;
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(rawData);
                    resolve(response);
                } catch (err) {
                    reject(err.message);
                }
            }).on("error", err => {
                console.log(`Error: ${err.message}`);
            });
        } else {
            console.log("Error");
        }
    });
});

// Создание навыка в Яндекс.Облаке
// https://cloud.yandex.ru/docs/functions/solutions/alice-skill
// Создание функции в Яндекс.Облаке
// https://yandex.ru/dev/dialogs/alice/doc/deploy-ycloud-function-docpage/#create-function
// Пример навыка с использованием serverless функции
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
    const {request, version, session} = event;

    // Навык ДОЛЖЕН содержать приветственное сообщение и help
    // https://yandex.ru/dev/dialogs/alice/doc/requirements-docpage/#specific__content
    const textWelcome = "Спросите какой полюс холоднее, северный или южный?";
    const textHelp = "На любой вопрос отвечу прогодой на полюсах.";

    if (session.new) {
        return {
            version,
            session,
            response: {
                text: textWelcome,
                end_session: false
            }
        };
    }

    const command = request.command.toLowerCase();

    if (command.includes("помощь") || command.includes("что ты умеешь")) {
        return {
            version,
            session,
            response: {
                text: textHelp,
                end_session: false
            }
        };
    }

    const weatherNorth = await getHttps(`${apiWeater}?lat=90.00000&lon=0.00000&units=metric&appid=${apiWeatherKey}`);
    const weatherSouth = await getHttps(`${apiWeater}?lat=-90.00000&lon=0.00000&units=metric&appid=${apiWeatherKey}`);

    let tempNorth = Math.round(weatherNorth.main.temp);
    let tempSouth = Math.round(weatherSouth.main.temp);

    let answer;

    // Пасхалка
    if (command.includes("теплее")) {

        if (tempNorth > tempSouth) {
            answer = `Сейчас теплее на Северном полюсе, там ${tempNorth}. На Южном полюсе ${tempSouth}`;
        } else if (tempNorth < tempSouth) {
            answer = `Сейчас теплее на Южном полюсе, там ${tempSouth}. На Северном полюсе ${tempNorth}`;
        } else {
            answer = `На обоих полюсах одинаково ${tempNorth}`;
        }

        return {
            version,
            session,
            response: {
                text: answer,
                // Завершаем разговор после ответа
                end_session: true
            }
        };
    }

    if (tempNorth > tempSouth) {
        answer = `Сейчас холоднее на Южном полюсе, там ${tempSouth}. На Северном полюсе ${tempNorth}`;
    } else if (tempNorth < tempSouth) {
        answer = `Сейчас холоднее на Северном полюсе, там ${tempNorth}. На Южном полюсе ${tempSouth}`;
    } else {
        answer = `На обоих полюсах одинаково ${tempNorth}`;
    }

    return {
        version,
        session,
        response: {
            text: answer,
            // Завершаем разговор после ответа
            end_session: true
        }
    };
};