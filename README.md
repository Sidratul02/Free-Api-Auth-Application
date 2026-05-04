# Authentication App

A frontend authentication app built with React + Vite using the [FreeAPI](https://freeapi.app) authentication module.

<img width="457" height="392" alt="Screenshot (260)" src="https://github.com/user-attachments/assets/e0bddfb8-f9d4-4e62-853b-9611c1272b5a" />


## Features

- User Registration
- User Login / Logout
- Current user profile display
- Success & error messages
- Loading states during API requests
- Auto session restore on page refresh (via cookies)

## Tech Stack

- React 19
- Vite 8
- Plain CSS (no UI library)
- FreeAPI — `https://api.freeapi.app`

## Getting Started

```bash
cd "Free API Authentication App"
npm install
npm run dev
```

App runs at `http://localhost:5173`

## API Endpoints Used

| Action | Method | Endpoint |
|---|---|---|
| Register | POST | `/api/v1/users/register` |
| Login | POST | `/api/v1/users/login` |
| Logout | POST | `/api/v1/users/logout` |
| Current User | GET | `/api/v1/users/current-user` |

## Project Structure

```
src/
├── App.jsx       # All auth logic and UI (Register, Login, Profile, Logout)
├── App.css       # Auth-focused styles
├── index.css     # Global reset
└── main.jsx      # React entry point
```

## How Auth Works

1. On load, app calls `GET /current-user` — if a session cookie exists, it goes straight to the profile view
2. Register creates a new account, then redirects to login
3. Login sets a session cookie via the API response
4. All requests use `credentials: 'include'` to send/receive cookies
5. Logout clears the session and returns to the login screen

## CORS & Proxy

The Vite dev server proxies all `/api` requests to `https://api.freeapi.app` to avoid CORS issues in development.

Config in `vite.config.js`:

```js
server: {
  proxy: {
    '/api': {
      target: 'https://api.freeapi.app',
      changeOrigin: true,
      secure: true,
    },
  },
},
```

> **Note:** Always restart the dev server after changing `vite.config.js`.

