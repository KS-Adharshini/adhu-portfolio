import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { sounds } from '../SoundEffects';

// Helper to arrange skills into rows matching layout specifications:
// - 5 skills: 3 in top row, 2 in bottom row
// - 4 skills: 2 in each row
// - 6 skills: 3 in each row
// - For other counts: arrange symmetrically with final row centered
function getSkillRows(skills) {
  if (!skills || skills.length === 0) return [];
  const count = skills.length;
  if (count === 4) {
    return [skills.slice(0, 2), skills.slice(2, 4)];
  }
  if (count === 5) {
    return [skills.slice(0, 3), skills.slice(3, 5)];
  }
  if (count === 6) {
    return [skills.slice(0, 3), skills.slice(3, 6)];
  }
  if (count === 8) {
    return [skills.slice(0, 4), skills.slice(4, 8)];
  }
  if (count <= 3) {
    return [skills];
  }
  const half = Math.ceil(count / 2);
  return [skills.slice(0, half), skills.slice(half)];
}

// Vector icons helper for high-fidelity brand representation
function SkillIcon({ type, color }) {
  switch (type) {
    case 'java':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <path d="M12.5 24.5c4.5 1 9.5 0 12-1-2.5 1.8-8 2.5-12 1z" fill="#5382A1" />
          <path d="M10 27c5.5 1.2 12.5.2 15.5-1.2-3.5 2-11.5 2.8-15.5 1.2z" fill="#ED8B00" />
          <path d="M11 29.5c6 1.2 13.5.2 16.5-1.5-4 2.2-12 3-16.5 1.5z" fill="#5382A1" />
          <path d="M21 17c1.5-1.5 2-3 1-4.5-.8-1.2-2.5-2-4-1 1.2 1 1.5 2.2.8 3.2-1 1.5-3 2.5-4.5 4-2.5 2.5-1 5 1.5 4.5-2.2-.2-3-1.8-1.5-3.2 1.5-1.5 4-2.2 6.7-3z" fill="#ED8B00" />
          <path d="M17 3c2 2.5 1 5-1.5 7.5-1 1-1.5 2-1 3 .5 1 2 1.5 3 2.5 2 2 1 4.5-1 6.5-2 2-4.5 2-6.5.5 2.2 0 3.5-1 4-2.5s-.5-2.5-1.8-3.5c-2-1.5-2.5-3.5-1-5.5 1.5-2 3.5-4 4.8-8z" fill="#5382A1" />
        </svg>
      );
    case 'c':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M28.5 9.2l-11-6.4a3 3 0 0 0-3 0l-11 6.4a3 3 0 0 0-1.5 2.6v12.8a3 3 0 0 0 1.5 2.6l11 6.4a3 3 0 0 0 3 0l11-6.4a3 3 0 0 0 1.5-2.6V11.8a3 3 0 0 0-1.5-2.6z" fill="#00599C" />
          <path d="M16 26.5a10.5 10.5 0 1 1 7.4-17.9l-3.2 3.2A6 6 0 1 0 16 22a5.9 5.9 0 0 0 4.2-1.8l3.2 3.2A10.4 10.4 0 0 1 16 26.5z" fill="#FFFFFF" />
        </svg>
      );
    case 'sql':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <ellipse cx="16" cy="8" rx="11" ry="4.5" fill="#38BDF8" />
          <path d="M5 8v6c0 2.5 5 4.5 11 4.5s11-2 11-4.5V8" stroke="#38BDF8" strokeWidth="2.5" />
          <path d="M5 14v6c0 2.5 5 4.5 11 4.5s11-2 11-4.5v-6" stroke="#38BDF8" strokeWidth="2.5" />
          <path d="M5 20v6c0 2.5 5 4.5 11 4.5s11-2 11-4.5v-6" stroke="#38BDF8" strokeWidth="2.5" />
        </svg>
      );
    case 'python':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M15.9 3c-4.8 0-4.5 2.1-4.5 2.1l.01 4.8h9.2v1.3H6.8S2.3 10.6 2.3 16.2c0 5.5 4 5.2 4 5.2h2.4v-3.3s-.1-4 4-4h9.6s3.9.1 3.9-3.7V7.4S27 3 15.9 3zm-2.7 2.8a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" fill="#387EB8" />
          <path d="M16.1 29c4.8 0 4.5-2.1 4.5-2.1l-.01-4.8H11.4v-1.3h13.8s4.5.6 4.5-5c0-5.5-4-5.2-4-5.2h-2.4v3.3s.1 4-4 4H9.7s-3.9-.1-3.9 3.7v4.9S5 29 16.1 29zm2.7-2.8a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6z" fill="#FFE052" />
        </svg>
      );
    case 'figma':
      return (
        <svg viewBox="0 0 32 32" width="28" height="28">
          <path d="M10.5 4h5.5v6h-5.5a3 3 0 0 1 0-6z" fill="#F24E1E" />
          <path d="M16 4h5.5a3 3 0 1 1 0 6H16V4z" fill="#FF7262" />
          <path d="M10.5 10h5.5v6h-5.5a3 3 0 0 1 0-6z" fill="#A259FF" />
          <path d="M16 10h5.5a3 3 0 1 1 0 6H16v-6z" fill="#1ABCFE" />
          <path d="M10.5 16h5.5v6a3 3 0 1 1-5.5-3 3 3 0 0 1 0-3z" fill="#0ACF83" />
        </svg>
      );
    case 'vscode':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M23.5 3.3l-13.3 10.7-5.3-3.3-2.7 2 3.3 3.3-3.3 3.3 2.7 2 5.3-3.3 13.3 10.7 6-2.7V6l-6-2.7zm0 6v13.4l-8.7-6.7 8.7-6.7z" fill="#007ACC" />
        </svg>
      );
    case 'github':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="#FFFFFF">
          <path d="M16 3C8.8 3 3 8.8 3 16c0 5.7 3.7 10.6 8.9 12.3.7.1.9-.3.9-.6v-2.2c-3.6.8-4.4-1.7-4.4-1.7-.6-1.5-1.4-1.9-1.4-1.9-1.2-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.2 2 3 1.4 3.8 1.1.1-.9.5-1.4.8-1.7-2.9-.3-5.9-1.4-5.9-6.4 0-1.4.5-2.6 1.3-3.5-.1-.3-.6-1.7.1-3.5 0 0 1.1-.4 3.6 1.3a12.5 12.5 0 0 1 6.6 0c2.5-1.7 3.6-1.3 3.6-1.3.7 1.8.2 3.2.1 3.5.9.9 1.3 2.1 1.3 3.5 0 5-3 6.1-5.9 6.4.5.4.9 1.2.9 2.4v3.6c0 .4.2.7.9.6C25.3 26.6 29 21.7 29 16c0-7.2-5.8-13-13-13z" />
        </svg>
      );
    case 'mongodb':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M16 2c-.6 0-7.5 7.3-7.5 15.2 0 5.2 4 8.5 7.5 9.8 3.5-1.3 7.5-4.6 7.5-9.8C23.5 9.3 16.6 2 16 2z" fill="#47A248" />
          <path d="M16 2v25c.3-.1 7.5-4.3 7.5-9.8C23.5 9.3 16.6 2 16 2z" fill="#499D4A" />
          <path d="M16.3 24.2v-11c-.1 0-.4.1-.5.1-1.3 0-2.3-1-2.3-2.3 0-.5.2-.9.4-1.3l.9-1V4.8c-.8.8-1.7 1.8-2 2.6-.4.8-.8 1.7-.8 2.6v17.2c1.4.7 2.8 1.3 4.3 1.6v-4.6z" fill="#E8E8E8" opacity="0.35" />
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <ellipse cx="16" cy="16" rx="5" ry="13" transform="rotate(30 16 16)" stroke="#61DAFB" strokeWidth="1.8" />
          <ellipse cx="16" cy="16" rx="5" ry="13" transform="rotate(90 16 16)" stroke="#61DAFB" strokeWidth="1.8" />
          <ellipse cx="16" cy="16" rx="5" ry="13" transform="rotate(150 16 16)" stroke="#61DAFB" strokeWidth="1.8" />
          <circle cx="16" cy="16" r="2.8" fill="#61DAFB" />
        </svg>
      );
    case 'html':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M4 3l2.2 24.4L16 30l9.8-2.6L28 3H4z" fill="#E34F26" />
          <path d="M16 5.2v22.4l7.8-2.1L25.6 5.2H16z" fill="#EF652A" />
          <path d="M16 11.2H9.2l.3 3.5H16v-3.5zm0 6.8h-3.4l-.2-2.5h-3.5l.5 5.7H16V18zm0 6.8l-4.4-1.2-.3-3.2h-3.5l.5 5.8 7.7 2.1V24.8z" fill="#ECECEC" />
          <path d="M16 11.2h6.8l-.6 6.8H16v3.5h3.6l-.3 3.3-3.3.9v3.6l6.8-1.9 1-11.2h-7.8v-5z" fill="#FFFFFF" />
        </svg>
      );
    case 'bootstrap':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <rect width="28" height="28" x="2" y="2" rx="6" fill="#7952B3" />
          <path d="M11 8h6.2c2.4 0 4.1 1.3 4.1 3.2 0 1.4-.9 2.4-2.2 2.8 1.6.4 2.6 1.6 2.6 3.2 0 2.2-1.8 3.5-4.4 3.5H11V8zm3.3 5h2.6c1 0 1.6-.5 1.6-1.3 0-.8-.6-1.3-1.6-1.3h-2.6v2.6zm0 5h2.9c1.1 0 1.8-.5 1.8-1.5 0-.9-.7-1.5-1.8-1.5h-2.9V18z" fill="#FFFFFF" />
        </svg>
      );
    case 'css':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M4 3l2.2 24.4L16 30l9.8-2.6L28 3H4z" fill="#1572B6" />
          <path d="M16 5.2v22.4l7.8-2.1L25.6 5.2H16z" fill="#33A9DC" />
          <path d="M16 11.2H9.2l.3 3.5H16v-3.5zm0 6.8h-3.4l-.2-2.5h-3.5l.5 5.7H16V18zm0 6.8l-4.4-1.2-.3-3.2h-3.5l.5 5.8 7.7 2.1V24.8z" fill="#ECECEC" />
          <path d="M16 11.2h6.8l-.6 6.8H16v3.5h3.6l-.3 3.3-3.3.9v3.6l6.8-1.9 1-11.2h-7.8v-5z" fill="#FFFFFF" />
        </svg>
      );
    case 'javascript':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <rect width="28" height="28" x="2" y="2" rx="4" fill="#F7DF1E" />
          <path d="M9.5 22.5c.7 1.1 1.7 1.8 3.1 1.8 1.7 0 2.7-.9 2.7-2.8V13.8H12.8v7.6c0 .8-.3 1.2-.9 1.2-.6 0-1-.4-1.3-.9l-1.1.8zm11.7-.3c.6.9 1.4 1.5 2.5 1.5 1.2 0 1.9-.6 1.9-1.4 0-.8-.7-1.2-2-1.7l-.7-.3c-2-.8-3.3-2-3.3-4 0-2 1.6-3.4 3.9-3.4 1.7 0 2.8.6 3.6 2.1l-1.9 1.2c-.4-.7-1-1.1-1.8-1.1-.8 0-1.4.5-1.4 1.1 0 .7.6 1.1 1.8 1.6l.7.3c2.3.9 3.5 2 3.5 4.1 0 2.3-1.8 3.7-4.4 3.7-2.1 0-3.6-.9-4.4-2.6l2-1.1z" fill="#000000" />
        </svg>
      );
    case 'flask':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <path d="M12 4h8M13.5 4v6L6 23.5A3 3 0 0 0 8.6 28h14.8a3 3 0 0 0 2.6-4.5L18.5 10V4" stroke="#C084FC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20h12" stroke="#E879F9" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="23.5" r="1.5" fill="#E879F9" />
          <circle cx="12.5" cy="24" r="1" fill="#E879F9" />
          <circle cx="19.5" cy="24" r="1" fill="#E879F9" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" fill="#339933" />
          <path d="M16 6.8l7.8 4.5v9.4L16 25.2l-7.8-4.5v-9.4L16 6.8z" fill="#026E00" opacity="0.3" />
          <path d="M16 10.5a3.5 3.5 0 0 0-3.5 3.5v4a3.5 3.5 0 0 0 7 0v-4a3.5 3.5 0 0 0-3.5-3.5zm1.5 7.5a1.5 1.5 0 0 1-3 0v-4a1.5 1.5 0 0 1 3 0v4z" fill="#FFFFFF" />
        </svg>
      );
    case 'express':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="14" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="16" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="bold" fontFamily="system-ui, sans-serif" letterSpacing="0.05em">ex</text>
        </svg>
      );
    case 'sklearn':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M4 16A12 12 0 1 1 20 27.2l-3-4.5A7 7 0 1 0 9 16H4z" fill="#3499CD" />
          <path d="M28 16A12 12 0 0 1 12 4.8l3 4.5A7 7 0 0 0 23 16h5z" fill="#F89939" />
          <circle cx="16" cy="16" r="3.5" fill="#FFFFFF" />
        </svg>
      );
    case 'biopython':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <path d="M6 8c5 0 7 8 10 8s5-8 10-8" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
          <path d="M6 24c5 0 7-8 10-8s5 8 10 8" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="9" y1="10" x2="9" y2="22" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.7" />
          <line x1="16" y1="13" x2="16" y2="19" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.7" />
          <line x1="23" y1="10" x2="23" y2="22" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.7" />
        </svg>
      );
    case 'pandas':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <rect x="4" y="13" width="4.5" height="13" rx="1.5" fill="#130754" />
          <rect x="10.5" y="5" width="4.5" height="21" rx="1.5" fill="#FFD43B" />
          <rect x="17" y="10" width="4.5" height="16" rx="1.5" fill="#E70488" />
          <rect x="23.5" y="16" width="4.5" height="10" rx="1.5" fill="#24C1DF" />
        </svg>
      );
    case 'numpy':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M16 2l12 6.8v14.4L16 30 4 23.2V8.8L16 2z" fill="#4DABCF" />
          <path d="M16 2l12 6.8-12 6.8-12-6.8L16 2z" fill="#013243" opacity="0.25" />
          <path d="M16 15.6l12-6.8v14.4l-12-6.8v-.8z" fill="#013243" opacity="0.1" />
          <path d="M10 11.5v9l3 1.8v-7.5l6 7.5h3v-9l-3-1.8v7.5l-6-7.5h-3z" fill="#FFFFFF" />
        </svg>
      );
    case 'seaborn':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <circle cx="16" cy="16" r="14" fill="#1E293B" stroke="#4F46E5" strokeWidth="1.5" />
          <path d="M8 22c2.5 0 3.5-6 5.5-6s3 6 5.5 6 4.5-9 5.5-12" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8 20c2.5 0 3.5-3 5.5-3s3 3 5.5 3 4.5-6 5.5-8" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        </svg>
      );
    case 'mathplot':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <circle cx="16" cy="16" r="14" fill="#11557C" />
          <circle cx="16" cy="16" r="10" fill="#28A745" opacity="0.6" />
          <circle cx="16" cy="16" r="6" fill="#F58220" />
          <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
        </svg>
      );
    case 'opencv':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
          <circle cx="16" cy="9.5" r="5" stroke="#EE2A24" strokeWidth="2.6" />
          <circle cx="10" cy="20.5" r="5" stroke="#009640" strokeWidth="2.6" />
          <circle cx="22" cy="20.5" r="5" stroke="#0066B3" strokeWidth="2.6" />
        </svg>
      );
    case 'tensorflow':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <path d="M16 2.5L5 9v14l11 6.5 11-6.5V9L16 2.5zm0 3.2l7.5 4.3-3.2 1.9-4.3-2.5-4.3 2.5-3.2-1.9L16 5.7zm-1 6.1v12.2l-6-3.6V12l3 1.8 3-1.8v-.2zm2 12.2V11.8l3 1.8 3-1.8v8.6l-6 3.6z" fill="#FF6F00" />
          <path d="M16 2.5l11 6.5-3.5 2.1-7.5-4.3-7.5 4.3-3.5-2.1L16 2.5z" fill="#FFA800" />
        </svg>
      );
    case 'spline':
      return (
        <svg viewBox="0 0 32 32" width="30" height="30">
          <defs>
            <radialGradient id="splineGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#4380FF" />
              <stop offset="50%" stopColor="#FF3BF3" />
              <stop offset="100%" stopColor="#282996" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="13" fill="url(#splineGrad)" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" width="30" height="30" fill={color || '#38BDF8'}>
          <circle cx="16" cy="16" r="12" opacity="0.2" />
          <circle cx="16" cy="16" r="7" />
        </svg>
      );
  }
}

