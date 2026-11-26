# 🧵 Powerloom Production Management System

A web-based **Powerloom Production Management System** developed for my father's textile business, **Kiruthika Textiles**.

This application helps manage day-to-day powerloom factory operations digitally, reducing manual work and making production, orders, payments, and stock management easier.

## 🚀 Project Overview

The Powerloom Production Management System is designed to simplify and organize textile factory activities through a single application.

It includes production management, dealer management, order tracking, stock management, dispatch management, and an integrated Fabric Calculator.

## ✨ Key Features

### 1. Dealer Management
- Manage dealer information.
- Maintain dealer-related details.
- Track dealer requests and orders.

### 2. Order Management
- Receive dealer order requests.
- Manage order approval.
- Track order progress.

### 3. Production Management
- Record daily production details.
- Maintain shift information.
- Track machine numbers and operator details.
- Record cloth types and production quantities.
- Add production remarks.

### 4. Advance and Balance Management
- Maintain advance payment details.
- Track pending balance amounts.
- Manage payment-related information.

### 5. Stock Management
- Track available fabric stock.
- Update stock based on production.
- Adjust stock during dispatch.

### 6. Dispatch Management
- Manage dispatch details.
- Track dispatched orders.
- Update stock after dispatch.

### 7. Fabric Calculator
- Integrated Fabric Calculator.
- Helps perform fabric-related measurements and calculations.
- Available within the same application.

### 8. Authentication and User Management
- Secure login system.
- Password management.
- Role-based user structure for Owner, Supervisor, and Operator.

## 🔄 Application Workflow

```text
Dealer
   ↓
Order Request
   ↓
Admin Approval
   ↓
Advance Payment
   ↓
Production
   ↓
Balance Payment
   ↓
Dispatch
   ↓
Stock Update
```

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend |
| Vite | Frontend development |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB Atlas | Database |
| Mongoose | Database integration |
| JavaScript | Application development |
| HTML & CSS | User interface |
| JWT | Authentication |
| Git & GitHub | Version control |

## 📁 Project Structure

```text
powerloom-management/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

*Note: The folder structure may vary depending on the implementation.*

## ⚙️ Installation and Setup

### Prerequisites
- Node.js
- npm
- MongoDB Atlas account
- Git

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Backend Setup

```bash
cd powerloom-management/backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OWNER_SETUP_SECRET=your_owner_setup_secret
```

Start the backend:

```bash
npm run dev
```

### Step 3: Frontend Setup

Open another terminal:

```bash
cd powerloom-management/frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the application.

## 🔐 Security

- Environment variables are used for sensitive configuration.
- Authentication uses JWT.
- Passwords are securely hashed.
- Sensitive credentials should never be uploaded to GitHub.

## 🎯 Project Objective

The main objective of this project is to digitize the daily operations of a powerloom textile business and provide an easy-to-use system for managing production, dealers, orders, payments, stock, dispatch, and fabric calculations.

## 👩‍💻 Developer

Developed for **Kiruthika Textiles** as a practical business management application.

---

**Powerloom Production Management System – Making Textile Factory Management Easier!** 🧵
