# CRELMAN - AI-Powered CRM

<p align="center">
  <img src="./client/src/assets/logo.png" alt="CRELMAN Logo" width="150"/>
</p>

<p align="center">
  <strong>A modern AI-powered Customer Relationship Management (CRM) platform built with the MERN Stack.</strong>
</p>

<p align="center">
  Manage customers, organize leads, track sales, automate workflows, and leverage AI to improve productivity.
</p>

---

## 📖 Overview

**CRELMAN** is a full-stack AI-powered Customer Relationship Management (CRM) application developed using the **MERN Stack**. It helps businesses and sales teams efficiently manage customer relationships, sales pipelines, daily tasks, and business analytics through a clean and intuitive interface.

The platform also integrates AI-powered features to automate repetitive tasks, generate professional emails, and provide intelligent assistance for better decision-making.

---

# ✨ Features

- 🔐 Secure User Authentication (JWT)
- 👥 Customer & Contact Management
- 📊 Interactive Dashboard & Analytics
- 📈 Sales Pipeline Management
- 📅 Task & Activity Tracking
- 🤖 AI-Powered Email Generation
- 💡 AI CRM Assistant
- 📧 Smart Customer Communication
- 📱 Fully Responsive Design
- 🎨 Modern Glassmorphism UI
- ⚡ Fast Performance using React + Vite

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv

## AI Integration

- Google Gemini API

---

# 📋 Prerequisites

Before running the project, make sure you have installed:

- Node.js (v18 or later)
- npm
- Git
- MongoDB Atlas account (or Local MongoDB)

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

# ⚙️ Environment Variables

The project requires separate `.env` files for the frontend and backend.

---

## Backend Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

### Description

| Variable | Description |
|----------|-------------|
| PORT | Backend server port |
| MONGO_URI | MongoDB Atlas connection string |
| JWT_SECRET | Secret key for JWT authentication |
| GEMINI_API_KEY | Google Gemini API key |
| CLIENT_URL | Frontend URL |

---

## Frontend Environment Variables

Create a `.env` file inside the **client** folder.

```env
VITE_API_URL=http://localhost:5000/api
```

---

# ▶️ Running the Project

## Start the Backend Server

```bash
cd server
npm run dev
```

---

## Start the Frontend

Open another terminal.

```bash
cd client
npm run dev
```

---

The application will run on:

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🗄️ Database Setup

### Using MongoDB Atlas

1. Create a MongoDB Atlas account.
2. Create a new cluster.
3. Create a database.
4. Obtain the connection string.
5. Paste it into:

```env
MONGO_URI=
```

inside the backend `.env` file.

---

### Seeding the Database (Optional)

If your project includes a seed script:

```bash
npm run seed
```

This will populate the database with demo data.

---

# 📜 Available Scripts

## Frontend

Development

```bash
npm run dev
```

Production Build

```bash
npm run build
```

Preview Production Build

```bash
npm run preview
```

---

## Backend

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 🔐 Authentication

CRELMAN uses **JWT-based authentication**.

Supported features include:

- User Registration
- User Login
- Protected Routes
- Secure API Access
- Password Encryption

---

# 🤖 AI Features

CRELMAN integrates AI to improve productivity through:

- AI Email Drafting
- Intelligent CRM Assistance
- Smart Customer Interaction
- Automated Content Generation
- Sales Insights

Simply provide a valid Gemini API key in the backend `.env` file to enable these features.

---



## Frontend

You can deploy the frontend on:

- Vercel
- Netlify

---

## Backend

Deploy the backend using:

- Render
- Railway
- DigitalOcean
- AWS

After deployment, update the frontend environment variable:

```env
VITE_API_URL=https://your-backend-url/api
```
---

# 👨‍💻 Author

**Sagar Gupta**

Built with ❤️ using the MERN Stack.