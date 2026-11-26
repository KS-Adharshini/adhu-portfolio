import React, { useState } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import HUDHeader from './components/HUDHeader';
import NavigationDock from './components/NavigationDock';
import HeroView from './views/HeroView';
import AboutView from './views/AboutView';
import ProjectsView from './views/ProjectsView';
import QuestsView from './views/QuestsView';
import SkillsView from './views/SkillsView';
import ContactView from './views/ContactView';
import SectionOverview from './components/SectionOverview';
import ArchitectModal from './components/Modals/ArchitectModal';
import { sounds } from './components/SoundEffects';
import { overviewDeckCards, weaponToSectionMap, sectionOverviewData } from './data/overviewCards';

export default function App() {
  const getInitialSection = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const valid = ['hero', 'about', 'projects', 'quests', 'skills', 'contact'];
    return valid.includes(hash) ? hash : 'hero';
  };

  const getInitialExploring = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('explore') === 'true' ||
             Boolean(params.get('project')) ||
             Boolean(params.get('quest')) ||
             Boolean(params.get('skill')) ||
             Boolean(params.get('channel'));
    } catch {
      return false;
    }
  };

  const [currentSection, setCurrentSection] = useState(getInitialSection);
  const [isExploring, setIsExploring] = useState(getInitialExploring);
  const [isMuted, setIsMuted] = useState(false);
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);
  const [selectedWeaponId, setSelectedWeaponId] = useState(() => {
    const initial = getInitialSection();
    if (initial === 'quests') return 'sword';
    if (initial === 'skills') return 'bow';
    if (initial === 'contact') return 'axe';
    if (initial === 'projects') return 'shield';
    return 'shield';
  });

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const valid = ['hero', 'about', 'projects', 'quests', 'skills', 'contact'];
      if (valid.includes(hash)) {
        setCurrentSection(hash);
        setIsExploring(false);
        if (hash === 'projects') setSelectedWeaponId('shield');
        else if (hash === 'quests') setSelectedWeaponId('sword');
        else if (hash === 'skills') setSelectedWeaponId('bow');
        else if (hash === 'contact') setSelectedWeaponId('axe');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectWeaponCard = (card) => {
    setSelectedWeaponId(card.id);
    const targetSection = weaponToSectionMap[card.id] || card.sectionId;
    if (targetSection) {
      setCurrentSection(targetSection);
      setIsExploring(false);
      window.location.hash = targetSection;
    }
  };

  // Keyboard navigation for cycling weapon cards in overview mode
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExploring || isArchitectOpen || ['hero', 'about'].includes(currentSection)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const weaponKeys = ['shield', 'sword', 'bow', 'axe'];
        const currentIdx = weaponKeys.indexOf(selectedWeaponId);
        if (currentIdx === -1) return;
        const nextIdx = e.key === 'ArrowRight'
          ? (currentIdx + 1) % weaponKeys.length
          : (currentIdx - 1 + weaponKeys.length) % weaponKeys.length;
        const nextCard = overviewDeckCards.find((c) => c.id === weaponKeys[nextIdx]);
        if (nextCard) {
          sounds.playClick();
          handleSelectWeaponCard(nextCard);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isExploring, isArchitectOpen, selectedWeaponId]);

  // Section order for linear back/forward
  const sectionOrder = ['hero', 'about', 'projects', 'quests', 'skills', 'contact'];

  const handleStartJourney = () => {
    sounds.playUnlock();
    setCurrentSection('about');
    setIsExploring(false);
    window.location.hash = 'about';
  };

  const handleBack = () => {
    sounds.playClick();
    if (isExploring) {
      setIsExploring(false);
      return;
    }
    const currentIndex = sectionOrder.indexOf(currentSection);
    const nextSection = currentIndex > 0 ? sectionOrder[currentIndex - 1] : 'hero';
    setCurrentSection(nextSection);
    setIsExploring(false);
    window.location.hash = nextSection;
  };

  const handleSelectSection = (sectionId) => {
    sounds.playClick();
    setCurrentSection(sectionId);
    setIsExploring(false);
    window.location.hash = sectionId;
    if (sectionId === 'projects') {
      setSelectedWeaponId('shield');
    } else if (sectionId === 'quests') {
      setSelectedWeaponId('sword');
    } else if (sectionId === 'skills') {
      setSelectedWeaponId('bow');
    } else if (sectionId === 'contact') {
      setSelectedWeaponId('axe');
    }
  };

  const handleToggleMute = () => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sounds.playClick();
    }
  };

  const handleOpenArchitect = () => {
    sounds.playUnlock();
    setIsArchitectOpen(true);
  };

  const isOverviewSection = ['projects', 'quests', 'skills', 'contact'].includes(currentSection);
  const overviewData = sectionOverviewData[currentSection] || sectionOverviewData.contact;

  return (
    <div className={`app-container section-${currentSection}`}>
      {/* Floating Magma Embers Canvas */}
      <ParticleCanvas />

      {/* Persistent Futuristic / Fantasy HUD Header */}
      <HUDHeader
        currentSection={currentSection}
        isExploring={isExploring}
        onBack={handleBack}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenArchitect={handleOpenArchitect}
      />

      {/* Main View Area */}
      <main className="app-main-viewport">
        {currentSection === 'hero' && (
          <HeroView onStartJourney={handleStartJourney} />
        )}
        {currentSection === 'about' && (
          <AboutView onSelectSection={handleSelectSection} />
        )}

        {/* Persistent SectionOverview across overview sections */}
        {!isExploring && isOverviewSection && (
          <SectionOverview
            sectionId={currentSection}
            title={overviewData.title}
            subtitle={overviewData.subtitle}
            description={overviewData.description}
            bgImage={overviewData.bgImage}
            cards={overviewDeckCards}
            selectedCardId={selectedWeaponId}
            onSelectCard={handleSelectWeaponCard}
            onExplore={() => setIsExploring(true)}
            onSelectSection={handleSelectSection}
          />
        )}

        {/* Section Exploration Views */}
        {isExploring && currentSection === 'projects' && (
          <ProjectsView
            onSelectSection={handleSelectSection}
            isExploring={isExploring}
            setIsExploring={setIsExploring}
          />
        )}
        {isExploring && currentSection === 'quests' && (
          <QuestsView
            onSelectSection={handleSelectSection}
            isExploring={isExploring}
            setIsExploring={setIsExploring}
          />
        )}
        {isExploring && currentSection === 'skills' && (
          <SkillsView
            onSelectSection={handleSelectSection}
            isExploring={isExploring}
            setIsExploring={setIsExploring}
          />
        )}
        {isExploring && currentSection === 'contact' && (
          <ContactView
            onSelectSection={handleSelectSection}
            isExploring={isExploring}
            setIsExploring={setIsExploring}
          />
        )}
      </main>

      {/* Architect Dossier Modal */}
      {isArchitectOpen && (
        <ArchitectModal onClose={() => setIsArchitectOpen(false)} />
      )}
    </div>
  );
}
