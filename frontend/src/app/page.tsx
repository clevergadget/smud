'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [intro, setIntro] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [log, setLog] = useState<{ role: 'user' | 'ai'; message: string }[]>([]);


  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/intro?mud=darkswamp`);
        const text = await res.text();
        setIntro(text);
      } catch (err) {
        console.error('Failed to fetch intro:', err);
      }
    };
  
    fetchIntro();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    setLog((prev) => [...prev, { role: 'user', message: userMessage }]);
    setUserMessage('');

    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      setLog((prev) => [...prev, { role: 'ai', message: data.reply || '' }]);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white p-4">
      {/* Title and intro text */}
      <header className="mb-4">
        <h1 className="text-2xl font-bold">DarkSwamp MUD</h1>
        {intro && (
          <p className="text-sm text-gray-400 mt-1 whitespace-pre-wrap">{intro}</p>
        )}
      </header>

      {/* Message log that grows upward */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse bg-gray-950 p-4 rounded shadow text-sm font-mono whitespace-pre-wrap">
        <div>
          {log.map((entry, idx) => (
            <div key={idx} className="mb-2">
              <span className="text-gray-400">
                {entry.role === 'user' ? '> ' : '💬 '}
              </span>
              <span>{entry.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Input form pinned to the bottom */}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-2">
        <textarea
          rows={3}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="What do you do?"
          className="w-full bg-gray-800 p-3 rounded text-white border border-gray-700 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full transition-colors"
        >
          Send
        </button>
      </form>
    </main>

  );
}
