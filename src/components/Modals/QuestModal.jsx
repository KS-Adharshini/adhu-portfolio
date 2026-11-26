import React, { useEffect } from 'react';
import { X, ExternalLink, Award, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { sounds } from '../SoundEffects';

export default function QuestModal({ quest, onClose }) {
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

  if (!quest) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container quest-modal"
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
          aria-label="Close quest log"
        >
          <X size={20} />
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Artifact Weapon */}
          <div className={`modal-artifact-col ${quest.artifactType === 'axe' ? 'axe-col' : 'sword-col'}`}>
            <div className={`artifact-halo ${quest.artifactType === 'axe' ? 'axe-halo' : 'sword-halo'}`} />
            <img
              src={quest.artifactType === 'axe' ? '/assets/anim-axe.gif' : '/assets/anim-sword.gif'}
              alt={quest.artifactType === 'axe' ? 'Battle Axe of Pyre' : 'Sword of the Victor'}
              className={`artifact-img ${quest.artifactType === 'axe' ? 'artifact-axe-img' : 'artifact-sword-img'}`}
            />
          </div>

          {/* Right Column: Quest Information */}
          <div className="modal-details-col quest-details">
            <div className="quest-header-block">
              <div className="quest-status-badge">
                <CheckCircle2 size={16} className="quest-check-icon" />
                <span>QUEST COMPLETED</span>
              </div>
              <h2 className="quest-title">{quest.title}</h2>
              {quest.subtitle && (
                <div className="quest-rank-badge">{quest.subtitle}</div>
              )}
            </div>

            <div className="quest-stats-list">
              {/* Battlefield */}
              <div className="quest-stat-row">
                <div className="stat-label-group">
                  <MapPin size={14} className="stat-icon" />
                  <span className="stat-label">BATTLEFIELD</span>
                </div>
                <div className="stat-value">{quest.battlefield}</div>
              </div>

              {/* Timeline Mark */}
              {quest.timelineMark && (
                <div className="quest-stat-row">
                  <div className="stat-label-group">
                    <Calendar size={14} className="stat-icon" />
                    <span className="stat-label">TIMELINE MARK</span>
                  </div>
                  <div className="stat-value mono">{quest.timelineMark}</div>
                </div>
              )}

              {/* Score if present */}
              {quest.score && (
                <div className="quest-stat-row">
                  <div className="stat-label-group">
                    <Award size={14} className="stat-icon" />
                    <span className="stat-label">SCORE</span>
                  </div>
                  <div className="stat-value mono">{quest.score}</div>
                </div>
              )}

              {/* Specialization if present */}
              {quest.specialization && (
                <div className="quest-stat-row quest-stat-specialization">
                  <div className="stat-label-group">
                    <Award size={14} className="stat-icon" />
                    <span className="stat-label">SPECIALIZATION</span>
                  </div>
                  <div className="stat-value stat-value-specialization">{quest.specialization}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
