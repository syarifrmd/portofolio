import { MongoClient } from 'mongodb'

const uri = 'mongodb+srv://syarifroma:aTPjy3cVzI2C57A0@cluster1.kozbnl4.mongodb.net/?retryWrites=true&w=majority&appName=cluster1'
const dbName = 'portofolio'

const sampleProjects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'A full-stack e-commerce platform built with Next.js, featuring user authentication, product management, and payment integration.',
    techStack: ['Next.js', 'TypeScript', 'MongoDB', 'Stripe', 'Tailwind CSS'],
    status: 'Completed',
    githubUrl: 'https://github.com/example/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Task Management App',
    category: 'Web Application',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    status: 'In Progress',
    githubUrl: 'https://github.com/example/task-manager',
    liveUrl: 'https://task-manager-demo.vercel.app',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Weather Dashboard',
    category: 'Web Application',
    description: 'A beautiful weather dashboard that displays current weather conditions and forecasts for multiple locations with interactive maps.',
    techStack: ['Vue.js', 'OpenWeather API', 'Chart.js', 'CSS Grid'],
    status: 'Completed',
    githubUrl: 'https://github.com/example/weather-dashboard',
    liveUrl: 'https://weather-dashboard-demo.vercel.app',
    image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=500&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Portfolio Website',
    category: 'Web Development',
    description: 'A modern, responsive portfolio website showcasing projects and skills with smooth animations and interactive elements.',
    techStack: ['Next.js', 'Framer Motion', 'Three.js', 'Tailwind CSS'],
    status: 'Completed',
    githubUrl: 'https://github.com/example/portfolio',
    liveUrl: 'https://portfolio-demo.vercel.app',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    description: 'A secure mobile banking application with biometric authentication, real-time transactions, and financial analytics.',
    techStack: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
    status: 'Planned',
    githubUrl: 'https://github.com/example/mobile-banking',
    liveUrl: '',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=300&fit=crop',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDatabase() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db(dbName)
    const collection = db.collection('projects')
    
    // Clear existing data
    await collection.deleteMany({})
    console.log('🗑️  Cleared existing projects')
    
    // Insert sample data
    const result = await collection.insertMany(sampleProjects)
    console.log(`✅ Inserted ${result.insertedCount} sample projects`)
    
    console.log('🎉 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await client.close()
  }
}

// Run the seeding function
seedDatabase() 