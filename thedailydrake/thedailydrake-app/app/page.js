"use client";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Image from "next/image";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");
  const [showIntro, setShowIntro] = useState(false);

  const shareUrl = "https://thedailydrake.vercel.app/"; // Replace with your actual site URL
  const titleToShare = `Got my daily drake "${quote}"`;

  useEffect(() => {
    setShowIntro(true);
  }, []);

  const handleClick = async () => {
    setLoading(true);
    setQuote("");
    try {
      const res = await fetch("/api/quote");
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
      {showIntro && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Welcome to The Daily Drake</h2>
            <p>
              <p>
                This site uses AI to generate Drake-inspired captions from real
                lyrics. Whether you are looking for motivation, bars, or a
                perfect IG caption, we got you.
              </p>
            </p>
            <button onClick={() => setShowIntro(false)}>Let&apos;s Go!</button>
          </div>
        </div>
      )}
      <h1 className="title-text">The Daily Drake</h1>
      <h2 className="title-subtext">Drake lyrics made for your next caption</h2>

      {loading && <div className="spinner" />}

      {quote && (
        <>
          <div className="quote-popup">“{quote}”</div>

          {/* Share Buttons */}
          <div className="share-button-container">
            {/* iMessage Button */}
            <a
              href={`sms:&body=${encodeURIComponent(quote)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "8px" }}
            >
              <Image
                src="/icons/icons8-imessage.svg"
                alt="iMessage"
                width={45}
                height={45}
                style={{ borderRadius: "50%" }}
              />
            </a>
            <FacebookShareButton url={shareUrl} quote={titleToShare}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>

            <TwitterShareButton url={shareUrl} title={titleToShare}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>

            <WhatsappShareButton url={shareUrl} title={titleToShare}>
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <EmailShareButton subject="Drake Quote" body={titleToShare}>
              <EmailIcon size={40} round />
            </EmailShareButton>
          </div>
        </>
      )}

      <div className="button-container">
        <button className="button" onClick={handleClick}>
          Get Drizzy
        </button>
      </div>
    </div>
  );
}
