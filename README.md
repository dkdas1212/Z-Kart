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



### Recommendation System
Step	Description
1️⃣	User interactions (view/add/purchase) are logged in MongoDB
2️⃣	A script (buildItemSims.js) analyzes product co-occurrence
3️⃣	Cosine similarity is used to find related products
4️⃣	Results are stored in item_similarities collection
5️⃣	/api/recommend/:userId API returns personalized products
6️⃣	Frontend displays them using RecommendationCarousel.jsx
🧠 Run the ML Script
npm run build-item-sims


This updates product relationships based on recent user behavior.

📌 REST API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/users/login	Login existing user
POST	/api/users	Register new user
GET	/api/users/profile	Get logged-in user details
PUT	/api/users/profile	Update profile details
🛍️ Products
Method	Endpoint	Role	Description
GET	/api/products	USER	Get all products
GET	/api/products/:id	USER	Get product details
POST	/api/products	ADMIN	Add new product
PUT	/api/products/:id	ADMIN	Update product
DELETE	/api/products/:id	ADMIN	Delete product
💳 Orders
Method	Endpoint	Role	Description
POST	/api/orders	USER	Place a new order
GET	/api/orders/:id	USER	Get order details
GET	/api/orders/myorders	USER	Get logged-in user's orders
GET	/api/orders	ADMIN	View all orders
PUT	/api/orders/:id/deliver	ADMIN	Mark order as delivered
📦 Interactions & Recommendations
Method	Endpoint	Description
POST	/api/interactions/log	Log user event (view, add_to_cart, purchase)
GET	/api/recommend/:userId	Get recommended products for user
💰 Payments
Method	Endpoint	Description
GET	/api/config/paypal	Get PayPal client ID
