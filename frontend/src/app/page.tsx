'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [intro, setIntro] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [reply, setReply] = useState('');

  useEffect(() => {
    const fetchIntro = async () => {
      const res = await fetch('/mudData/darkswamp/intro.md');
      const text = await res.text();
      setIntro(text);
    };

    fetchIntro();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
      });

      const data = await response.json();
      setReply(data.reply || '');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ margin: '2rem auto', maxWidth: '600px' }}>
      <h1>DarkSwamp MUD</h1>

      {intro && (
        <div style={{ background: '#222', color: '#eee', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
          <h2>Intro</h2>
          <p>{intro}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          cols={50}
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="What do you do?"
        />
        <div>
          <button type="submit">Send</button>
        </div>
      </form>

      {reply && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#111', color: '#eee' }}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <h2>AI's Reply:</h2>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}
