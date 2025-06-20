# Portfolio Project

This is a Next.js portfolio project with MongoDB integration.

## Setup MongoDB

1. Create a `.env.local` file in the root directory with the following content:

```env
MONGODB_URI=mongodb+srv://syarifroma:aTPjy3cVzI2C57A0@cluster1.kozbnl4.mongodb.net/?retryWrites=true&w=majority&appName=cluster1
MONGODB_DB=portofolio
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Test the database connection by visiting:
```
http://localhost:3000/api/test-db
```

## API Endpoints

- `GET /api/test-db` - Test database connection
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project

## Database Structure

The project uses MongoDB with the following collections:
- `projects` - Portfolio projects data

## Features

- Next.js 15 with App Router
- MongoDB integration
- TypeScript support
- Tailwind CSS
- Three.js for 3D graphics
- Framer Motion for animations

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
