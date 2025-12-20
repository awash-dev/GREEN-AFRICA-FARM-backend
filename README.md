# Green Africa Farm - Backend API

This is the backend service for the **Green Africa Farm** e-commerce platform. It provides a RESTful API for managing organic farm products, categories, and inventory statistics.

## 🚀 Tech Stack

- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Validation**: Express Validator
- **Deployment**: Vercel

## 🛠️ Features

- **Product Management**: Full CRUD (Create, Read, Update, Delete) operations.
- **Image Support**: Base64 image storage for harvest visuals.
- **Multilingual Support**: Fields for descriptions in English, Amharic, and Afaan Oromo.
- **Statistics**: Automated calculation of total inventory value and product counts.
- **Global Error Handling**: Consistent JSON error responses.

## 📖 API Documentation

### Base URL

`https://green-africa-farm-backend.vercel.app/api/products`

### Endpoints

| Method     | Endpoint                   | Description                                              |
| :--------- | :------------------------- | :------------------------------------------------------- |
| **GET**    | `/`                        | API Status and basic info                                |
| **GET**    | `/api/products`            | Get all products (with optional search/category filters) |
| **GET**    | `/api/products/:id`        | Get specific product details                             |
| **GET**    | `/api/products/categories` | Get list of unique product categories                    |
| **GET**    | `/api/products/stats`      | Get inventory summary (total count & value)              |
| **POST**   | `/api/products`            | Add a new produce                                        |
| **PUT**    | `/api/products/:id`        | Update existing produce                                  |
| **DELETE** | `/api/products/:id`        | Remove produce from inventory                            |

## 🏗️ Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB connection string

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Run in development mode:
   ```bash
   npm run dev
   ```

## 📄 License

ISC License
