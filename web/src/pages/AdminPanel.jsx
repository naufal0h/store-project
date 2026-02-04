import React, { useState } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [invoice, setInvoice] = useState("");
  const [order, setOrder] = useState(null);

  const token = localStorage.getItem("seller_token");

  const searchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/${invoice}`
      );
      setOrder(res.data.data);
    } catch {
      alert("Invoice tidak ditemukan");
    }
  };

  const markPaid = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${invoice}/status`,
        { status: "Paid" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Status berhasil diupdate");
      setOrder({ ...order, status: "Paid" });
    } catch {
      alert("Gagal update status");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Admin Panel
      </h1>

      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Masukkan Invoice"
          onChange={(e) => setInvoice(e.target.value)}
        />
        <button
          onClick={searchOrder}
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 rounded"
        >
          Cari
        </button>
      </div>

      {order && (
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
          <p><b>Game:</b> {order.game_name}</p>
          <p><b>Nominal:</b> {order.nominal}</p>
          <p>
            <b>Status:</b>{" "}
            <span
              className={
                order.status === "Paid"
                  ? "text-green-400"
                  : "text-yellow-400"
              }
            >
              {order.status}
            </span>
          </p>

          {order.status !== "Paid" && (
            <button
              onClick={markPaid}
              className="mt-4 bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded"
            >
              Tandai sebagai Paid
            </button>
          )}
        </div>
      )}
    </div>
  );
}
