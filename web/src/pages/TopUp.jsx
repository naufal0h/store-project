import React, { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "../components/GameCard";
import OrderModal from "../components/OrderModal";

export default function TopUp() {
  const [games, setGames] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


  useEffect(() => {
  setLoading(true);
  axios
    .get("http://localhost:5000/api/games")
    .then((res) => {
      setGames(res.data.data);
      setError(null);
    })
    .catch(() => {
      setError("Gagal memuat data game");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

if (loading) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-zinc-400">
      Memuat daftar game...
    </div>
  );
}

if (error) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-red-400">
      {error}
    </div>
  );
}


  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Pilih Game Top Up
      </h1>

      {games.length === 0 ? (
  <div className="text-zinc-400">
    Belum ada game tersedia.
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {games.map((game) => (
      <GameCard
        key={game.id}
        game={game}
        onClick={() => setSelected(game)}
      />
    ))}
  </div>
)}


      {selected && (
        <OrderModal
          game={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
