'use client';

import React, { useState } from 'react';

export default function SentenceLookup({ onSearch }) {
  const [mood, setMood] = useState('declarative');
  const [structure, setStructure] = useState('simple');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch({ mood, structure });
    console.log('Search', { mood, structure });
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Navbar */}
      <header className="navbar bg-neutral text-neutral-content">
        <div className="flex-1 px-6">
          <a className="btn btn-ghost normal-case text-xl">GRAMMIFY</a>
        </div>
        <div className="flex-none pr-6">
          <div className="hidden md:flex items-center space-x-4">
            <div className="dropdown dropdown-hover">
              <label tabIndex={0} className="btn btn-ghost normal-case">ANALYZE SENTENCE</label>
              <ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-black">
                <li><a>Analyze (example)</a></li>
              </ul>
            </div>
            <button className="btn btn-ghost flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 11c1.657 0 3-1.343 3-3S7.657 5 6 5s-3 1.343-3 3 1.343 3 3 3zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
              </svg>
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center pt-16 pb-24">
        <div className="w-full max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-center mb-12 tracking-wider">SENTENCE LOOKUP</h1>

          <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-600 mb-2">Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="select select-bordered w-full bg-base-200"
                >
                  <option value="declarative">Declarative</option>
                  <option value="interrogative">Interrogative</option>
                  <option value="exclamative">Exclamative</option>
                  <option value="imperative">Imperative</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm text-gray-600 mb-2">Structure</label>
                <select
                  value={structure}
                  onChange={(e) => setStructure(e.target.value)}
                  className="select select-bordered w-full bg-base-200"
                >
                  <option value="simple">Simple</option>
                  <option value="compound">Compound</option>
                  <option value="complex">Complex</option>
                  <option value="compound-complex">Compound Complex</option>
                </select>
              </div>

              <div className="md:col-span-1 flex justify-start md:justify-end">
                <button type="submit" className="btn btn-neutral px-8">
                  SEARCH
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-transparent text-base-content">
        <div>
          <p className="text-sm">Copyright © Pablo Ortiz</p>
        </div>
      </footer>
    </div>
  );
}