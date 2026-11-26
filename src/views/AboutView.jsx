import React, { useState } from 'react';
import SubNavBar from '../components/SubNavBar';
import { sounds } from '../components/SoundEffects';
import ResumeModal from '../components/Modals/ResumeModal';

export default function AboutView({ onSelectSection }) {
    const [selectedId, setSelectedId] = useState('btech');
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const educationMilestones = [
      {
        id: 'btech',
        title: 'B.Tech',
        field: 'Artificial Intelligence and Machine Learning',
        institution: 'Kongu Engineering College',
        score: 'GPA: 8.2',
        side: 'left'
      },
      {
        id: 'higher-secondary',
        title: 'Higher Secondary',
        field: null,
        institution: 'Vignesh International School (CBSE)',
        score: 'Percentage: 78%',
        side: 'right'
      },
      {
        id: 'senior-secondary',
        title: 'Senior Secondary',
        field: null,
        institution: 'The Path Global Public School (CBSE)',
        score: 'Percentage: 82%',
        side: 'left'
      }
    ];

    const handleSelectMilestone = (id) => {
      sounds.playClick();
      setSelectedId(id);
    };

    const handleResumeClick = () => {
      sounds.playUnlock();
      setIsResumeOpen(true);
    };

    return (
      <section className="view-stage about-view" aria-label="About & Education">
        {/* Brimstone Basin Background Layer */}
        <div className="brimstone-bg-layer" />

        {/* Top Left Sub-Navigation Bar matching reference */}
        <SubNavBar activeSection="about" onSelectSection={onSelectSection} />

        <div className="about-stage-container">
          {/* Left Side: Interactive Vertical Timeline */}
          <div className="about-left-section">
            <div className="edu-vertical-timeline" role="region" aria-label="Interactive Education Timeline">
              {/* Central Spine Line */}
              <div className="timeline-spine-track" aria-hidden="true" />

              {educationMilestones.map((item) => {
                const isSelected = selectedId === item.id;
                const isLeft = item.side === 'left';

                return (
                  <div
                    key={item.id}
                    className={`timeline-row ${isLeft ? 'row-left' : 'row-right'} ${isSelected ? 'row-selected' : ''}`}
                  >
                    {/* Left Slot */}
                    <div className="timeline-side-col col-left">
                      {isLeft && (
                        <div
                          className={`timeline-entry-card ${isSelected ? 'card-active' : ''}`}
                          onClick={() => handleSelectMilestone(item.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectMilestone(item.id);
                            }
                          }}
                          aria-expanded={isSelected}
                          aria-label={`${item.title} education milestone`}
                        >
                          <div className="entry-card-header">
                            <span className="entry-title">{item.title}</span>
                            <span className={`entry-status-pill ${isSelected ? 'pill-active' : ''}`}>
                              {isSelected ? 'ACTIVE' : 'VIEW'}
                            </span>
                          </div>

                          <div className={`entry-collapsed-preview ${isSelected ? 'hidden' : ''}`}>
                            <p className="entry-preview-inst">{item.institution}</p>
                            <span className="entry-click-hint">Click to expand</span>
                          </div>

                          <div className={`entry-expanded-details ${isSelected ? 'details-open' : ''}`}>
                            {item.field && (
                              <p className="entry-field-name">{item.field}</p>
                            )}
                            <p className="entry-institution-name">{item.institution}</p>
                            <div className="entry-score-wrap">
                              <span className="entry-score-badge">{item.score}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Central Spine Marker & Connecting Arm */}
                    <div className="timeline-center-col">
                      <div
                        className={`timeline-circular-marker ${isSelected ? 'marker-active' : ''}`}
                        onClick={() => handleSelectMilestone(item.id)}
                        role="button"
                        tabIndex={0}
                        title={`${item.title} - Click to expand`}
                        aria-label={`Select ${item.title}`}
                      >
                        <div className="marker-inner-dot" />
                      </div>
                      <div
                        className={`timeline-connector-arm ${isLeft ? 'arm-left' : 'arm-right'} ${isSelected ? 'arm-active' : ''}`}
                      />
                    </div>

                    {/* Right Slot */}
                    <div className="timeline-side-col col-right">
                      {!isLeft && (
                        <div
                          className={`timeline-entry-card ${isSelected ? 'card-active' : ''}`}
                          onClick={() => handleSelectMilestone(item.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectMilestone(item.id);
                            }
                          }}
                          aria-expanded={isSelected}
                          aria-label={`${item.title} education milestone`}
                        >
                          <div className="entry-card-header">
                            <span className="entry-title">{item.title}</span>
                            <span className={`entry-status-pill ${isSelected ? 'pill-active' : ''}`}>
                              {isSelected ? 'ACTIVE' : 'VIEW'}
                            </span>
                          </div>

                          <div className={`entry-collapsed-preview ${isSelected ? 'hidden' : ''}`}>
                            <p className="entry-preview-inst">{item.institution}</p>
                            <span className="entry-click-hint">Click to expand</span>
                          </div>

                          <div className={`entry-expanded-details ${isSelected ? 'details-open' : ''}`}>
                            {item.field && (
                              <p className="entry-field-name">{item.field}</p>
                            )}
                            <p className="entry-institution-name">{item.institution}</p>
                            <div className="entry-score-wrap">
                              <span className="entry-score-badge">{item.score}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Fiery Solar Ring, The Architect Portrait & View Resume */}
          <div className="about-right-section">
            {/* Glowing Fiery Ring */}
            <div className="fiery-solar-ring" />

            {/* Character Portrait cutout */}
            <div className="architect-portrait-frame">
              <img
                src="/assets/architect-portrait.png"
                alt="Adharshini KS - The Architect"
                className="architect-hero-img"
                onError={(e) => {
                  if (!e.currentTarget.dataset.retried) {
                    e.currentTarget.dataset.retried = 'true';
                    e.currentTarget.src = '/assets/architect-portrait.png?t=' + Date.now();
                  }
                }}
              />
            </div>

            {/* Character Info Overlay */}
            <div className="architect-hero-tag">
              <span className="architect-role-sup">THE ARCHITECT</span>
              <h2 className="architect-hero-name">ADHARSHINI KS</h2>
              <span className="architect-hero-role">STUDENT | AI & ML</span>
            </div>

            {/* VIEW RESUME CTA */}
            <div className="resume-cta-container">
              <button
                className="view-resume-action-btn"
                onClick={handleResumeClick}
                id="view-resume-btn"
                aria-label="View Resume"
              >
                <span className="resume-action-sup">VIEW</span>
                <span className="resume-action-text">RESUME</span>
              </button>
            </div>
          </div>
        </div>

        {/* Adharshini CV Modal */}
        {isResumeOpen && (
          <ResumeModal onClose={() => setIsResumeOpen(false)} />
        )}
      </section>
    );
  }
