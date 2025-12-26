# 🌍 Vistara: Tour Booking App

Vistara is a full-stack **tour booking platform** built with Node.js, Express.js, MongoDB Atlas, and Pug. It provides a secure and scalable RESTful API for managing tours, users, reviews, and bookings, with Stripe integration for payments.

---

## 🚀 Features

- 🔐 JWT-based user authentication & role-based authorization
- 🧭 CRUD operations for Tours, Users, Reviews, Bookings
- 💳 Stripe integration for payments
- 🔍 Search and filter tours
- ⭐ Review system for tours
- 👤 User profile management with photo upload
- 🔒 Password reset via email
- 👑 Admin dashboard for managing all resources
- 📱 Responsive design
- 🧩 Modular MVC architecture

---

## 🛠️ Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Backend        | Node.js, Express.js              |
| Database       | MongoDB Atlas + Mongoose         |
| Authentication | JWT, Cookies                     |
| Templating     | Pug                              |
| Payment        | Stripe (Test Mode)               |
| Bundler        | Parcel                           |
| Tools          | Postman, dotenv, nodemon, morgan |

---

## 📦 Getting Started

### 🔄 1. Clone the Repository

```bash
git clone https://github.com/Geek-Piyush/Vistara.git
cd Vistara
```

### 📦 2. Install Dependencies

```bash
npm install
```

### ⚙️ 3. Setup Environment Variables

Copy `.env.example` to `config.env` and fill in your values:

````env
```env
NODE_ENV=development
PORT=8000

DATABASE=mongodb+srv://<USER>:<PASSWORD>@cluster0.mongodb.net/vistara?retryWrites=true&w=majority
DATABASE_PASSWORD=your_db_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIES_EXPIRES_IN=90

EMAIL_USERNAME=your_email_user
EMAIL_PASSWORD=your_email_pass
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587

STRIPE_SECRET_KEY=your_stripe_test_secret
````

⚠️ Never commit this file to version control or expose it publicly.

### 🔁 4. Build JavaScript Bundle

```bash
npm run build:js
```

### 🛠️ 5. Run the Development Server

```bash
npm start
```

The app will be available at `http://localhost:8000`

---

## 🚀 Deployment to Render

### Prerequisites

- MongoDB Atlas account with a database cluster
- Stripe account (for payments)
- SendGrid account (for production emails)
- GitHub repository

### Step-by-Step Render Deployment

#### 1. **Prepare Your Repository**

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### 2. **Create a Render Account**

