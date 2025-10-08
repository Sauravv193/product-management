# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

A full-stack product management web application with JWT authentication and CRUD operations. The system allows users to manage products with filtering and search capabilities.

**Key Features:**
- JWT-based authentication (signup, login, logout)
- Product CRUD operations with filtering by category, price range, and rating
- Search functionality for products
- Protected routes with authentication middleware
- PostgreSQL data persistence

## Architecture

### High-Level Structure
This is a **3-tier monorepo architecture** with separate frontend and backend applications:

```
product-management/
├── product-management-frontend/    # React.js client application
├── product-management-backend/     # Spring Boot API server
└── README.md                      # Project documentation
```

### Backend Architecture (Spring Boot)
**Location:** `product-management-backend/product-management/`

**Package Structure:**
- `com.productmanagement.product_management`
  - `controller/` - REST API endpoints (@RestController)
  - `service/` - Business logic layer (@Service)
  - `entity/` - JPA entities (@Entity)
  - `repository/` - Data access layer
  - `security/` - JWT authentication & authorization
  - `dto/` - Data transfer objects

**Key Components:**
- **ProductController** - Main API endpoints for product CRUD and filtering
- **AuthController** - Authentication endpoints (login/signup)
- **Product Entity** - Core domain model (id, name, description, price, rating, category)
- **User Entity** - User management for authentication
- **JWT Security** - Token-based authentication with Spring Security

**Database Configuration:**
- PostgreSQL on port 5432 (database: `productdb`)
- Hibernate auto-DDL update enabled
- Server runs on port 8081

### Frontend Architecture (React.js)
**Location:** `product-management-frontend/`

**Structure:**
- `src/pages/` - Route components (Login, Signup, ProductList, CreateProduct, UpdateProduct)
- `src/components/` - Reusable UI components (PrivateRoute for auth protection)
- `src/services/` - API service layer (productService.js handles HTTP calls)

**Key Components:**
- **App.js** - Main routing configuration with protected routes
- **ProductService** - Axios-based API client with JWT token handling
- **PrivateRoute** - Authentication wrapper component
- Client runs on port 3000, connects to backend on port 8081

### Data Flow
1. **Authentication**: User authenticates → JWT token stored in localStorage
2. **API Calls**: Frontend sends requests with Authorization header
3. **CORS**: Backend configured for localhost:3000 origin
4. **Data Persistence**: Spring Data JPA → PostgreSQL

## Development Commands

### Backend (Spring Boot)
Navigate to: `product-management-backend/product-management/`

```bash
# Build and run the application
mvn spring-boot:run

# Clean and compile
mvn clean compile

# Run tests
mvn test

# Package as JAR
mvn clean package

# Run with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend (React)
Navigate to: `product-management-frontend/`

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- ProductList.test.js
```

### Database Setup
Ensure PostgreSQL is running with:
- **Database**: `productdb`
- **Port**: 5432
- **Username**: `postgres`
- **Password**: `saurav` (update in application.properties)

### Full Stack Development
1. **Start Backend**: In `product-management-backend/product-management/` run `mvn spring-boot:run`
2. **Start Frontend**: In `product-management-frontend/` run `npm start`
3. **Access Application**: Open http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Products (Protected Routes)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/filter` - Filter products by category, price, rating

## Key Technologies

**Backend:**
- Spring Boot 3.4.4
- Java 17
- Spring Security (JWT)
- Spring Data JPA
- PostgreSQL
- Maven
- Lombok
- JJWT 0.11.5

**Frontend:**
- React 19.1.0
- React Router DOM 7.5.0
- Axios 1.8.4
- Create React App
- Jest & React Testing Library

## Environment Configuration

**Backend Environment Variables/Properties:**
- `server.port=8081`
- `spring.datasource.url=jdbc:postgresql://localhost:5432/productdb`
- `jwt.secret` - JWT signing secret
- `jwt.expiration=86400000` (24 hours)

**Frontend Environment:**
- Development server: http://localhost:3000
- API Base URL: http://localhost:8081/api

## Authentication Flow
1. User submits credentials to `/api/auth/login`
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. All subsequent API calls include `Authorization: Bearer {token}` header
5. Backend validates JWT on protected endpoints

## Development Notes

- **CORS**: Backend configured for localhost:3000 origin
- **Database**: Uses Hibernate DDL auto-update for schema management
- **Authentication**: JWT tokens stored in browser localStorage
- **API Client**: Axios service layer handles token injection automatically
- **Routing**: React Router with PrivateRoute wrapper for protected pages
- **Build Tools**: Maven for backend, npm/Create React App for frontend