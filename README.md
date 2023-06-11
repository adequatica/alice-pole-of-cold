# The Pole of Cold

Serverless [skill for Alice](https://dialogs.yandex.ru/store/skills/8039a055-polyus-holod) ([virtual assistant](https://en.wikipedia.org/wiki/Alice_(virtual_assistant))) based on Node.js.

It reports the weather (temperature) at the North and South Poles?

### How does it work?

The user says: «*Alice, launch the skill The Pole of Cold*».

Alice responds with a welcome skill message: «*ask which pole is colder, north or south?*»

On any following phrase of the user occurs:
* Going to [OpenWeather API](https://openweathermap.org/api) follow the current weather at both poles;
* Determines which pole is colder;
* Answer to the user at which pole is colder and what is the temperature there.

The deployment occurs via the [Yandex Cloud Functions](https://cloud.yandex.com/en/services/functions).

----

# Полюс холода

Бессерверный [навык Алисы](https://dialogs.yandex.ru/store/skills/8039a055-polyus-holod) на Node.js.

Сообщает погоду (температуру) на Северном и Южном полюсах?

### Как он работает?

Пользователь говорит: «*Алиса, запусти навык полюс холода*»;

Алиса отвечает приветственным сообщением навыка: «*cпросите какой полюс холоднее, северный или южный?*»;

На любую следующую фразу пользователя происходит:
* Поход в [OpenWeather API](https://openweathermap.org/api) за текущей погодой на обоих полюсах;
* Определяется на каком полюсе холоднее;
* Ответ пользователю на каком полюсе холоднее и какая там температура.

Деплой происходит через [Функцию в Яндекс.Облаке](https://yandex.ru/dev/dialogs/alice/doc/deploy-ycloud-function-docpage/).
