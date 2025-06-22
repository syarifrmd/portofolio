# Personal Portfolio Website with Next.js

This is a modern, dynamic, and fully-featured personal portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. It's designed to showcase projects in a beautiful and interactive way, and includes a functional contact form and an admin panel for easy project management.

## ✨ Key Features

-   **Dynamic Project Showcase**: Projects are fetched from a MongoDB database and displayed on the main page.
-   **Interactive UI**:
    -   Smooth animations and transitions using Framer Motion and AOS.
    -   "Show More / Show Less" functionality for the project list.
    -   3D-tilting project cards and profile card for a creative touch.
-   **Detailed Project Pages**: Each project has its own dedicated page with:
    -   An interactive image carousel to view all project images.
    -   Detailed information including description, tech stack, status, and creation date.
    -   Links to live demos and GitHub repositories.
-   **Functional Contact Form**:
    -   A sleek contact form that sends emails directly to your inbox.
    -   Powered by a secure Next.js API Route and Nodemailer.
    -   Includes loading and success/error states for a great user experience.
-   **Admin Ready**: Includes routes and components for an admin panel to add, edit, and manage projects.
-   **Modern Design**: A beautiful dark-themed design with animated gradients and glowing background elements.

## 🚀 Technologies Used

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) & [AOS](https://michalsnik.github.io/aos/)
-   **Emailing**: [Nodemailer](https://nodemailer.com/)

## 🛠️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   `npm` or `yarn`
-   A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a free Atlas cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/portofolio.git
cd portofolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a file named `.env.local` in the root of your project and add the following variables.

**For the database connection:**

```env
# MongoDB Connection URI
MONGODB_URI=your_mongodb_connection_string
```

**For the contact form emailing:**

You'll need an SMTP provider. For Gmail, you'll need to enable 2-Step Verification and create an "App Password".

```env
# Email (Nodemailer) Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_16_digit_app_password
RECIPIENT_EMAIL=your-email@gmail.com
```

### 4. Seed the Database (Optional)

You can use the provided script to seed your database with some initial project data.

```bash
npm run seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

-   `app/`: Contains all the routes, pages, and UI components (App Router).
-   `app/api/`: All API routes are defined here (`/contact`, `/projects`).
-   `components/`: Reusable React components used throughout the application.
-   `lib/`: Utility files, including database connection logic (`mongodb.ts`).
-   `scripts/`: Contains scripts for tasks like seeding the database.
-   `public/`: Static assets like images and fonts.

---

Feel free to customize this portfolio to make it your own!
