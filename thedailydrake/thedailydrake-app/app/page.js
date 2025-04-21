'use client';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setQuote('');
    try {
      const res = await fetch('/api/quote');
      const data = await res.json();
      setQuote(data.lyric);
    } catch (err) {
      setQuote("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title-text">The Daily Drake</h1>
      <h2 className="title-subtext">Get Motivated By Drake Daily</h2>

      {loading && <div className="spinner" />}

      {quote && (
        <div className="quote-popup">
          “{quote}”
        </div>
      )}

      <div className="button-container">
        <button className="button" onClick={handleClick}>
          Get Drizzy
        </button>
      </div>
    </div>
  );
}
