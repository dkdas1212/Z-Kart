# ZKART eCommerce Platform

eCommerce platform built with the MERN stack & Redux. This app includes authentication, profiles, products catalog, shopping cart etc. Users can make purchases, review products, rate them. Authenticated admin users can modify products catalog, mark paid orders to delivery, give admin rights regular users. Payment system is developed with PayPal API.

# Features

* Full featured shopping cart
* Product reviews and ratings
* Top products carousel
* Product pagination
* Product search feature
* User profile with orders
* Admin product management
* Admin user management
* Admin Order details page
* Mark orders as delivered option
* Checkout process (shipping, payment method, etc)
* PayPal / credit card integration
* Database seeder (products & users)
* AI/ML-based Recommendation System
---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend** | React, Redux, Axios, Bootstrap |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT Tokens |
| **Payments** | PayPal REST API |
| **Machine Learning** | Collaborative Filtering (Node.js Script) |
| **Build Tool** | npm, concurrently |

---

## 📦 Setup

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB (local or Atlas)

---

### Steps

```bash
# Clone repository
git clone https://github.com/dkdas1212/Z-Kart.git
cd Z-Kart

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
