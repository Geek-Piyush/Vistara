# 🌍 Vistara: Tour Booking App

Vistara is a full-stack **tour booking platform** built with Node.js, Express.js, MongoDB Atlas, and Pug. It provides a secure and scalable RESTful API for managing tours, users, reviews, and bookings, with Stripe integration for payments. While the backend is fully functional, the frontend is still under active development.

---

## 🚀 Features

- 🔐 JWT-based user authentication & role-based authorization
- 🧭 CRUD operations for Tours, Users, Reviews, Bookings
- 💳 Stripe integration for mock payments
- 🧾 RESTful API with validation and error handling
- 🧩 Modular MVC architecture
- 🖼 Templating engine: Pug
- 📁 MongoDB Atlas for cloud DB

---

## 🛠️ Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Backend       | Node.js, Express.js               |
| Database      | MongoDB Atlas + Mongoose          |
| Authentication| JWT, Cookies                      |
| Templating    | Pug                               |
| Payment       | Stripe (Test Mode)                |
| Tools         | Postman, dotenv, nodemon, morgan  |

---

## 📦 Getting Started

### 🔄 1. Clone the Repository

```bash
git clone https://github.com/Geek-Piyush/Vistara.git
cd Vistara
```
## 📦 2. Install Dependencies

```bash
npm install
```
## ⚙️ 3. Setup Environment Variables

```
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster0.mongodb.net/vistara?retryWrites=true&w=majority
DATABASE_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=your_email_user
EMAIL_PASSWORD=your_email_pass
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587

STRIPE_SECRET_KEY=your_stripe_test_secret
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```
⚠️ Never commit this file to version control or expose it publicly.

## 🔁 4. Run JavaScript Bundler

```bash
npm run watch:js
```

## 🛠️ 5. Run the Development Server

```bash
npm run start:dev
or
npm start
```

# 💳 Stripe Payment Setup (Mock)

### 1. Make sure your .env includes valid Stripe test keys

### 2. Use Stripe Test Cards:
```
Card Number: 4242 4242 4242 4242
Exp Date: Any future date
CVC: Any 3-digit number
ZIP: Any 5-digit number
```

### 3. Simulate Stripe checkout session:

```
POST /api/v1/bookings/checkout-session/:tourId
```

# 📬 Postman API Testing
## 🔗 Base URL
```
http://localhost:8000/api/v1/
```
# 📂 Available Routes

| Resource | Method   | Endpoint                                          |
| -------- | -------- | ------------------------------------------------- |
| Users    | POST     | `/users/signup`, `/users/login`                   |
| Tours    | GET      | `/tours`, `/tours/top-5-cheap`, `/tours/:id`      |
| Reviews  | GET/POST | `/reviews`                                        |
| Bookings | GET/POST | `/bookings`, `/bookings/checkout-session/:tourId` | 


# 🛠 API Testing Steps
### 1. Use POST /api/v1/users/signup or login to generate a JWT token.

### 2. Add the token to Postman headers:
```
Authorization: Bearer <your_token>
```
### 3. For booking flow, simulate Stripe session via /checkout-session/:tourId and test with Stripe test card.

# 🗂 Folder Structure

```
Vistara/
├── controllers/       # Route logic (Tours, Users, Reviews, Bookings)
├── dev-data/          # Sample JSON data for testing
├── models/            # Mongoose schemas/models
├── public/            # Static files (CSS, JS, images)
├── routes/            # Express route definitions
├── utils/             # Utility functions (error handling, etc.)
├── views/             # Pug templates
├── config.env         # Environment config (not committed)
├── app.js             # Express app setup
├── server.js          # Entry point
└── package.json

```

---

### 📸 Preview

> ⚠️ Frontend is under development. APIs can be tested using **Postman**.
