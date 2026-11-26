export const overviewDeckCards = [
  {
    id: 'shield',
    sectionId: 'projects',
    title: 'Shield of the Forge',
    image: '/assets/card-shield.png'
  },
  {
    id: 'sword',
    sectionId: 'quests',
    title: 'Sword of Valor',
    image: '/assets/card-sword.png'
  },
  {
    id: 'bow',
    sectionId: 'skills',
    title: 'Hunter Bow',
    image: '/assets/card-bow.png'
  },
  {
    id: 'axe',
    sectionId: 'contact',
    title: 'Battle Axe of Pyre',
    image: '/assets/card-axe.png'
  }
];

export const weaponToSectionMap = {
  shield: 'projects',
  sword: 'quests',
  bow: 'skills',
  axe: 'contact'
};

export const sectionOverviewData = {
  projects: {
    sectionId: 'projects',
    title: 'PROJECTS',
    subtitle: 'THE FORGE',
    description: 'Each creation is a relic — tested in battle, refined through failure, and sealed in the vault of experience.',
    bgImage: '/assets/bg-cinder-vail.jpg?v=7',
    cardId: 'shield',
    weaponName: 'Shield of the Forge'
  },
  quests: {
    sectionId: 'quests',
    title: 'VICTORIES',
    subtitle: 'TRIALS SURVIVED',
    description: 'Not all victories are loud. Some are earned through persistence and precision.',
    bgImage: '/assets/bg-wrathful-caldera.jpg?v=7',
    cardId: 'sword',
    weaponName: 'Sword of Valor'
  },
  skills: {
    sectionId: 'skills',
    title: 'SKILLS',
    subtitle: 'ABILITIES UNLOCKED',
    description: 'Power is earned, not given. Each ability was unlocked through repeated trials and relentless iteration.',
    bgImage: '/assets/bg-infernal-threshold.jpg?v=7',
    cardId: 'bow',
    weaponName: 'Hunter Bow'
  },
  contact: {
    sectionId: 'contact',
    title: 'LEADERSHIP',
    subtitle: 'COMMANDS EARNED',
    description: 'Leadership is taking responsibility, guiding others, inspiring people, and creating a positive impact.',
    bgImage: '/assets/bg-mount-pyre.jpg?v=7',
    cardId: 'axe',
    weaponName: 'Battle Axe of Pyre'
  }
};
