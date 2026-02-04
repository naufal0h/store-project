import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xl">
          <ShoppingCart size={22} />
          Kstore
        </div>

        <nav className="flex gap-6 text-sm">
          <Link
            to="/"
            className={`hover:text-amber-400 ${
              pathname === "/" ? "text-amber-400" : "text-zinc-300"
            }`}
          >
            Top Up
          </Link>
          <Link
            to="/daftar-harga"
            className={`hover:text-amber-400 ${
              pathname === "/daftar-harga"
                ? "text-amber-400"
                : "text-zinc-300"
            }`}
          >
            Daftar Harga
          </Link>
        </nav>
      </div>
    </header>
  );
}
