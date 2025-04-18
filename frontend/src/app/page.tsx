'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [userMessage, setUserMessage] = useState('');
  const [log, setLog] = useState<{ role: 'user' | 'ai' | 'intro'; message: string }[]>([]);


  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/intro?mud=darkswamp`);
        const text = await res.text();
        setLog([{ role: 'intro', message: text }]);
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
      </header>

      {/* Message log that grows upward */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse bg-black text-green-400 p-4 font-mono tracking-wide text-sm whitespace-pre-wrap border border-green-700">
        <div>
          {log.map((entry, idx) => (
            <div key={idx} className="mb-1">
              <span className="tracking-wider text-green-600">
                {entry.role === 'user' ? '> ' : ''}
              </span>
              <span className="tracking-wider text-green-300">{entry.message}</span>
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
          placeholder="Type your command..."
          className="tracking-wider w-full bg-black border border-green-700 text-green-300 p-2 font-mono focus:outline-none focus:ring focus:border-lime-400"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();  // stops newline
              handleSubmit(e);     // submits the form
            }
          }}
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
