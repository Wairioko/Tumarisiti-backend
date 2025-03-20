# Tumarisiti Backend

## Overview

Tumarisiti is a MERN-based application that allows users to upload invoices via CSV, check their transmission status with KRA, and send automated messages to suppliers. This backend provides APIs for invoice management, user authentication, and dashboard data retrieval.

## Technologies Used

- **Node.js**
- **Express.js**
- **Multer** (for file uploads)
- **JWT Authentication**

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

```sh
# Clone the repository
git clone https://github.com/your-repo/tumarisiti-backend.git
cd tumarisiti-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
nano .env  # Edit and update necessary values

# Start the server
npm start
```

## API Routes

### Invoice Routes

```http
POST   /api/invoice/upload      # Upload an invoice CSV file (JWT required)
DELETE /api/invoice/delete      # Delete an invoice (JWT required)
PUT    /api/invoice/update      # Edit an invoice (JWT required)
GET    /api/invoices/status     # Get the status of invoices (JWT required)
```

### User Authentication Routes

```http
POST   /api/company/registration  # Register a new company
POST   /api/company/login         # Log in an existing company
GET    /api/auth/status           # Check authentication status
POST   /api/auth/logout           # Logout the company
```

### Dashboard Route

```http
GET    /api/dashboard     # Fetch dashboard data (JWT required)
```

## Middleware

```js
import { verifyJWT } from "../../../middlewares.mjs";
```

- **`verifyJWT`**: Ensures only authenticated users can access protected routes.

## File Upload Handling

- Uses **Multer** for handling file uploads in memory storage.
- Endpoint expects a single file under the key **`file`**.

## License

```txt
MIT License
```

## Author

Charles Mungai - [charlesmungai5@gmail.com]
