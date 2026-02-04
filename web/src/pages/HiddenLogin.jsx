import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function HiddenLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/seller-login",
        { username, password }
      );

      localStorage.setItem("seller_token", res.data.token);
      navigate("/admin");
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-zinc-800 border border-zinc-700 p-6 rounded-xl w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">
          Seller Login
        </h1>

        <input
          className="w-full mb-3 p-2 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-2 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
