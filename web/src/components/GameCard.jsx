import React from "react";

export default function GameCard({ game, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-zinc-800 border border-zinc-700 rounded-xl p-5
                 hover:border-amber-400 hover:shadow-lg
                 transition cursor-pointer"
    >
      <h2 className="text-lg font-medium mb-4">
        {game.name}
      </h2>

      <button
        className="w-full bg-amber-500 hover:bg-amber-400
                   text-black font-semibold py-2 rounded-lg"
      >
        Beli
      </button>
    </div>
  );
}
