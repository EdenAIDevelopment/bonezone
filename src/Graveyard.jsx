
import React, { useEffect, useState } from "react";

const API_URL = "https://api.pump.fun/graphql";

const fetchDeadCoins = async () => {
  const query = `
    query DeadCoins {
      allMints {
        address
        name
        symbol
        lastTransactionAt
        totalVolume
        holdersCount
      }
    }
  \`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  const coins = json?.data?.allMints || [];

  const now = new Date();
  return coins.filter((c) => {
    const lastTx = new Date(c.lastTransactionAt);
    const hoursSince = (now - lastTx) / (1000 * 60 * 60);
    return c.totalVolume < 1 && c.holdersCount < 20 && hoursSince > 12;
  });
};

export default function Graveyard() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    fetchDeadCoins().then(setCoins);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-red-500">
        💀 BONEZONE: DEGEN CHAOS 💀
      </h1>
      <p className="text-center text-yellow-400 mb-4">
        Revive dead coins. Reap the rewards. Or rug trying.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {coins.map((coin, i) => (
          <div
            key={i}
            className="bg-red-900 p-4 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <h2 className="text-xl font-bold text-green-300">
              {coin.name} ({coin.symbol})
            </h2>
            <p className="text-sm text-white">Holders: {coin.holdersCount}</p>
            <p className="text-sm text-white">
              Last Trade: {new Date(coin.lastTransactionAt).toLocaleString()}
            </p>
            <p className="text-sm text-white">
              Total Volume: {coin.totalVolume} SOL
            </p>
            <button className="mt-2 px-3 py-1 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-300 transition">
              Adopt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
