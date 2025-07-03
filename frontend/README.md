# 🚀 Fullstack Auth App (Frontend)

A secure, role-based authentication frontend built using **React**, **Redux Toolkit**, and **React Router**, integrated with a Fastify backend using HTTP-only cookies.

---

## 🧠 Features

- 🔐 Login & Signup with JWT stored in **secure HTTP-only cookies**
- 🧠 Redux-based **session management** (no token in localStorage)
- ✅ Auto fetch user session via `/me` on refresh
- 🚫 Role-based route protection (403 on role mismatch)
- 🔄 Refresh token support (access token is short-lived)
- 🌐 CORS + credentials setup for smooth API requests

---

## 🛠 Tech Stack

- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router v6](https://reactrouter.com/en/main)
- [Axios](https://axios-http.com/)
- [Tailwind CSS (optional)](https://tailwindcss.com/)

---

## 📁 Folder Structure

frontend/
├── src/
│ ├── api/ # API helper functions (login, register, logout, me)
│ ├── components/ # ProtectedRoute, etc.
│ ├── layout/ # PublicLayout / DashboardLayout
│ ├── pages/ # SignIn, SignUp, Landing, Dashboard, etc.
│ ├── store/ # Redux slice (authSlice)
│ └── App.jsx # Main routes + provider
├── public/
├── index.html
└── vite.config.js


---

## 🧪 .env

Create a `.env` file in your root:


> Make sure this matches your backend URL and that Fastify CORS allows this origin.

---

## 🚀 Setup & Run

```bash
# 1. Clone the repo
git https://github.com/itstheabhiiigmailcom/Patil-project.git
cd Patil-project/frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev


🧩 Available Routes
Route	                 Access	                    Description
/                        Public	                    Landing Page
/signin	                 Public                     Sign In
/signup	                 Public	                    All roles allowed
/unauthorized	         Public	                    403 page
*	                     Public	                    404 fallback