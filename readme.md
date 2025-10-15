# NextStep AI - Personalized Internship Recommendation Engine

NextStep AI is a full-stack web application designed to help students and professionals find relevant internship opportunities. It leverages a recommendation system to match internships with a user's skills, providing a personalized and efficient job-seeking experience.

## ✨ Features

- **User Authentication**: Secure registration and login system.
- **Personalized Recommendations**: AI-powered suggestions for internships based on the user's skills.
- **Comprehensive Search**: Browse, search, and filter through a wide range of internship listings.
- **Wishlist Management**: Save interesting internships to a personal wishlist for later viewing.
- **Profile Customization**: Easily manage user profiles and update skills to refine recommendations.

## 🚀 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## 📂 Project Structure

The project is organized into three main directories:

- `Frontend/`: Contains the React-based user interface.
- `Backend/`: Holds the Node.js and Express.js server logic and API endpoints.
- `Database/`: Includes the SQL script for database setup and seeding.

## ⚙️ Setup and Installation

Follow these steps to get the project running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://www.mysql.com/downloads/) Server

### 1. Database Setup

1.  Ensure your MySQL server is running.
2.  Connect to your MySQL instance and execute the script located in `Database/setup.sql`. This will create the `sih_internships` database, define the necessary tables, and populate them with sample data.

    ```bash
    mysql -u your_username -p < Database/setup.sql
    ```

### 2. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd Backend
    ```
2.  Install the required dependencies:
    ```bash
    npm install
    ```
3.  Open `db.js` and update the MySQL connection pool with your database credentials (user and password).
    ```javascript
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'your_mysql_username', // 👈 Update here
        password: 'your_mysql_password', // 👈 Update here
        database: 'sih_internships',
        // ...
    });
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3001`.

### 3. Frontend Setup

1.  Open a new terminal and navigate to the frontend directory:
    ```bash
    cd Frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will open automatically in your browser at `http://localhost:3000`.

## <caption>API Endpoints

The backend provides the following RESTful API endpoints:

| Method | Endpoint                      | Description                               |
| :----- | :---------------------------- | :---------------------------------------- |
| `POST` | `/api/auth/register`          | Register a new user.                      |
| `POST` | `/api/auth/login`             | Log in an existing user.                  |
| `GET`  | `/api/user/profile`           | Get the current user's profile.          |
| `PUT`  | `/api/user/profile`           | Update the user's skills.                |
| `GET`  | `/api/internships`            | Retrieve all available internships.       |
| `GET`  | `/api/recommendations`        | Get personalized internship recommendations. |
| `GET`  | `/api/wishlist`               | Get the user's complete wishlist.        |
| `POST` | `/api/wishlist`               | Add an internship to the wishlist.        |
| `DELETE`| `/api/wishlist/:internship_id`| Remove an internship from the wishlist.   |
| `GET`  | `/api/wishlist/ids`           | Get the IDs of all wishlisted internships.|

---
