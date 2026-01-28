# 🖼️ Image Uploader & Management System

### Machine task for onboarding module

A full-stack image uploader and management application built with **Node.js, Express, React, and MongoDB**, allowing users to upload images in bulk, rearrange them using drag-and-drop, edit image details, and delete uploads.

---

## 🚀 Live Demo

Access the live application here:  
**[Image Uploader Live](https://image-uploader-in.vercel.app)**

- **Note:**  
  The backend is deployed on Render (Free Tier). Due to Render’s inactivity policy, the server may enter a sleep state after inactivity. Please allow **1–2 minutes** for the server to start.

---

## 📋 Task Requirements

### 1. Backend (Node.js, Express, MongoDB)

- Set up a Node.js and Express server.
- Use MongoDB to store user information and image metadata.
- Implement RESTful API endpoints for:
  - User authentication
  - Image upload and management
  - Image reordering
  - Edit and delete operations
- Integrate **Cloudinary** for secure image storage.

---

### 2. Frontend (React)

- Develop a React application to interact with the backend APIs.
- Implement user authentication (Register & Login).
- Enable users to:
  - Upload images in **bulk**
  - Add a **title** for each image
  - View uploaded images with titles
  - Rearrange images using **drag-and-drop**
  - Edit both image and title
  - Delete uploaded images

---

### 3. User Interface & Experience

- Clean and intuitive user interface.
- Drag-and-drop functionality for rearranging images.
- Fully responsive design for desktop, tablet, and mobile devices.
- Real-time feedback for user actions.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

---

### 2. Clone the Repository

```bash
git clone https://github.com/Ebi-manoj/Image-uploader.git
cd image-uploader
```

1. Navigate to the Server directory:
   ```bash
   cd Server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your environment variables (MONGO_URI, JWT_SECRET, etc.).

5. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup

1. Open a new terminal and navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update `VITE_BASE_URL` to point to your local backend API (e.g., `http://localhost:3000/api`).

5. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🛠️ Built With

- React + Vite (Frontend)

- Node.js & Express (Backend)

- MongoDB & Mongoose (Database)

- Cloudinary (Image Storage)

- Drag and Drop (DnD library)

- JWT (Authentication)

- Tailwind CSS (Styling)

- Axios (API Communication)
