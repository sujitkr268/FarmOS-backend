# 🌾 FarmsOS Backend

> A smart agriculture backend that connects **farmers and buyers** for harvest listing, discovery, and interest management.

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express.js](https://img.shields.io/badge/Express.js-API-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Neon](https://img.shields.io/badge/Neon-Serverless%20Postgres-brightgreen)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange)

---

## 🚜 About FarmsOS

**FarmsOS** is an agriculture-focused platform designed to create a direct connection between **farmers and buyers**.

Farmers can list their available harvests, while buyers can explore harvest listings and show interest in purchasing them.

The backend provides:

- 🔐 Secure authentication
- 👨‍🌾 Farmer and buyer roles
- 🌾 Harvest management
- ❤️ Buyer interest management
- 🛡️ Role-based authorization
- 🗄️ Neon PostgreSQL database integration

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- Password Hashing using `bcryptjs`
- JWT Authentication
- Role-based access control

### Supported Roles

```text
👨‍🌾 Farmer
🛒 Buyer
👨‍💼 Admin
```

## 🌾 Harvest Management

Farmers can:

- Create harvest listings
- View harvests
- Update harvest information
- Delete harvest listings
- Manage harvest availability

## ❤️ Interest Management

Buyers can:

- Browse available harvests
- Express interest in a harvest
- Add a message
- Track interest status

---

# 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Backend Runtime |
| Express.js | API Framework |
| PostgreSQL | Database |
| Neon | Serverless PostgreSQL |
| pg | PostgreSQL Client |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |
| Nodemon | Development Server |

---

# 📁 Project Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── harvestController.js
│   └── interestController.js
│
├── database/
│   └── schema.sql
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── routes/
│   ├── authRoutes.js
│   ├── harvestRoutes.js
│   └── interestRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

# 🗄️ Database Architecture

```text
                    ┌───────────────┐
                    │     USERS     │
                    │               │
                    │ id            │
                    │ name          │
                    │ email         │
                    │ password      │
                    │ role          │
                    │ phone         │
                    │ location      │
                    └───────┬───────┘
                            │
                            │ farmer_id
                            ▼
                    ┌───────────────┐
                    │   HARVESTS    │
                    │               │
                    │ id            │
                    │ farmer_id     │
                    │ crop_name     │
                    │ quantity      │
                    │ price         │
                    │ location      │
                    │ status        │
                    └───────┬───────┘
                            │
                            │ harvest_id
                            ▼
                    ┌───────────────┐
                    │   INTERESTS   │
                    │               │
                    │ id            │
                    │ harvest_id    │
                    │ buyer_id      │
                    │ message       │
                    │ status        │
                    └───────────────┘
```

---

# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

Required packages:

```bash
npm install express pg bcryptjs jsonwebtoken dotenv
npm install nodemon --save-dev
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_super_secret_key
```

⚠️ Never upload your `.env` file to GitHub.

Add this to `.gitignore`:

```text
.env
node_modules
```

---

# 🗄️ Database Setup

FarmsOS uses **Neon PostgreSQL**.

Create the following tables:

```text
users
harvests
interests
```

Run the SQL schema located at:

```text
database/schema.sql
```

in the Neon SQL Editor.

---

# ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

Or:

```bash
nodemon server.js
```

### Production Mode

```bash
node server.js
```

---

# 🌐 Server

The backend runs on:

```text
http://localhost:5000
```

Home Route:

```text
GET /
```

Response:

```text
🌾 FarmOS Backend is Running!
```

---

# 🔐 Authentication API

## Register User

### Endpoint

```text
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Test Farmer",
  "email": "farmer@example.com",
  "password": "password123",
  "role": "farmer",
  "phone": "9876543210",
  "location": "West Bengal"
}
```

## Login User

### Endpoint

```text
POST /api/auth/login
```

### Request Body

```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

---

# 🔑 Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Password Validation
 │
 ▼
JWT Token Generated
 │
 ▼
Protected Routes
 │
 ▼
Auth Middleware
 │
 ▼
Role Middleware
 │
 ▼
Access Granted
```

---

# 🌾 Harvest API

```text
POST    /api/harvests
GET     /api/harvests
GET     /api/harvests/:id
PUT     /api/harvests/:id
DELETE  /api/harvests/:id
```

---

# ❤️ Interest API

```text
POST   /api/interests
GET    /api/interests
PUT    /api/interests/:id
```

---

# 🔒 Role-Based Access

| Role | Permissions |
|------|------------|
| 👨‍🌾 Farmer | Create and manage harvests |
| 🛒 Buyer | Browse harvests and express interest |
| 👨‍💼 Admin | Manage platform resources |

---

# 🔄 Backend Architecture

```text
                    CLIENT
                       │
                       ▼
                 EXPRESS SERVER
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       AUTH API     HARVEST API   INTEREST API
          │            │            │
          ▼            ▼            ▼
     Controllers   Controllers   Controllers
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                   PG POOL
                       │
                       ▼
                NEON POSTGRESQL
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
        USERS       HARVESTS      INTERESTS
```

---

# 🧪 Testing

You can test the APIs using:

- Postman
- Thunder Client
- Insomnia

Example:

```text
POST http://localhost:5000/api/auth/register
```

---

# 🔮 Future Features

- 📊 Farmer Dashboard
- 🌦️ Weather Integration
- 🤖 AI Crop Recommendations
- 💰 Smart Price Prediction
- 📍 Location-Based Harvest Discovery
- 🔔 Real-Time Notifications
- 📱 Mobile Application
- ⭐ Farmer and Buyer Ratings
- 📈 Market Analytics

---

# 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "Add new feature"
git push origin feature/your-feature
```

Then create a Pull Request.

---

# 👨‍💻 Author

**FarmsOS Team**

Built for smarter and more connected agriculture. 🌾

---

# ⭐ Support

If you like this project, consider giving the repository a ⭐.

---

## 🌾 FarmsOS

### Connecting Farmers. Empowering Agriculture. Growing Together.
