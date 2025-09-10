# Setup Cloudinary untuk File Upload

## 1. Buat Akun Cloudinary

1. Kunjungi https://cloudinary.com/
2. Klik "Sign Up" dan buat akun gratis
3. Verifikasi email Anda

## 2. Dapatkan API Credentials

1. Setelah login, masuk ke Dashboard
2. Di bagian "Account Details", Anda akan melihat:
   - Cloud Name
   - API Key
   - API Secret

## 3. Update Environment Variables

Buka file `.env.local` dan update nilai berikut dengan credentials Anda:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Ganti:
- `your_cloud_name_here` dengan Cloud Name Anda
- `your_api_key_here` dengan API Key Anda  
- `your_api_secret_here` dengan API Secret Anda

## 4. Restart Development Server

Setelah mengupdate environment variables, restart development server:

```bash
npm run dev
```

## 5. Test Upload

1. Buka halaman admin `/admin`
2. Coba upload gambar atau video
3. File akan otomatis terupload ke Cloudinary dan URL-nya akan tersimpan di database

## Fitur yang Tersedia:

### ✅ Upload File dari Komputer
- Drag & drop atau click untuk browse file
- Support gambar: JPEG, PNG, GIF, WebP
- Support video: MP4, MOV, AVI, WMV
- Maksimal ukuran file: 10MB
- Preview file sebelum upload
- Progress bar saat upload

### ✅ File Management
- Otomatis upload ke Cloudinary
- URL aman dan optimized
- Bisa hapus file yang sudah diupload
- Preview file yang diupload

### ✅ Fallback URL Manual
- Tetap bisa input URL manual
- Support URL dari platform lain (YouTube, Vimeo, dll)

### ✅ Auto Optimization
- Gambar otomatis dioptimasi untuk web
- Format auto (WebP jika didukung browser)
- Kualitas auto sesuai kebutuhan

## Keuntungan Menggunakan Cloudinary:

1. **Gratis**: Plan gratis dengan 25GB storage & 25GB bandwidth per bulan
2. **CDN Global**: File tersedia dengan cepat di seluruh dunia
3. **Auto Optimization**: Gambar otomatis dioptimasi
4. **Transformasi**: Bisa resize, crop, watermark otomatis
5. **Backup**: File tersimpan aman di cloud
6. **Analytics**: Bisa lihat usage statistics

## Alternative Services:

Jika ingin menggunakan service lain, bisa diganti dengan:
- AWS S3
- Supabase Storage  
- Firebase Storage
- Vercel Blob Storage

Tinggal update file `lib/cloudinary.ts` dengan API yang sesuai.
