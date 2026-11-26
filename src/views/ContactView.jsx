import React, { useState } from 'react';
import CurvedCarousel from '../components/CurvedCarousel';
import QuestModal from '../components/Modals/QuestModal';
import SectionOverview from '../components/SectionOverview';
import { leadershipCards } from '../data/leadership';
import { overviewDeckCards } from '../data/overviewCards';

export default function ContactView({
  onSelectSection,
  isExploring,
  setIsExploring
}) {
  const [selectedLeadership, setSelectedLeadership] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const openId = params.get('leader') || params.get('leadership');
      return openId ? leadershipCards.find(l => l.id === openId) || null : null;
    } catch {
      return null;
    }
  });

  const cards = overviewDeckCards.map(c => ({
    ...c,
    isCenter: c.sectionId === 'contact'
  }));

  if (!isExploring) {
    return (
      <SectionOverview
        sectionId="contact"
        title="LEADERSHIP"
        subtitle="COMMANDS EARNED"
        description="Leadership is taking responsibility, guiding others, inspiring people, and creating a positive impact."
        bgImage="/assets/bg-mount-pyre.jpg?v=7"
        cards={cards}
        onExplore={() => setIsExploring(true)}
        onSelectSection={onSelectSection}
      />
    );
  }

  return (
    <section className="view-stage leadership-view contact-view" aria-label="Leadership Section">
      <div className="temple-bg-layer contact-bg" />

      <div className="view-content-wrap">
        <CurvedCarousel
          items={leadershipCards}
          onUnlock={(item) => setSelectedLeadership(item)}
          type="leadership"
        />
      </div>

      {selectedLeadership && (
        <QuestModal
          quest={selectedLeadership}
          onClose={() => setSelectedLeadership(null)}
        />
      )}
    </section>
  );
}
