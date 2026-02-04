import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import TopUp from "./pages/TopUp";
import DaftarHarga from "./pages/DaftarHarga";
import HiddenLogin from "./pages/HiddenLogin";
import AdminPanel from "./pages/AdminPanel";


export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900">
      <Header />

      <Routes>
        <Route path="/" element={<TopUp />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/daftar-harga" element={<DaftarHarga />} />
        <Route path="/hidden-login" element={<HiddenLogin />} />
      </Routes>
    </div>
  );
}
