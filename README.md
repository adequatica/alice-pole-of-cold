# The Pole of Cold

**Serverless [skill for Alice](https://dialogs.yandex.com/store/skills/8039a055-polyus-holod)** ([virtual assistant](<https://en.wikipedia.org/wiki/Alice_(virtual_assistant)>)) based on Node.js.

It reports the weather (temperature) at the North and South Poles?

### How does it work?

The user says: «_Alice, launch the skill The Pole of Cold_».

Alice responds with a welcome skill message: «_Ask which pole is colder, north or south?_»

On any following phrase of the user occurs:

1. Going to [OpenWeather API](https://openweathermap.org/api) follow the current weather at both poles;
2. Determines which pole is colder;
3. Answer to the user at which pole is colder and what is the temperature there.

The deployment occurs via the [Yandex Cloud Functions](https://cloud.yandex.com/en/services/functions).
