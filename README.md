## Настройка API

Настройки задаются в `.env.local`:

```dotenv
VITE_FAVORIT_API_URL=https://api.favorit-parts.ru/hs/hsprice/
VITE_FAVORIT_API_KEY=00000000-0000-0000-0000-000000000001
```

Это публичный пример ключа из документации, а не личный ключ покупателя.
При необходимости замените его в `.env.local`.

## Запуск

```sh
npm i
npm run dev
```

## Prod

```sh
npm run build
npm run preview
```
