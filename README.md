# 🚀 CLERMAN - AI Powered CRM

<p align="center">
  <img src="./client/src/assets/logo.png" alt="CLERMAN Logo" width="150"/>
</p>

<p align="center">
  <b>An AI-powered Customer Relationship Management (CRM) platform built with the MERN Stack.</b>
</p>

---

## 📖 Overview

CLERMAN is a modern CRM application designed to help businesses manage leads, customers, sales pipelines, tasks, and communications from a single dashboard.

The application combines a clean, responsive interface with AI-powered features to improve productivity, automate repetitive work, and provide actionable insights for sales teams.

---

## ✨ Features

- 🔐 Secure Authentication & Authorization
- 👥 Customer & Contact Management
- 📊 Interactive Dashboard & Analytics
- 📅 Task and Activity Management
- 💼 Sales Pipeline Management
- 🤖 AI-Assisted CRM Features
- 📈 Business Insights & Reports
- 📧 AI Email Generation
- 📱 Responsive UI
- 🌙 Modern Glassmorphism Design

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### AI
- Google Gemini API *(or any compatible Gemini API key)*

---

# ⚙️ Prerequisites

Make sure the following are installed:

- Node.js (v18 or above)
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

---

# 📥 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/OCEAN2004/CrelMan.git
```

Move into the project directory.

```bash
cd CrelMan
```

---

## 2. Install Frontend Dependencies

```bash
cd client
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal.

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Both the frontend and backend require environment variables.

---

## Backend (.env)

Create a `.env` file inside the **server** directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

---

## Frontend (.env)

Create a `.env` file inside the **client** directory.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

> Replace the values according to your local setup.

---

# ▶ Running the Project

## Start Backend

```bash
cd server
npm run dev
```

---

## Start Frontend

```bash
cd client
npm run dev
```

---

The application will be available at

```
Frontend:
http://localhost:5173

Backend:
http://localhost:5000
```

---

# 🌱 Database Setup

1. Create a MongoDB Atlas cluster.
2. Create a database.
3. Copy the connection string.
4. Paste it into:

```env
MONGO_URI=
```

inside the backend `.env` file.

If your project includes seed data, run the seeding script:

```bash
npm run seed
```

*(Run this only if the project contains a seed script.)*

---

# 📦 Available Scripts

### Frontend

```bash
npm run dev
```

Starts the React development server.

```bash
npm run build
```

Builds the production version.

```bash
npm run preview
```

Previews the production build.

---

### Backend

```bash
npm run dev
```

Starts the backend server using nodemon.

```bash
npm start
```

Starts the backend in production mode.

---

# 🔒 Authentication

CLERMAN uses JWT-based authentication.

Users can:

- Register
- Login
- Access protected routes
- Manage CRM data securely

---

# 🤖 AI Features

The application includes AI-powered capabilities such as:

- Email drafting
- Sales Insights
- Intelligent suggestions
- Automated content generation

To use these features, add a valid Gemini API key to the backend `.env` file.

---

# 👨‍💻 Author

**Sagar Gupta**

Built with ❤️ using the MERN Stack.