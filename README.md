# ITMO-meet Frontend
Это репозиторий фронтенда

## Как добавить изображение
Картинки можно добавить в `public/images/`

В коде можно использовать `<img src="public/images/img.jpg" />`

## Как добавить стили
Стили добвляем в `src/styles/`

В коде можно использовать `import "../styles/app.css"`

## Commands
`npm install` - установить зависимости

`npm run build` - собрать приложение для прода

`npm run start` - собрать приложение в dev режиме + запуск сервера + горячая замена

`npm run test:unit`- юнит тесты

`npm run test:unit:coverage`- юнит тесты + покрытие

`npm run test:e2e` - e2e тесты

`npm run lint` - eslint

`npx cap init` - init cap (project file) for apk build

`npx cap add android` - add Android as target platform

`npx cap sync` - sync between apk and web project

`npx cap open android` - open android studio with project