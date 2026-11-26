import React, { useState } from 'react';
import SubNavBar from './SubNavBar';
import { sounds } from './SoundEffects';
import { overviewDeckCards, weaponToSectionMap, sectionOverviewData } from '../data/overviewCards';

export default function SectionOverview({
  sectionId = 'contact',
  title,
  subtitle,
  description,
  bgImage,
  cards = overviewDeckCards,
  selectedCardId: propSelectedCardId,
  onSelectCard,
  onExplore,
  onSelectSection
}) {
  const [internalCardId, setInternalCardId] = useState(() => {
    if (sectionId === 'quests') return 'sword';
    if (sectionId === 'skills') return 'bow';
    if (sectionId === 'contact') return 'axe';
    if (sectionId === 'projects') return 'shield';
    return 'shield';
  });

  const selectedCardId = propSelectedCardId !== undefined ? propSelectedCardId : internalCardId;
  const activeDeckCards = cards && cards.length > 0 ? cards : overviewDeckCards;
  const selectedIndex = activeDeckCards.findIndex((card) => card.id === selectedCardId);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const [pointerStartX, setPointerStartX] = useState(null);

  // Dynamic left offset matching previous layout:
  // For activeIndex === 0: starts near left boundary.
  // For activeIndex > 0: offsets selected card so the previous card is partially hidden/peeking from the left edge.
  const selectedLeftOffset = activeIndex === 0
    ? 'clamp(6px, 0.6vw, 12px)'
    : 'clamp(85px, 6.5vw, 110px)';

  const handleCardClick = (card) => {
    sounds.playClick();
    if (propSelectedCardId === undefined) {
      setInternalCardId(card.id);
    }
    if (onSelectCard) {
      onSelectCard(card);
    } else if (onSelectSection) {
      const target = weaponToSectionMap[card.id] || card.sectionId;
      if (target) onSelectSection(target, card.id);
    }
  };

  const handlePointerDown = (e) => {
    setPointerStartX(e.clientX);
  };

  const handlePointerUp = (e) => {
    if (pointerStartX !== null) {
      const deltaX = e.clientX - pointerStartX;
      if (deltaX > 45 && activeIndex > 0) {
        // Swiped right: navigate to previous card
        handleCardClick(activeDeckCards[activeIndex - 1]);
      } else if (deltaX < -45 && activeIndex < activeDeckCards.length - 1) {
        // Swiped left: navigate to next card
        handleCardClick(activeDeckCards[activeIndex + 1]);
      }
      setPointerStartX(null);
    }
  };

  const handleContainerClick = (e) => {
    if (e.target === e.currentTarget && activeIndex > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < 150) {
        handleCardClick(activeDeckCards[activeIndex - 1]);
      }
    }
  };

  const handleExplore = () => {
    sounds.playUnlock();
    if (onExplore) onExplore();
  };

  const data = sectionOverviewData[sectionId] || sectionOverviewData.projects;
  const currentTitle = title !== undefined && title !== null ? title : data.title;
  const currentSubtitle = subtitle !== undefined && subtitle !== null ? subtitle : data.subtitle;
  const currentDesc = description !== undefined && description !== null ? description : data.description;
  const currentBg = bgImage !== undefined && bgImage !== null ? bgImage : data.bgImage;

  return (
    <section className={`view-stage section-overview overview-${sectionId}`} aria-label={`${currentTitle} Overview`}>
      {/* Seamless crossfading background layers with 1200ms cubic-bezier transitions */}
      <div className="overview-bg-layers" aria-hidden="true">
        {Object.entries(sectionOverviewData).map(([secKey, secData]) => (
          <div
            key={secKey}
            className={`overview-bg-layer ${secKey === sectionId ? 'active' : ''}`}
            style={{ backgroundImage: `url('${secData.bgImage}')` }}
          />
        ))}
      </div>
      <div className="overview-ambient-overlay" />

      {/* Top Left Sub-Navigation Bar */}
      <SubNavBar activeSection={sectionId} onSelectSection={onSelectSection} />

      <div className="overview-content-container">
        {/* Left Column: Headings, Subtitle, Description & Explore CTA with 1200ms cubic-bezier transition */}
        <div className="overview-left-col">
          <div className="overview-text-animated" key={sectionId}>
            <div className="overview-header-group">
              <h1 className="overview-title">{currentTitle}</h1>
              <h2 className="overview-subtitle">{currentSubtitle}</h2>
            </div>

            <p className="overview-description">{currentDesc}</p>

            <div className="overview-action-wrap">
              <button
                className="overview-explore-btn"
                onClick={handleExplore}
                id={`explore-btn-${sectionId}`}
                aria-label={`Explore ${currentTitle}`}
              >
                <span className="explore-btn-text">EXPLORE</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Weapon Gallery with partially hidden previous card and smooth click transitions */}
        <div className="overview-right-col">
          <div
            className="overview-gallery-container"
            onClick={handleContainerClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <div
              className="overview-cards-deck"
              style={{
                '--active-index': activeIndex,
                '--selected-left-offset': selectedLeftOffset
              }}
            >
              {activeDeckCards.map((card, idx) => {
                const isSelected = card.id === selectedCardId;

                return (
                  <div
                    key={card.id || idx}
                    className={`overview-preview-card ${isSelected ? 'card-selected card-primary' : 'card-unselected'}`}
                    onClick={() => handleCardClick(card)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(card);
                      }
                    }}
                    title={card.title}
                    role="button"
                    tabIndex={0}
                    id={`preview-card-${card.id}`}
                    aria-pressed={isSelected}
                  >
                    <img
                      src={card.image}
                      alt={card.title || 'Weapon Relic'}
                      className={`preview-card-img preview-card-img-${card.id}`}
                    />
                    <div className="preview-card-border" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