- Go to [Render](https://render.com)
- Sign up or log in with your GitHub account

#### 3. **Create a New Web Service**

- Click **"New +"** → **"Web Service"**
- Connect your GitHub repository (`Geek-Piyush/Vistara`)
- Configure the service:

**Basic Settings:**

- **Name:** `vistara` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Runtime:** `Node`

**Build & Deploy Settings:**

- **Build Command:** `npm install && npm run build:js`
- **Start Command:** `npm start`
- **Plan:** Free (or your preferred plan)

#### 4. **Configure Environment Variables**

Add the following environment variables in Render's dashboard:

| Key                      | Value                      | Notes                                   |
| ------------------------ | -------------------------- | --------------------------------------- |
| `NODE_ENV`               | `production`               | Required                                |
| `DATABASE`               | Your MongoDB URI           | From MongoDB Atlas                      |
| `DATABASE_PASSWORD`      | Your DB password           | Keep secret                             |
| `JWT_SECRET`             | Random 32+ char string     | Generate with `openssl rand -base64 32` |
| `JWT_EXPIRES_IN`         | `90d`                      | Token expiry                            |
| `JWT_COOKIES_EXPIRES_IN` | `90`                       | Cookie expiry in days                   |
| `EMAIL_HOST`             | `sandbox.smtp.mailtrap.io` | For dev/testing                         |
| `EMAIL_PORT`             | `25` or `587`              | SMTP port                               |
| `EMAIL_USERNAME`         | Your Mailtrap username     | For dev                                 |
| `EMAIL_PASSWORD`         | Your Mailtrap password     | For dev                                 |
| `EMAIL_FROM`             | `your-email@example.com`   | Sender email                            |
| `SENDGRID_USERNAME`      | `apikey`                   | For production emails                   |
| `SENDGRID_PASSWORD`      | Your SendGrid API key      | For production                          |
| `STRIPE_SECRET_KEY`      | Your Stripe secret key     | From Stripe dashboard                   |

#### 5. **MongoDB Atlas Configuration**

- Log into [MongoDB Atlas](https://cloud.mongodb.com)
- Go to **Network Access**
- Click **"Add IP Address"**
- Add **`0.0.0.0/0`** (Allow access from anywhere)
  - _Note: For better security, add Render's specific IP ranges_
- Click **Confirm**

#### 6. **Deploy**

- Click **"Create Web Service"**
- Render will automatically:
  - Clone your repository
  - Install dependencies
  - Build your JavaScript bundle
  - Start your application
- Monitor the deployment logs

#### 7. **Access Your App**

Once deployed, your app will be available at:

```
https://vistara.onrender.com
```

(Replace with your actual Render URL)

#### 8. **Important Post-Deployment Steps**

**Update Stripe Webhook (if using):**

- Go to Stripe Dashboard → Developers → Webhooks
- Add endpoint: `https://your-app.onrender.com/webhook-checkout`

**Test All Features:**

- [ ] User registration/login
- [ ] Password reset email
- [ ] Tour booking
- [ ] Payment processing
- [ ] Admin dashboard
- [ ] Review system

---

## 🔧 Render-Specific Optimization

### Auto-Deploy on Push

Render automatically redeploys when you push to your main branch.

### Custom Domain

- Go to Settings → Custom Domain
- Add your domain and configure DNS

### Health Checks

Render pings `/` by default. The app responds with the overview page.

### Logs

View real-time logs in Render dashboard under "Logs" tab.

### Performance

- **Free Tier:** Service spins down after 15 min of inactivity
- **Paid Tiers:** Always-on with better performance

---

## 🐛 Troubleshooting Render Deployment

### Build Fails

- Check Node version compatibility (specified in `package.json`)
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Review build logs for specific errors

### Database Connection Fails

- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check `DATABASE` and `DATABASE_PASSWORD` environment variables
- Ensure connection string format is correct

### 500 Errors After Deployment

- Check Render logs for errors
- Verify all environment variables are set
- Ensure `NODE_ENV=production`

### Static Files Not Loading

- Verify `public/js/bundle.js` was created during build
- Check CSP headers in `app.js`

---

## 🌐 Alternative Deployment Options

### Deploy to Heroku

- **Start Command:** `npm start`

4. Add all environment variables from `config.env`
5. Deploy!

### Deploy to Heroku

1. Install Heroku CLI
2. Login and create app:

```bash
heroku login
heroku create your-app-name
```

3. Set environment variables:

```bash
heroku config:set NODE_ENV=production
heroku config:set DATABASE=your_mongodb_uri
# ... set all other env variables
```

4. Deploy:

```bash
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Add environment variables
3. Deploy automatically on push

---

## 💳 Stripe Payment Setup (Test Mode)

### Use Stripe Test Cards:

```
Card Number: 4242 4242 4242 4242
Exp Date: Any future date
CVC: Any 3-digit number
ZIP: Any 5-digit number
```

---

## 📂 Available Routes

### Public Routes

| Resource   | Method | Endpoint                       |
| ---------- | ------ | ------------------------------ |
| Tours      | GET    | `/api/v1/tours`                |
| Tour       | GET    | `/api/v1/tours/:id`            |
| Top Tours  | GET    | `/api/v1/tours/top-5-cheap`    |
| Tour Stats | GET    | `/api/v1/tours/get-tour-stats` |

### Auth Routes

| Resource        | Method | Endpoint                             |
| --------------- | ------ | ------------------------------------ |
| Signup          | POST   | `/api/v1/users/signup`               |
| Login           | POST   | `/api/v1/users/login`                |
| Logout          | GET    | `/api/v1/users/logout`               |
| Forgot Password | POST   | `/api/v1/users/forgotPassword`       |
| Reset Password  | PATCH  | `/api/v1/users/resetPassword/:token` |

### Protected Routes (Requires Login)

| Resource        | Method | Endpoint                                   |
| --------------- | ------ | ------------------------------------------ |
| Update Password | PATCH  | `/api/v1/users/updateMyPassword`           |
| Get Me          | GET    | `/api/v1/users/me`                         |
| Update Me       | PATCH  | `/api/v1/users/updateMyDetail`             |
| Delete Me       | DELETE | `/api/v1/users/deleteMyProfile`            |
| Create Review   | POST   | `/api/v1/tours/:tourId/reviews`            |
| Checkout        | GET    | `/api/v1/booking/checkOut-session/:tourId` |

### Admin Routes

| Resource     | Method | Endpoint          |
| ------------ | ------ | ----------------- |
| All Users    | GET    | `/api/v1/users`   |
| All Bookings | GET    | `/api/v1/booking` |
| All Reviews  | GET    | `/api/v1/reviews` |

---

## 🗂 Folder Structure

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
├── Procfile           # For Heroku deployment
└── package.json
```

---

## 📸 Screenshots

> App features a beautiful, responsive UI for browsing and booking tours.

---

## 👤 Author

**Piyush Nashikkar**

---

## 📄 License

ISC
