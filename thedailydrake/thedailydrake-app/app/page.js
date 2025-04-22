"use client";
import { useState } from "react";
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

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState("");

  const shareUrl = "http://localhost:3000/"; // Replace with your actual site URL
  const titleToShare = `Got my daily drake "${quote}"`;

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
      <h1 className="title-text">The Daily Drake</h1>
      <h2 className="title-subtext">Get Motivated By Drake Daily</h2>

      {loading && <div className="spinner" />}

      {quote && (
        <>
          <div className="quote-popup">“{quote}”</div>

          {/* Share Buttons */}
          <div className="share-button-container">
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

            {/* iMessage via SMS protocol */}
            {/* <a
              href={`sms:&body=${encodeURIComponent(titleToShare)}`}
              style={{ marginLeft: "8px" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/icons/imessage.png"
                alt="iMessage"
                width={40}
                style={{ borderRadius: "50%" }}
              />
            </a> */}
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
