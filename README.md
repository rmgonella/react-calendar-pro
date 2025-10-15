Calendar Pro

Developed by: Rodrigo Marchi Gonella

Calendar Pro is a complete full-stack appointment management system built with React on the frontend and Node.js/Express with MongoDB on the backend.

Features

JWT Authentication: Secure user login and registration.

Appointment CRUD: Create, read, update, and delete events with date, time, and description.

Interactive Interface: Uses React Big Calendar for a modern and functional calendar view.

Modern Design: Frontend enhanced with Tailwind CSS and shadcn/ui components for a superior user experience.

Filters: Allows filtering appointments by status (“Completed” and “Pending”).

Visual Notifications: Uses React Toastify for visual user feedback.

Project Structure

The project is divided into two main folders: backend and frontend.

Backend (Node.js/Express/MongoDB)
File/Directory	Description
server.js	Application entry point. Configures Express and connects to MongoDB.
.env	Environment variables (PORT, MONGODB_URI, JWT_SECRET).
models/User.js	Mongoose model for users (includes password hashing with bcryptjs).
models/Event.js	Mongoose model for appointments.
middleware/auth.js	Middleware for JWT token verification.
routes/auth.js	Authentication routes (/register, /login, /me).
routes/events.js	CRUD routes for appointments (includes filters by status and date).
Frontend (React)
File/Directory	Description
src/App.jsx	Main component managing authentication state and rendering Login or Calendar screens.
src/contexts/AuthContext.jsx	React Context that manages authentication state and login/register/logout functions.
src/services/api.js	Axios instance configured with base URL and interceptor to attach JWT token.
src/services/eventService.js	Functions to interact with the backend’s CRUD event routes.
src/components/Login.jsx	Form component for login and registration with enhanced design.
src/components/Header.jsx	Header component displaying user info and logout button.
src/components/Calendar.jsx	Main calendar component with statistics and advanced filters.
src/components/EventModal.jsx	Modal for creating and editing events, with validation and UX improvements.
src/utils/dateUtils.js	Utility functions for date formatting.
public/images/	Contains demonstration images.
Local Installation Guide

Follow the steps below to set up and run the project locally.

Prerequisites

Node.js (v18+)

MongoDB (installed and running locally)

1. Clone the Repository
# This step is illustrative but would be the first in a real environment
# git clone <repository-url> calendar-pro
# cd calendar-pro

2. Backend Setup

Navigate to the backend folder and install dependencies:

cd backend
npm install


Create a .env file inside the backend folder with the following variables:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/calendar-pro
JWT_SECRET=calendar_pro_jwt_secret_key_2024
NODE_ENV=development


Start the server:

npm run dev


The server will be running at http://localhost:5000.

3. Frontend Setup

Navigate to the frontend folder and install dependencies (using pnpm as in the template, but npm install also works):

cd ../frontend
pnpm install


Start the React application:

pnpm run dev --host


The app will be accessible at http://localhost:5173.

Screenshots (Enhanced Design)

Demo images are located in frontend/public/images/.

Login Screen

Calendar Screen

Event Registration Modal

Routes and Components Overview
Backend Routes
Method	Route	Description	Access
POST	/api/auth/register	Creates a new user.	Public
POST	/api/auth/login	Authenticates the user and returns a JWT token.	Public
GET	/api/auth/me	Returns the logged-in user’s data.	Private
GET	/api/events	Lists all user events (supports status, startDate, and endDate filters).	Private
POST	/api/events	Creates a new event.	Private
PUT	/api/events/:id	Updates an existing event.	Private
DELETE	/api/events/:id	Deletes an event.	Private
PATCH	/api/events/:id/status	Updates event status to “Completed” or “Pending”.	Private
Key Frontend Components
Component	Description
AuthContext	Manages global authentication state. Stores the JWT token in localStorage and automatically attaches it to API requests via Axios interceptor.
Login	Login and registration form component. Uses react-toastify for success/error messages.
Calendar	The core of the application. Manages event state, applies filters, and renders React Big Calendar. Includes a statistics panel.
EventModal	Modal form for event CRUD interface. Allows creating, editing, deleting, and updating appointment status with form validation.
eventService	Abstraction layer for API calls, simplifying backend communication.
Credits

Developed by Rodrigo Marchi Gonella.
