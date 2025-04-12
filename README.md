<h2>GuestPostLink App</h2>

A MERN stack-powered **GuestPost Marketplace** where users can browse SEO tools, buy guest post services and admins can manage orders and payment status and gain insights from a Data Analytics Dashboard — showing total traffic, revenue, conversion rates, active orders and recent notifications — all in one place.

 
![Screenshot](https://user-images.githubusercontent.com/12345678/your-uploaded-screenshot.png)
<!--![GuestPost Preview](preview.png)--> 

## Live Demo

>  [**User Panel**](https://guest-post-frontend.vercel.app)


## Features

### User Panel
-  Authentication (Login/Signup with context API)
-  Add-to-cart system with persistent data (even after refresh)
-  My Orders & Checkout flow
-  Payment Integration (Stripe/Razorpay)
-  SEO Tools & Marketplace filtering
-  Profile page with editable details

### Admin Panel
-  Analytics Dashboard with charts
-  Export orders to PDF/Excel
-  View and manage all user orders
-  Update order payment status


## Tech Stack

### Frontend
- React.js + TailwindCSS + Shadcn UI
- React Router DOM
- Context API (for Auth & Cart)

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful APIs

### DevOps & Hosting
- Frontend: Vercel
- Backend: AWS / GCP 
- Database: MongoDB Atlas
  

## Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```
### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## License
This project is licensed under the [MIT License]().

