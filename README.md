# 🛒 Kstore — Mini E-Commerce Web App

Kstore adalah aplikasi **mini e-commerce web** yang dibangun sebagai project pembelajaran sekaligus portfolio.  
Aplikasi ini mensimulasikan alur **top up game / digital product** dari sisi user hingga admin (seller).

> 🎯 Fokus utama: arsitektur rapi, alur realistis, dan siap deploy (production-ready).

---

## ✨ Fitur Utama

### 👤 User
- Melihat daftar game & produk
- Membuat pesanan (checkout)
- Mendapatkan **invoice unik**
- Melacak status pesanan (Pending / Paid)

### 🧑‍💼 Admin (Seller)
- Login seller (JWT)
- Cari pesanan berdasarkan invoice
- Update status pesanan → **Paid**

---

## 🧱 Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** (manual setup)
- React Router DOM
- Axios

### Backend
- **Node.js** (ES Module)
- **Express**
- SQLite
- JWT Authentication

### Tools
- Postman (API testing)
- Git & GitHub
- dotenv (env config)

---

## 📁 Struktur Project

kstore/
├─ api/ # Backend (Express + SQLite)
│ ├─ server.js
│ ├─ package.json
│ └─ .env
│
├─ web/ # Frontend (React + Vite)
│ ├─ src/
│ │ ├─ components/
│ │ ├─ pages/
│ │ ├─ App.jsx
│ │ └─ main.jsx
│ ├─ package.json
│ └─ .env
│
└─ README.md


---

## ⚙️ Environment Variables

### Backend (`api/.env`)
```env
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
Frontend (web/.env)
VITE_API_URL=http://localhost:5000
⚠️ File .env tidak di-commit ke repository.

🚀 Cara Menjalankan Project (Local)
1️⃣ Clone repository
git clone https://github.com/USERNAME/kstore.git
cd kstore
2️⃣ Jalankan Backend
cd api
npm install
npm run dev
Backend akan berjalan di:

http://localhost:5000
3️⃣ Jalankan Frontend
cd web
npm install
npm run dev
Frontend akan berjalan di:

http://localhost:5173
🧪 Testing
API diuji menggunakan Postman

Frontend diuji langsung melalui browser

Flow utama:

User membuat pesanan

User mendapat invoice

Admin login

Admin update status pesanan

🧠 Catatan Pengembangan
Project ini sengaja dibuat:

tanpa library berlebihan

tanpa state management kompleks

fokus ke fundamental fullstack

Cocok untuk:

Portfolio developer

Latihan fullstack end-to-end

Dasar e-commerce system

📌 Roadmap (Opsional)
Protect admin route (auth guard)

Simpan invoice di localStorage

Payment gateway sandbox

Deployment (Vercel + Railway)

👨‍💻 Author
Dibuat oleh Naufal
Sebagai project pembelajaran & portfolio web developer.