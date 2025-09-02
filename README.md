# Eventify SEU Backend

This is the backend service for **Eventify SEU**, built with **Node.js, Express, MongoDB, JWT Authentication, and Cloudinary**.  
It provides APIs for authentication, user management, events, and media uploads.

---

## 🚀 Features

- JWT-based authentication & role-based access
- MongoDB with Mongoose ORM
- Cloudinary media uploads
- Secure password hashing (bcrypt)
- RESTful API structure

---

## 📂 Project Structure

src/
config/ # Config files (DB, Cloudinary)
models/ # Database models
controllers/ # Business logic
routes/ # API endpoints
middlewares/ # Middleware (auth, validation)
utils/ # Helpers
server.ts # Entry point

---

## 🔧 Setup & Installation

### 1️⃣ Clone repository

```bash
git clone https://github.com/Irfanulamin/eventify-seu-backend.git
cd eventify-seu-backend

```

### 2️⃣ Install dependencies

```bash
npm install
```

3️⃣ Create .env file

In the root directory, create a .env file with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/yourDB
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### ️⃣ Start the server

```bash
npm run dev

or

npm start
```

Server will run on:
👉 http://localhost:5000

📌 Notes

Make sure MongoDB is running / connected via MongoDB Atlas

Use Postman for API testing

Set correct .env values before running

👨‍💻 Author

Irfanul Amin – GitHub

---
