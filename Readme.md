# Fastify JWT Auth Backend (Cookies Edition)

A secure, production-ready authentication backend using **Fastify**, **JWT**, **MongoDB**, and **HTTP-only cookies** for token storage.

---

## 📁 Project Structure

```
project/
├── src/
│   ├── config/
│   │   ├── env.js
│   │   └── db.js
│   ├── plugins/
│   │   └── jwt.js
│   ├── models/
│   │   ├── user.model.js
│   │   └── token.model.js
│   ├── utils/
│   │   └── token.util.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── routes/
│   │   └── auth.routes.js
│   └── app.js
├── server.js
├── .env.example
└── README.md
```

---

## ⚙️ Installation & Setup

```bash
# Clone the repo
$ git clone <repo-url>
$ cd project

# Install dependencies
$ npm install

# Create .env file
$ cp .env.example .env

# Start the server
$ npm start
```

---

## 🚫 Environment Variables

`.env.example` defines all required variables:

```ini
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://localhost:27017/fastify_auth
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret
```

---

## 🔒 Authentication Flow

### Registration/Login

* Creates a user.
* Generates JWT access + refresh tokens.
* Stores hashed refresh token in DB.
* Sets both tokens in `HttpOnly` cookies.

### Token Refresh

* Uses cookie-stored refresh token.
* Validates token signature & database presence.
* Generates new access token.

### Logout

* Deletes refresh token record.
* Clears both cookies from browser.

---

## 🤖 API Endpoints

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | /auth/register | Register new user    |
| POST   | /auth/login    | Login existing user  |
| POST   | /auth/refresh  | Refresh access token |
| POST   | /auth/logout   | Logout user          |

> All responses (except refresh) include sanitized user object.

---

## 💡 Notes

* Access tokens expire quickly and should not be reused after expiry.
* Refresh tokens are stored as **hashes** for security.
* Tokens are not stored on client side JS, only in `HttpOnly` cookies.
* Uses `@fastify/jwt`, `@fastify/cookie`, and `@fastify/sensible`.

---

## 🛡️ Security Best Practices

* Use HTTPS in production to ensure cookie security (`secure: true`).
* JWT secrets and cookie secrets should be long and random.
* Regularly revoke refresh tokens on logout or suspicious activity.

---

## 🚀 Future Improvements

* Add Google / LinkedIn OAuth support.
* Rate limit login attempts.
* Email verification / password reset.

---

## 💼 License

MIT

---

## 🌐 Author

Built by \[Abhishek] for secure web authentication using modern Node.js tools.
