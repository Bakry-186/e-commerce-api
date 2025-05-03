# Node.js eCommerce API

A RESTful eCommerce API built with Node.js and Express. This backend service handles user authentication, product management, orders, and more. It's designed for scalability and easy integration with any frontend (e.g., React, Flutter).

---

## 🚀 Features

- 🔐 User Authentication (JWT)
- 👤 Role-Based Access Control
- 📦 Product CRUD
- 🛒 Shopping Cart
- 📃 Order Management
- 📧 Email Verification & Password Reset
- 🧪 REST API Tested via Postman

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- dotenv for environment configs

---

## 📁 Project Structure

```
.
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── config/
├── app.js
└── server.js
```

---

## 📦 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/Bakry-186/e-commerce-api.git
   cd e-commerce-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```

---

## 📌 TODO / Upcoming Features

- ✅ Payment Integration (e.g., Stripe)
- ✅ Product Filtering & Pagination
- ✅ Wishlist & Favorites
- ✅ Rate Limiting & Security Middleware
- ✅ Docker Support
- ✅ API Documentation

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

This project is licensed under the MIT License.
