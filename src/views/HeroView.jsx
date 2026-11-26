import React from 'react';
import { Play } from 'lucide-react';
import { sounds } from '../components/SoundEffects';

export default function HeroView({ onStartJourney }) {
  const handleClickPlay = () => {
    sounds.playEnterRealm();
    onStartJourney();
  };

  return (
    <section className="hero-view" aria-label="Portfolio Start Portal">
      {/* Background cinematic looping video with poster fallback */}
      <video
        className="hero-video-bg"
        src="/assets/hero-anim.mp4?v=3"
        poster="/assets/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Solid black overlay layer with 60% opacity (zero blur, original sharpness preserved) */}
      <div className="hero-dark-blur-layer" />
      <div className="hero-ambient-vignette" />

      <div className="hero-content">
        {/* Epic Serif Main Title */}
        <div className="hero-title-box">
          <h1 className="hero-title">PORTFOLIO</h1>
        </div>

        {/* Cinematic Play / Initiate Button */}
        <div className="hero-play-wrap">
          <button
            className="hero-play-btn"
            onClick={handleClickPlay}
            aria-label="Begin Journey"
            title="Begin the Journey of Discovery"
            id="hero-play-btn"
          >
            <div className="play-triangle-shape">
              <svg viewBox="0 0 100 100" className="play-svg">
                <defs>
                  <linearGradient id="playGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8db4d0" />
                    <stop offset="50%" stopColor="#486e8a" />
                    <stop offset="100%" stopColor="#253e52" />
                  </linearGradient>
                </defs>
                <path
                  d="M 28 34 C 28 20 38 15 49 22 L 78 41 C 88 47 88 53 78 59 L 49 78 C 38 85 28 80 28 66 Z"
                  fill="url(#playGrad)"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Atmospheric Bottom Subtitle */}
        <div className="hero-footer-lore">
          <p className="lore-line-1">FORGE THE PATH TO WHERE DISCOVERY BEGINS</p>
          <p className="lore-line-2">BEGIN THE JOURNEY OF DISCOVERY</p>
        </div>
      </div>
    </section>
  );
}
