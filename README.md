Проектная работа 11-го спринта
Это React-проект, реализующий клиентскую часть для сервиса по сборке бургеров. В данной проектной работе реализуются авторизация, работа с API, маршрутизация и защита маршрутов, а также использование Redux для глобального управления состоянием приложения.

## Макет 📌
[Открыть Figma макет](https://www.figma.com/design/UuC07QYEfmogQuPe6gQDql/React-Fullstack_-%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%BD%D1%8B%D0%B5-%D0%B7%D0%B0%D0%B4%D0%B0%D1%87%D0%B8--3-%D0%BC%D0%B5%D1%81%D1%8F%D1%86%D0%B0-_external_link--Copy-?node-id=849-1002&t=mXM8zwKkuaYlPbYE-1)


## Запуск проекта 🚀
Клонируйте репозиторий:\
``git clone <ссылка_на_репозиторий>``

Установите зависимости:\
`npm install`

Создайте файл .env на основе .env.example и укажите переменную окружения BURGER_API_URL:\
`BURGER_API_URL=https://norma.nomoreparties.space/api`

Запустите приложение:\
`npm start`

- `/pages` — страницы приложения

- `/services` — логика Redux-состояния (actions, reducers, store)

- `/utils` — утилиты, включая API-запросы (burger-api.ts)

📌 Этапы работы
## Настройка роутинга
- Установлен `react-router-dom`

- Реализованы маршруты:

- -  `/ — главная страница`

- -  `/login — вход`

- -  `/register — регистрация`

- -  `/forgot-password — восстановление пароля`

- -  `/reset-password — ввод нового пароля`

- -  `/profile — личный кабинет (защищённый маршрут)`

## Работа с API и Redux
API-запросы вынесены в utils/burger-api.ts

Используется Redux Toolkit:

Slice'ы для пользователя, ингредиентов, заказов

Асинхронные thunks для API-запросов

fetchWithRefresh реализует логику обновления токена

## Авторизация и защищённые маршруты
Используется хранение токенов в cookies и localStorage

При входе пользователь получает accessToken и refreshToken

Реализована проверка авторизации и защита приватных маршрутов через HOC ProtectedRoute

## Используемые технологии 📎 
React

TypeScript

React Router

Redux Toolkit

REST API

CSS Modules

🔐 Особенности
Поддержка восстановления и сброса пароля

Обновление токена по истечению времени действия accessToken

Удобная структура компонентов и логики состояния