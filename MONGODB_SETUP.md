# MongoDB Setup Guide

## Overview
Proyek ini telah berhasil diintegrasikan dengan MongoDB Atlas. Berikut adalah panduan lengkap untuk setup dan penggunaan.

## ✅ Setup yang Telah Selesai

### 1. Konfigurasi Database
- ✅ File `lib/mongodb.ts` - Konfigurasi koneksi MongoDB
- ✅ File `lib/db.ts` - Utility functions untuk database
- ✅ Environment variables di `.env.local`

### 2. API Routes
- ✅ `app/api/test-db/route.ts` - Test koneksi database
- ✅ `app/api/projects/route.ts` - CRUD operations untuk projects

### 3. Components
- ✅ `app/components/ProjectsList.tsx` - Menampilkan daftar projects
- ✅ `app/components/AddProjectForm.tsx` - Form untuk menambah project

### 4. Pages
- ✅ `app/admin/page.tsx` - Halaman admin untuk mengelola projects

### 5. Data Seeding
- ✅ `scripts/seed-data.ts` - Script untuk menambah data contoh
- ✅ 4 sample projects telah ditambahkan ke database

## 🔧 Cara Menggunakan

### 1. Test Koneksi Database
Kunjungi: `http://localhost:3000/api/test-db`

### 2. Halaman Admin
Kunjungi: `http://localhost:3000/admin`

### 3. API Endpoints

#### GET /api/projects
Mengambil semua projects dari database
```bash
curl http://localhost:3000/api/projects
```

#### POST /api/projects
Menambah project baru
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A description of my project",
    "technologies": ["React", "Node.js", "MongoDB"],
    "githubUrl": "https://github.com/example/project",
    "liveUrl": "https://project-demo.vercel.app",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### 4. Menambah Data Baru
```bash
npm run seed
```

## 📊 Struktur Database

### Collection: projects
```typescript
interface Project {
  _id: ObjectId
  title: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}
```

## 🔒 Environment Variables

File `.env.local` berisi:
```env
MONGODB_URI=mongodb+srv://syarifroma:aTPjy3cVzI2C57A0@cluster1.kozbnl4.mongodb.net/?retryWrites=true&w=majority&appName=cluster1
MONGODB_DB=portofolio
```

## 🚀 Deployment

### Vercel
1. Tambahkan environment variables di dashboard Vercel
2. Deploy aplikasi
3. Database akan otomatis terhubung

### Environment Variables untuk Production
- `MONGODB_URI` - Connection string MongoDB
- `MONGODB_DB` - Nama database (default: portofolio)

## 🛠️ Troubleshooting

### Error: "Invalid/Missing environment variable: MONGODB_URI"
- Pastikan file `.env.local` ada di root directory
- Pastikan variable `MONGODB_URI` terisi dengan benar

### Error: "Failed to connect to database"
- Periksa connection string MongoDB
- Pastikan IP address diizinkan di MongoDB Atlas
- Periksa username dan password

### Error: "Database connection failed"
- Restart development server
- Periksa network connection
- Verifikasi cluster status di MongoDB Atlas

## 📝 Contoh Penggunaan di Component

```typescript
'use client'

import { useState, useEffect } from 'react'

export default function MyComponent() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setData(data.data)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {data.map(item => (
        <div key={item._id}>{item.title}</div>
      ))}
    </div>
  )
}
```

## 🎯 Next Steps

1. **Customize Data Model** - Sesuaikan struktur data sesuai kebutuhan
2. **Add Authentication** - Implementasi login/admin panel
3. **Add Image Upload** - Integrasi dengan cloud storage
4. **Add Search & Filter** - Implementasi pencarian dan filter
5. **Add Pagination** - Untuk data yang banyak
6. **Add Real-time Updates** - Menggunakan WebSocket

## 📞 Support

Jika ada masalah dengan setup MongoDB, periksa:
1. MongoDB Atlas dashboard
2. Network connectivity
3. Environment variables
4. Console logs di browser dan terminal 