# Environment Variables Setup

This application requires the following environment variables to be configured:

## Required for Database (MongoDB)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=portofolio
```

## Required for Contact Form (SMTP)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
RECIPIENT_EMAIL=your-email@gmail.com
```

## Optional for Development

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Setup Instructions

1. Create a `.env.local` file in the root directory
2. Add the environment variables above with your actual values
3. For Vercel deployment, add these variables in your Vercel project settings

## Notes

- The application will work without MongoDB configuration, but API routes will return appropriate error messages
- Contact form will not work without SMTP configuration
- Make sure to use environment variables in production, never commit sensitive data to version control 