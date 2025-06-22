# Vercel Troubleshooting Guide

## Masalah: Local Lancar, Vercel Failed

### 1. Cek Environment Variables di Vercel

**Langkah-langkah:**
1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Klik tab **"Settings"**
4. Scroll ke **"Environment Variables"**
5. Pastikan ada variable berikut:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=portofolio
```

### 2. Cek MongoDB Atlas Whitelist

**Masalah:** Vercel IP addresses tidak di-whitelist di MongoDB Atlas

**Solusi:**
1. Buka [MongoDB Atlas](https://cloud.mongodb.com)
2. Pilih cluster Anda
3. Klik **"Network Access"**
4. Klik **"Add IP Address"**
5. Klik **"Allow Access from Anywhere"** (0.0.0.0/0)
6. Klik **"Confirm"**

### 3. Test API Route

Setelah deploy, test endpoint ini:

```
https://your-domain.vercel.app/api/test-db
```

**Response yang diharapkan:**
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

### 4. Cek Vercel Logs

1. Di Vercel dashboard, klik tab **"Functions"**
2. Cari function `/api/projects`
3. Klik untuk melihat logs
4. Cari error messages

### 5. Debug dengan Console Logs

Saya sudah menambahkan console logs yang detail. Cek browser console untuk melihat:

- 🔍 URL yang di-fetch
- 📡 Response status
- ❌ Error messages
- 🔄 Fallback data usage

### 6. Quick Fix - Gunakan Fallback Data

Jika masih bermasalah, aplikasi akan otomatis menggunakan fallback data. Data ini akan muncul sebagai placeholder sampai database berfungsi.

### 7. Alternative: Gunakan MongoDB Atlas Data API

Jika masih bermasalah, bisa gunakan MongoDB Atlas Data API:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&appName=Cluster0
```

### 8. Cek Database Connection String

Pastikan format connection string benar:

✅ **Benar:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

❌ **Salah:**
```
mongodb://username:password@cluster.mongodb.net/database
```

### 9. Redeploy Setelah Perubahan

Setelah menambahkan environment variables:

1. Klik **"Redeploy"** di Vercel dashboard
2. Atau push perubahan ke GitHub
3. Tunggu deployment selesai
4. Test lagi

### 10. Monitoring

Setelah berhasil:

1. Monitor Vercel function logs
2. Cek browser console untuk errors
3. Test semua fitur (projects, contact form)
4. Pastikan responsive design berfungsi

## Common Error Messages

| Error | Penyebab | Solusi |
|-------|----------|--------|
| `MONGODB_URI is not configured` | Environment variable tidak ada | Tambahkan di Vercel dashboard |
| `Invalid scheme` | Format URI salah | Gunakan `mongodb+srv://` |
| `Connection timeout` | IP tidak di-whitelist | Allow access from anywhere |
| `Authentication failed` | Username/password salah | Cek credentials |

## Support

Jika masih bermasalah:
1. Cek Vercel deployment logs
2. Cek MongoDB Atlas logs
3. Test dengan Postman/Insomnia
4. Cek browser Network tab 