import React, { useState, useEffect, useRef } from 'react';
import { sounds } from './SoundEffects';

export default function CurvedCarousel({
  items,
  onUnlock,
  type = 'projects' // 'projects' | 'achievements' | 'skills'
}) {
  // Default to middle card (e.g. Frontend Languages for skills at index 2)
  const defaultIndex = Math.min(2, Math.floor(items.length / 2));
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1600
  );
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const total = items.length;

  // Window resize listener for responsive card layout
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    sounds.playClick();
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    sounds.playClick();
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Touch and pointer drag gestures to swipe through cards
  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    isDragging.current = false;
  };

  const handlePointerMove = (e) => {
    if (dragStartX.current === 0) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      isDragging.current = true;
    }
  };

  const handlePointerUp = (e) => {
    if (dragStartX.current !== 0 && isDragging.current) {
      const dx = e.clientX - dragStartX.current;
      if (dx > 40) {
        handlePrev();
      } else if (dx < -40) {
        handleNext();
      }
    }
    dragStartX.current = 0;
    dragStartY.current = 0;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  // Responsive dimensions calculation ensuring zero overlap
  let cardWidthActive = 250;
  let cardHeightActive = 450;
  let cardWidthInactive = 205;
  let cardHeightInactive = 405;
  let gap = 24;
  let maxVisibleDiff = 2; // Default 5 cards visible on desktop

  // Handle constrained viewport heights (laptop screens, smaller browser windows)
  if (typeof window !== 'undefined' && window.innerHeight < 780) {
    cardHeightActive = 420;
    cardHeightInactive = 380;
  }

  if (viewportWidth < 768) {
    // Mobile: Show centered active card only
    cardWidthActive = Math.min(270, viewportWidth - 70);
    cardHeightActive = 410;
    cardWidthInactive = 0;
    cardHeightInactive = 360;
    gap = 0;
    maxVisibleDiff = 0;
  } else if (viewportWidth < 1100) {
    // Tablet: Show 3 cards (-1, 0, +1)
    cardWidthActive = 225;
    cardHeightActive = 430;
    cardWidthInactive = 175;
    cardHeightInactive = 385;
    gap = 18;
    maxVisibleDiff = 1;
  } else if (viewportWidth >= 1440 && total > 5) {
    // Large desktop: Show up to 7 cards so users can see & directly click almost every card
    cardWidthActive = 240;
    cardHeightActive = 450;
    cardWidthInactive = 180;
    cardHeightInactive = 395;
    gap = 18;
    maxVisibleDiff = 3;
  }

  // Exact horizontal slot translation formula with guaranteed non-overlapping gap
  const getTranslateX = (diff) => {
    if (diff === 0) return 0;
    const sign = Math.sign(diff);
    const absDiff = Math.abs(diff);
    const firstOffset = (cardWidthActive / 2) + gap + (cardWidthInactive / 2);
    const extraOffset = (absDiff - 1) * (cardWidthInactive + gap);
    return sign * (firstOffset + extraOffset);
  };

  return (
    <div
      className="carousel-stage-container"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Controlled Horizontal Slotted Viewport */}
      <div className="carousel-viewport">
        <div className="carousel-slotted-ring">
          {items.map((item, index) => {
            // Symmetrical circular relative offset from activeIndex
            let diff = index - activeIndex;
            while (diff > total / 2) diff -= total;
            while (diff <= -total / 2) diff += total;

            const isCenter = diff === 0;
            const isVisible = Math.abs(diff) <= maxVisibleDiff;

            const translateX = getTranslateX(diff);
            const rotateY = diff * 3.5; // Subtle natural curve
            const scale = isCenter ? 1 : Math.abs(diff) === 1 ? 0.94 : Math.abs(diff) === 2 ? 0.88 : 0.82;

            const currentWidth = isCenter ? cardWidthActive : cardWidthInactive;
            const currentHeight = isCenter ? cardHeightActive : cardHeightInactive;

            let opacity = 0;
            if (isVisible) {
              if (isCenter) opacity = 1;
              else if (Math.abs(diff) === 1) opacity = 0.84;
              else if (Math.abs(diff) === 2) opacity = 0.65;
              else opacity = 0.45;
            }

            // Center card has highest priority, immediate flanks next, etc.
            const zIndex = isCenter ? 30 : Math.max(1, 20 - Math.abs(diff) * 3);

            return (
              <div
                key={item.id}
                className={`carousel-card ${isCenter ? 'card-center' : ''} ${
                  Math.abs(diff) === 1 ? 'card-flank' : ''
                }`}
                style={{
                  width: `${currentWidth}px`,
                  height: `${currentHeight}px`,
                  transform: `translate(-50%, -50%) translateX(${translateX}px) perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  if (isDragging.current) return;
                  sounds.playClick();
                  if (!isCenter) {
                    setActiveIndex(index);
                  } else {
                    sounds.playUnlock();
                    onUnlock(item);
                  }
                }}
                title={isCenter ? `Unlock ${item.title}` : `Bring ${item.title} to center`}
                role="button"
                tabIndex={isVisible ? 0 : -1}
                id={`carousel-card-${item.id}`}
              >
                {/* Ambient Center Glow */}
                <div className="card-aura-glow" />

                {/* Card Body */}
                <div className="card-inner">
                  {/* Main Title at top */}
                  <div className="card-title-box">
                    <h3 className="card-title">
                      {item.displayTitle || item.title}
                    </h3>
                  </div>

                  {/* Single Description Text (No duplicate in center) */}
                  {(item.subtitle || item.category || (item.skills ? `${item.skills.length} RUNES` : null)) && (
                    <div className="card-sub-info">
                      {item.subtitle || item.category || `${item.skills.length} RUNES`}
                    </div>
                  )}

                  {/* Action Button positioned below description at top of card */}
                  <div className="card-action-wrap">
                    <button
                      className={`unlock-btn ${isCenter ? 'unlock-btn-active' : 'unlock-btn-locked'}`}
                      disabled={!isCenter}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isDragging.current) return;
                        if (isCenter) {
                          sounds.playUnlock();
                          onUnlock(item);
                        }
                      }}
                      id={`unlock-${item.id}`}
                      aria-label={isCenter ? `Unlock ${item.title}` : `Locked: ${item.title}`}
                      tabIndex={isCenter ? 0 : -1}
                    >
                      <span className="unlock-text">UNLOCK</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom pagination indicators */}
      <div className="carousel-indicators">
        {items.map((item, idx) => (
          <button
            key={item.id}
            className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              setActiveIndex(idx);
            }}
            aria-label={`Go to card ${idx + 1}: ${item.title}`}
            title={`Card ${idx + 1}: ${item.title}`}
          />
        ))}
      </div>
    </div>
  );
}
