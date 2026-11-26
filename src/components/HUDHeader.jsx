import React from 'react';
import { Volume2, VolumeX, User, ArrowLeft } from 'lucide-react';

export default function HUDHeader({
  currentSection,
  isExploring,
  onBack,
  isMuted,
  onToggleMute,
  onOpenArchitect
}) {
  const isHero = currentSection === 'hero';

  const getLocationName = () => {
    if (currentSection === 'about') return 'The Obsidian Scar';
    if (isExploring) return 'The Obsidian Scar';
    if (currentSection === 'projects') return 'The Cinder-Vail Peaks';
    if (currentSection === 'quests') return 'The Wrathful Caldera';
    if (currentSection === 'skills') return 'The Infernal Threshold';
    if (currentSection === 'contact') return 'Mount Pyre’s Reach';
    return 'The Obsidian Scar';
  };

  return (
    <header className="hud-header">
      <div className="hud-left">
        {isExploring && (
          <button
            className="hud-back-btn"
            onClick={onBack}
            aria-label="Back to overview"
            title="Back to Overview (Esc)"
          >
            <div className="hud-bracket">[</div>
            <ArrowLeft size={16} className="hud-back-icon" />
            <span className="hud-back-label">BACK</span>
            <div className="hud-bracket">]</div>
          </button>
        )}
        {!isHero && !isExploring && (
          <div className="hud-location">
            <span className="location-label">LOCATION</span>
            <span className="location-sep">|</span>
            <span className="location-name">
              {getLocationName()}
            </span>
          </div>
        )}
      </div>

      <div className="hud-right">
        {/* Sound toggle button */}
        <button
          className={`hud-sound-btn ${isMuted ? 'muted' : 'active'}`}
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* Architect Forge Badge */}
        <div
          className="architect-badge"
          onClick={onOpenArchitect}
          title="Architect: Adharshini KS (Click to inspect)"
        >
          <div className="architect-info">
            <span className="architect-title">ARCHITECT</span>
            <span className="architect-contact">CONTACT</span>
          </div>
          <div className="architect-avatar-ring">
            <img
              src="/assets/warrior-avatar.png?v=sun"
              alt="Architect Profile"
              className="architect-avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
