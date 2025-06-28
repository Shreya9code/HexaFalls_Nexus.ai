"use client";
import Image from "next/image";
import React, { useState } from "react";

const History = () => {
  const [userHistory, setUserHistory] = useState([]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        Previous History
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">Your past activity will appear here</p>

      {userHistory.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-10 text-center text-zinc-500 dark:text-zinc-400">
          <Image src="/logo.svg" height={60} width={60} alt="bulb idea logo" className="mb-4" />
          <p>No history found yet. Start using a tool to see history here!</p>
        </div>
      )}
    </div>
  );
};

export default History;