export default function SkillModal({ category, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!category) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container skill-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          aria-label="Close artifacts"
        >
          <X size={20} />
        </button>

        <div className="skill-modal-content">
          {/* Top Title: ARTIFACTS */}
          <div className="artifacts-title-row">
            <h2 className="artifacts-title">ARTIFACTS</h2>
            <span className="artifacts-category-name">{category.title}</span>
          </div>

          <div className="modal-content-grid">
            {/* Left Column: Enchanted Bow with proper horizontal arrow */}
            <div className="modal-artifact-col bow-col">
              <div className="artifact-halo bow-halo" />
              <img
                src="/assets/anim-bow.gif"
                alt="Enchanted Hunter Bow and Arrow"
                className="artifact-img artifact-bow-img"
              />
            </div>

            {/* Right Column: Skill Tiles Grid */}
            <div className="modal-details-col skill-tiles-col">
              <div className={`skill-grid skill-grid-count-${category.skills.length}`}>
                {getSkillRows(category.skills).map((row, rowIdx) => (
                  <div key={rowIdx} className="skill-grid-row">
                    {row.map((skill) => (
                      <div
                        key={skill.name}
                        className={`skill-tile-card skill-${skill.type}`}
                        style={{ backgroundColor: skill.badgeBg || '#092537' }}
                      >
                        <div className={`skill-tile-icon icon-${skill.type}`}>
                          {skill.logo ? (
                            <img
                              src={skill.logo}
                              alt={`${skill.name} logo`}
                              className={`skill-logo-img logo-${skill.type}`}
                              loading="eager"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.parentElement.querySelector('.skill-vector-fallback');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span
                            className="skill-vector-fallback"
                            style={{ display: skill.logo ? 'none' : 'flex' }}
                          >
                            <SkillIcon type={skill.type} color={skill.color} />
                          </span>
                        </div>
                        <span className="skill-tile-name">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
