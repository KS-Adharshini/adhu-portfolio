import React from 'react';
import { User, Image as ImageIcon, Trophy, GraduationCap, Users } from 'lucide-react';
import { sounds } from './SoundEffects';

const navItems = [
  { id: 'about', label: 'USER', icon: User, title: 'Architect / About' },
  { id: 'projects', label: 'PROJECTS', icon: ImageIcon, title: 'Projects' },
  { id: 'quests', label: 'VICTORIES', icon: Trophy, title: 'Quests & Victories' },
  { id: 'skills', label: 'SKILLS', icon: GraduationCap, title: 'Skills & Artifacts' },
  { id: 'contact', label: 'LEADERSHIP', icon: Users, title: 'Leadership' }
];

export default function SubNavBar({ activeSection, onSelectSection }) {
  const activeIndex = navItems.findIndex((item) => item.id === activeSection);

  return (
    <nav className="about-subnav-bar" aria-label="Section Navigation">
      <div className="subnav-items-track">
        {/* Animated sliding blue rounded highlight behind the active icon */}
        <div
          className="subnav-active-pill"
          style={{
            '--nav-active-idx': activeIndex >= 0 ? activeIndex : 1
          }}
          aria-hidden="true"
        />

        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              className={`about-nav-icon-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (!isActive) {
                  sounds.playClick();
                  onSelectSection(item.id);
                }
              }}
              title={item.title}
              aria-label={item.title}
              id={`nav-btn-${item.id}`}
            >
              <div className="nav-icon-box">
                <IconComponent size={20} strokeWidth={1.5} className="nav-svg-icon" />
              </div>
              {isActive && <span className="nav-icon-label">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
