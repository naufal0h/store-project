import React, { useState } from "react";
import axios from "axios";

export default function OrderModal({ game, onClose }) {
  const [product, setProduct] = useState(game.products[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const submit = async () => {
    if (!name || !phone) {
      alert("Nama dan No HP wajib diisi");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(
        "http://localhost:5000/api/checkout",
        {
          product_id: product.id,
          buyer_name: name,
          buyer_phone: phone,
        }
      );

      // simpan invoice & info penting
      setSuccess(res.data.transaction);
    } catch {
      alert("Gagal membuat pesanan");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 POPUP SUCCESS (INVOICE)
  if (success) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-3 text-green-400">
            Pesanan Berhasil
          </h2>

          <p className="text-sm text-zinc-400 mb-2">
            Simpan invoice ini untuk cek status pesanan
          </p>

          <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-zinc-400">Invoice</p>
            <p className="font-mono text-amber-400 text-lg">
              {success.invoice}
            </p>
          </div>

          <p className="mb-4">
            Total Bayar:{" "}
            <b className="text-amber-400">
              Rp {success.amount}
            </b>
          </p>

          <button
            onClick={onClose}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2 rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    );
  }

  // 🔽 FORM ORDER NORMAL
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {game.name}
        </h2>

        <select
          className="w-full mb-3 p-2 rounded bg-zinc-800 border border-zinc-700"
          onChange={(e) =>
            setProduct(
              game.products.find(
                (p) => p.id === Number(e.target.value)
              )
            )
          }
        >
          {game.products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nominal} - Rp {p.price}
            </option>
          ))}
        </select>

        <input
          className="w-full mb-3 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 p-2 rounded bg-zinc-800 border border-zinc-700"
          placeholder="No HP"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={submit}
            disabled={submitting}
            className={`flex-1 font-semibold py-2 rounded ${
              submitting
                ? "bg-zinc-600 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400 text-black"
            }`}
          >
            {submitting ? "Memproses..." : "Buat Pesanan"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
