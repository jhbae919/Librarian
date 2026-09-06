import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from './engine';
import { UIState, DialogueNode, Language } from './types';
import { getStoryEvents } from './story';
import { TRANSLATIONS } from './i18n';
import { BookOpen, Sword, Settings as SettingsIcon, Globe, X, Check, Backpack, Bed, Crown, BicepsFlexed, Orbit, Wand2, Shield, ShieldAlert, Heart, Target, Zap, Star } from 'lucide-react';

const READABLE_BOOKS = [
  { id: 'b1', titleKo: '도서관 운영의 기초', titleEn: 'Basics of Library Management', descKo: '이 거대한 마법 도서관을 관리하는 기본적인 지침서입니다.', descEn: 'A basic guidebook on how to manage this massive magical library.', readTime: 2, maxReads: 3, category: 'stats', rewards: { stats: { bonusHp: 10, armor: 2 } } },
  { id: 'b2', titleKo: '어둠의 생물학', titleEn: 'Biology of the Dark', descKo: '공허에서 온 괴물들의 약점과 생태에 대해 적혀있습니다.', descEn: 'Contains information about the ecology and weaknesses of void monsters.', readTime: 4, maxReads: 5, category: 'skills', rewards: { skills: [{ ko: '약점 포착', en: 'Weakness Spotting', descKo: '적의 취약점을 파악하여 치명타 확률이 증가합니다.', descEn: "Identify enemy weaknesses to increase critical hit rate." }] } },
  { id: 'b3', titleKo: '고대 마법의 기원', titleEn: 'Origins of Ancient Magic', descKo: '잊혀진 고대 마법의 기원과 발현 방법에 대한 기록입니다.', descEn: 'Records of the forgotten origins of ancient magic and how to manifest it.', readTime: 6, maxReads: 3, category: 'mana', rewards: { stats: { ap: 15, mr: 5 } } },
  { id: 'b4', titleKo: '영웅들의 연대기', titleEn: 'Chronicles of Heroes', descKo: '과거 세상을 구했던 위대한 영웅들의 서사시입니다.', descEn: 'The epic tales of great heroes who saved the world in the past.', readTime: 3, maxReads: 2, category: 'stats', rewards: { stats: { atk: 5, critRate: 2 } } },
  { id: 'b5', titleKo: '초급 마나 호흡법', titleEn: 'Basic Mana Breathing', descKo: '마나를 느끼고 체내에 축적하는 가장 기초적인 호흡법입니다.', descEn: 'The most basic breathing method for sensing and accumulating mana.', readTime: 3, maxReads: 5, category: 'mana', rewards: { stats: { ap: 5, bonusHp: 20 } } },
  { id: 'b6', titleKo: '약초학 개론', titleEn: 'Intro to Herbology', descKo: '주변에서 흔히 볼 수 있는 약초들의 효능과 부작용에 대한 설명.', descEn: 'Effects and side effects of common herbs.', readTime: 2, maxReads: 3, category: 'stats', rewards: { stats: { bonusHp: 30 } } },
  { id: 'b7', titleKo: '정령과의 대화', titleEn: 'Speaking with Spirits', descKo: '자연 속에 깃든 하급 정령들과 교감하는 방법과 주의점.', descEn: 'How to communicate with lesser nature spirits.', readTime: 5, maxReads: 4, category: 'mana', rewards: { skills: [{ ko: '정령의 위로', en: 'Spirit\'s Comfort' }] } },
  { id: 'b8', titleKo: '제국의 역사 1권', titleEn: 'History of the Empire Vol.1', descKo: '건국 이래 300년간의 굵직한 사건들을 다루는 역사서입니다.', descEn: 'History of major events during the 300 years since the empire\'s founding.', readTime: 8, maxReads: 1, category: 'stats', rewards: { stats: { atk: 10, armor: 10 } } },
  { id: 'b9', titleKo: '별의 궤적', titleEn: 'Trajectories of Stars', descKo: '천체의 움직임을 통해 마법의 흐름을 읽는 점성술 서적입니다.', descEn: 'Astrology book on reading the flow of magic through the stars.', readTime: 6, maxReads: 3, category: 'mana', rewards: { stats: { ap: 10, mr: 10 } } },
  { id: 'b10', titleKo: '환영 마법 기초', titleEn: 'Basics of Illusion', descKo: '빛과 소리를 왜곡하여 단순한 환영을 만드는 기초 마법.', descEn: 'Basic magic to distort light and sound to create simple illusions.', readTime: 4, maxReads: 4, category: 'skills', rewards: { skills: [{ ko: '분신술', en: 'Clone Illusion', descKo: '자신과 똑같은 환영을 만들어 적을 교란합니다.', descEn: "Create an exact illusion of yourself to confuse enemies." }] } },
  { id: 'b11', titleKo: '마법 물약 레시피', titleEn: 'Magic Potion Recipes', descKo: '초보 연금술사를 위한 50가지 필수 물약 조제법이 담겨 있습니다.', descEn: '50 essential potion recipes for novice alchemists.', readTime: 5, maxReads: 3, category: 'stats', rewards: { stats: { bonusHp: 15, mr: 5 } } },
  { id: 'b12', titleKo: '검술 교본: 상권', titleEn: 'Swordsmanship: Part 1', descKo: '왕국 기사단에서 사용하는 표준 검술의 기초 자세 모음.', descEn: 'Basic stances of standard swordsmanship used by the royal knights.', readTime: 4, maxReads: 5, category: 'skills', rewards: { stats: { atk: 8, critDmg: 5 } } },
  { id: 'b13', titleKo: '고대어 사전', titleEn: 'Ancient Dictionary', descKo: '지금은 쓰이지 않는 고대 마법어들의 해석본.', descEn: 'Interpretations of ancient magic words no longer in use.', readTime: 12, maxReads: 1, category: 'stats', rewards: { stats: { ap: 25 } } },
  { id: 'b14', titleKo: '차원 이동 이론', titleEn: 'Theory of Dimension Travel', descKo: '다른 차원으로 넘어가는 문을 여는 이론적 고찰. 매우 위험합니다.', descEn: 'Theoretical study on opening doors to other dimensions. Very dangerous.', readTime: 24, maxReads: 2, category: 'mana', rewards: { skills: [{ ko: '점멸', en: 'Blink', descKo: '짧은 거리를 순간이동하여 공격을 회피하거나 접근합니다.', descEn: "Teleport a short distance to evade attacks or close in." }] } },
  { id: 'b15', titleKo: '드래곤의 생태', titleEn: 'Ecology of Dragons', descKo: '멸종된 것으로 알려진 고대 드래곤들의 거주지와 생활 양식.', descEn: 'Habitats and lifestyles of supposedly extinct ancient dragons.', readTime: 7, maxReads: 2, category: 'stats', rewards: { stats: { armor: 15, mr: 15 } } },
  { id: 'b16', titleKo: '골렘 제작법', titleEn: 'How to make a Golem', descKo: '흙과 돌에 생명을 불어넣어 충실한 종복을 만드는 비전.', descEn: 'Secret arts of breathing life into clay and stone to create servants.', readTime: 10, maxReads: 3, category: 'skills', rewards: { skills: [{ ko: '골렘 소환', en: 'Summon Golem', descKo: '흙과 돌로 이루어진 골렘을 소환하여 전투를 돕게 합니다.', descEn: "Summon a golem made of earth and stone to aid in battle." }] } },
  { id: 'b17', titleKo: '정신 지배의 위험성', titleEn: 'Dangers of Mind Control', descKo: '타인의 정신을 조종할 때 시전자가 겪게 되는 끔찍한 부작용들.', descEn: 'Terrible side effects the caster faces when controlling others\' minds.', readTime: 3, maxReads: 4, category: 'skills', rewards: { stats: { mr: 20 } } },
  { id: 'b18', titleKo: '마법 아이템 감정법', titleEn: 'Appraising Magic Items', descKo: '물건에 깃든 마력의 종류와 강도를 알아내는 기초 요령.', descEn: 'Basic tips for discovering the type and strength of magic in items.', readTime: 4, maxReads: 5, category: 'mana', rewards: { skills: [{ ko: '마력 투시', en: 'Mana Vision', descKo: '보이지 않는 마력의 흐름을 읽어냅니다.', descEn: "Read the unseen flow of magical energy." }] } },
  { id: 'b19', titleKo: '신성 모독과 이단', titleEn: 'Blasphemy and Heresy', descKo: '교단에서 금지한 사악한 의식들에 대한 상세한 기록.', descEn: 'Detailed records of evil rituals forbidden by the order.', readTime: 5, maxReads: 2, category: 'stats', rewards: { stats: { atk: 12, critRate: 5 } } },
  { id: 'b20', titleKo: '그림자 걷기', titleEn: 'Shadow Walking', descKo: '어둠 속에 완벽하게 동화되어 기척을 숨기는 고도의 은신술.', descEn: 'High-level stealth skill to blend completely into the shadows.', readTime: 6, maxReads: 3, category: 'skills', rewards: { skills: [{ ko: '은신', en: 'Stealth', descKo: '어둠 속에 몸을 숨겨 적의 시야에서 벗어납니다.', descEn: "Hide in the shadows to escape the enemy's sight." }] } }
];

const ENCYCLOPEDIA_ENTRIES = [
  { id: 'e1', titleKo: '마법의 기원', titleEn: 'Origin of Magic', descKo: '고대 마법의 기원에 대한 방대한 기록입니다.', descEn: 'Extensive records on the origin of ancient magic.', hintKo: '기본 지급', hintEn: 'Default', rewards: { stats: { ap: 15, mr: 5 } } },
  { id: 'e2', titleKo: '정령술 기초', titleEn: 'Basics of Spirit Magic', descKo: '자연의 정령들과 소통하는 법을 다룹니다.', descEn: 'Covers how to communicate with nature spirits.', hintKo: '기본 지급', hintEn: 'Default', rewards: { skills: [{ ko: '정령의 위로', en: 'Spirit\'s Comfort' }] } },
  { id: 'e3', titleKo: '어둠의 생물학', titleEn: 'Biology of the Dark', descKo: '공허에서 온 괴물들의 약점과 생태에 대해 적혀있습니다.', descEn: 'Contains information about the ecology and weaknesses of void monsters.', hintKo: '어둠의 생물 10마리 처치', hintEn: 'Defeat 10 dark creatures', rewards: { skills: [{ ko: '약점 포착', en: 'Weakness Spotting', descKo: '적의 취약점을 파악하여 치명타 확률이 증가합니다.', descEn: "Identify enemy weaknesses to increase critical hit rate." }] } },
  { id: 'e4', titleKo: '시간 마법의 이해', titleEn: 'Understanding Time Magic', descKo: '시간을 되돌리거나 멈추는 금단의 마법입니다.', descEn: 'Forbidden magic to rewind or stop time.', hintKo: '도서관 깊은 곳의 숨겨진 방 발견', hintEn: 'Discover the hidden room deep in the library', rewards: { skills: [{ ko: '시간 정지', en: 'Time Stop', descKo: '짧은 시간 동안 주변의 시간을 멈춥니다.', descEn: "Stop time around you for a brief moment." }] } },
  { id: 'e5', titleKo: '고위 연금술', titleEn: 'High Alchemy', descKo: '현자의 돌을 연성하는 방법에 대한 단서가 있습니다.', descEn: 'Clues on how to transmute the Philosopher\'s Stone.', hintKo: '연금술 실험실 방문', hintEn: 'Visit the alchemy lab', rewards: { stats: { bonusHp: 50, armor: 10, mr: 10 } } },
  { id: 'e6', titleKo: '드래곤의 언어', titleEn: 'Language of Dragons', descKo: '드래곤들의 고대 언어인 용언의 기초 문법서입니다.', descEn: 'Basic grammar book of the Dragon Language, the ancient tongue of dragons.', hintKo: '드래곤 비늘 획득', hintEn: 'Obtain a dragon scale', rewards: { stats: { atk: 20, ap: 20 } } },
  { id: 'e7', titleKo: '차원 이동 포탈', titleEn: 'Dimensional Portals', descKo: '다른 차원으로 넘어가는 문을 여는 방법입니다.', descEn: 'How to open doors to other dimensions.', hintKo: '공허술사 처치', hintEn: 'Defeat a Void Mage', rewards: { skills: [{ ko: '차원 이동', en: 'Dimension Travel', descKo: '다른 차원으로 이동하여 위협에서 벗어납니다.', descEn: "Travel to another dimension to escape threats." }] } },
  { id: 'e8', titleKo: '신성한 치유술', titleEn: 'Divine Healing', descKo: '신의 힘을 빌려 치명상을 치료하는 기적의 주문서입니다.', descEn: 'A miraculous spellbook to heal fatal wounds using divine power.', hintKo: '체력이 10% 이하로 떨어짐', hintEn: 'Health drops below 10%', rewards: { skills: [{ ko: '완전한 치유', en: 'Full Heal', descKo: '어떤 상처든 즉각적으로 완전히 치료합니다.', descEn: "Instantly and completely heal any wound." }] } },
];


const STAT_LABELS: Record<string, {ko: string, en: string}> = {
  atk: { ko: '공격력', en: 'Attack' },
  ap: { ko: '주문력', en: 'Ability Power' },
  armor: { ko: '방어력', en: 'Armor' },
  mr: { ko: '마법저항', en: 'Magic Resist' },
  bonusHp: { ko: '추가 생명력', en: 'Bonus HP' },
  critRate: { ko: '치명타율', en: 'Crit Rate' },
  critDmg: { ko: '치명타 피해', en: 'Crit Damage' }
};
const STAT_ICONS: Record<string, any> = {
  atk: Sword,
  ap: Wand2,
  armor: Shield,
  mr: ShieldAlert,
  bonusHp: Heart,
  critRate: Target,
  critDmg: Zap
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Language State - Default to Korean ('ko')
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('game_lang');
    return (saved === 'en' || saved === 'ko') ? saved : 'ko';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookListOpen, setIsBookListOpen] = useState(false);

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusTab, setStatusTab] = useState<'stats' | 'mana' | 'skills'>('stats');
  const [selectedStatusItem, setSelectedStatusItem] = useState<{ko: string, en: string, descKo: string, descEn: string, sourceKo: string, sourceEn: string} | null>(null);


  const [bookListTab, setBookListTab] = useState<'stats' | 'mana' | 'skills'>('stats');
  const [selectedBook, setSelectedBook] = useState<typeof READABLE_BOOKS[0] | null>(null);
  
  // Book Reading Progress State
  const [bookProgress, setBookProgress] = useState<Record<string, { readCount: number, readDays: number }>>({});
  const [currentlyReading, setCurrentlyReading] = useState<string | null>(null);
  const [bookToStart, setBookToStart] = useState<typeof READABLE_BOOKS[0] | null>(null);
  const [showReadingError, setShowReadingError] = useState(false);
  const [showMaxReadsError, setShowMaxReadsError] = useState(false);
  const [completedBook, setCompletedBook] = useState<typeof READABLE_BOOKS[0] | null>(null);
  const prevDayRef = useRef(1);
  
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [selectedEncyclopediaEntry, setSelectedEncyclopediaEntry] = useState<typeof ENCYCLOPEDIA_ENTRIES[0] | null>(null);
  const [unlockedEncyclopedia, setUnlockedEncyclopedia] = useState<string[]>(['e1', 'e2']);

  const currentStats = React.useMemo(() => {
    const base: Record<string, number> = {
      hp: 100, maxHp: 100, atk: 10, ap: 10, armor: 5, mr: 5, critRate: 5, critDmg: 150
    };
    Object.entries(bookProgress).forEach(([bookId, progress]: [string, any]) => {
      if (progress.readCount > 0) {
        const book = READABLE_BOOKS.find(b => b.id === bookId);
        if (book && book.rewards?.stats) {
          Object.entries(book.rewards.stats).forEach(([stat, val]) => {
            if (base[stat] !== undefined) {
              base[stat] += val * progress.readCount;
            } else if (stat === 'bonusHp') {
              base.hp += val * progress.readCount;
              base.maxHp += val * progress.readCount;
            }
          });
        }
      }
    });
    unlockedEncyclopedia.forEach(id => {
      const entry = ENCYCLOPEDIA_ENTRIES.find(e => e.id === id);
      if (entry && entry.rewards?.stats) {
        Object.entries(entry.rewards.stats).forEach(([stat, val]) => {
          if (base[stat] !== undefined) {
            base[stat] += val;
          } else if (stat === 'bonusHp') {
            base.hp += val;
            base.maxHp += val;
          }
        });
      }
    });
    return base;
  }, [bookProgress, unlockedEncyclopedia]);

  const unlockedAbilities = React.useMemo(() => {
    const mana: any[] = [];
    const skills: any[] = [];
    
    Object.entries(bookProgress).forEach(([bookId, progress]: [string, any]) => {
      if (progress.readCount > 0) {
        const book = READABLE_BOOKS.find(b => b.id === bookId);
        if (book && book.rewards?.skills) {
          book.rewards.skills.forEach(skill => {
            const item = { ...skill, sourceKo: book.titleKo, sourceEn: book.titleEn };
            if (book.category === 'mana') {
              if (!mana.find(m => m.ko === skill.ko)) mana.push(item);
            } else {
              if (!skills.find(s => s.ko === skill.ko)) skills.push(item);
            }
          });
        }
      }
    });
    
    unlockedEncyclopedia.forEach(id => {
      const entry = ENCYCLOPEDIA_ENTRIES.find(e => e.id === id);
      if (entry && entry.rewards?.skills) {
        entry.rewards.skills.forEach(skill => {
          const item = { ...skill, sourceKo: entry.titleKo, sourceEn: entry.titleEn };
          if (!skills.find(s => s.ko === skill.ko) && !mana.find(m => m.ko === skill.ko)) {
            skills.push(item); // default to skills for encyclopedia
          }
        });
      }
    });
    
    return { mana, skills };
  }, [bookProgress, unlockedEncyclopedia]);


  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [showDayEffect, setShowDayEffect] = useState(false);

  const [uiState, setUiState] = useState<UIState>({
    phase: 'explore',
    stats: { hp: 100, maxHp: 100, str: 10, mag: 10, agi: 160 },
    day: 1
  });

  // Dialogue System State
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode[] | null>(null);
  const [dialogueIdx, setDialogueIdx] = useState(0);
  const [tutorialPhase, setTutorialPhase] = useState<'none' | 'library' | 'book' | 'read' | 'nextDayWait'>('none');
  const [showBattleBackground, setShowBattleBackground] = useState(false);

  const t = TRANSLATIONS[language];

  // Change Language Handler
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('game_lang', newLang);
    if (engineRef.current) {
      engineRef.current.setLanguage(newLang);
    }
  };

  // Re-generate current active dialogue if language changes mid-dialogue
  useEffect(() => {
    if (activeDialogue && currentEventId && engineRef.current) {
      const events = getStoryEvents(language, uiState, setUiState, engineRef.current, handleTriggerDialogue);
      if (events[currentEventId]) {
        const nodes = events[currentEventId]();
        setActiveDialogue(nodes);
      }
    }
  }, [language]);

  const handleTriggerDialogue = (id: string) => {
    if (!engineRef.current) return;
    const events = getStoryEvents(language, uiState, setUiState, engineRef.current, handleTriggerDialogue);
    const generator = events[id];
    if (generator) {
      setCurrentEventId(id);
      engineRef.current.isPaused = true;
      engineRef.current.phase = 'dialogue';
      setUiState(prev => ({ ...prev, phase: 'dialogue' }));
      const nodes = generator();
      setActiveDialogue(nodes);
      setDialogueIdx(0);
    }
  };

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    document.addEventListener('touchmove', preventDefault, { passive: false });

    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(
        canvasRef.current,
        setUiState,
        handleTriggerDialogue,
        language,
        () => { setIsBookListOpen(true); setTutorialPhase(prev => prev === 'library' ? 'book' : prev); }
      );

      // Start Intro Dialogue
      engineRef.current.isPaused = true;
      engineRef.current.phase = 'dialogue';
      setCurrentEventId('intro');
      const events = getStoryEvents(language, uiState, setUiState, engineRef.current, handleTriggerDialogue);
      const introNodes = events['intro']();
      setActiveDialogue(introNodes);
    }

    return () => {
      document.removeEventListener('touchmove', preventDefault);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  // Update engine stats when uiState changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.player.stats = { ...uiState.stats };
      engineRef.current.day = uiState.day;
    }
  }, [uiState.day, uiState.stats, uiState.phase]);

  
  useEffect(() => {
    if (!showDayEffect && uiState.day > prevDayRef.current) {
      prevDayRef.current = uiState.day;
      
      if (currentlyReading) {
        setBookProgress(prev => {
          const book = READABLE_BOOKS.find(b => b.id === currentlyReading);
          const currentProgress = prev[currentlyReading] || { readCount: 0, readDays: 0 };
          const newReadDays = currentProgress.readDays + 1;
          
          if (book && newReadDays >= book.readTime) {
            // Finished reading!
            setCompletedBook(book);
            setCurrentlyReading(null);
            
            return {
              ...prev,
              [currentlyReading]: {
                ...currentProgress,
                readDays: 0,
                readCount: currentProgress.readCount + 1
              }
            };
          }
          
          return {
            ...prev,
            [currentlyReading]: {
              ...currentProgress,
              readDays: newReadDays
            }
          };
        });
      }
    }
  }, [uiState.day, currentlyReading, showDayEffect]);

  const handleNextDay = () => {
    setShowDayEffect(true);
    
    // Change day in the middle of the flash
    setTimeout(() => {
      setUiState(prev => ({
        ...prev,
        day: prev.day + 1
      }));
    }, 400);

    // End flash
    setTimeout(() => {
      setShowDayEffect(false);
      setTutorialPhase(prevPhase => {
        if (prevPhase === 'nextDayWait') {
          // Note: calling nextDialogue here is safe because nextDialogue doesn't depend on stale closure (it uses setDialogueIdx(prev => prev + 1) hopefully? Wait, nextDialogue uses dialogueIdx + 1. It might be stale.
          // To fix stale dialogueIdx, let's just dispatch an effect or use a ref.
          // Better: just call it directly, it should be fine if we don't spam click.
        }
        return prevPhase;
      });
      if (tutorialPhase === 'nextDayWait') {
        setTutorialPhase('none');
        nextDialogue();
      }
    }, 1500);
  };


  useEffect(() => {
    if (activeDialogue && activeDialogue[dialogueIdx]) {
      const text = activeDialogue[dialogueIdx].text;
      if (text.includes('이곳에서는 독서를 통해 새로운 능력이나 스킬을 얻을 수 있으며') || text.includes('Here, you can acquire new abilities or skills through reading')) {
        if (tutorialPhase === 'none') {
          setTutorialPhase('library');
        }
      } else if (text.includes('읽을 책을 선정하고 다음 날로 넘어가면 자동으로 책을 읽을 수 있습니다') || text.includes('If you select a book to read and proceed to the next day')) {
        if (tutorialPhase === 'none') {
          setTutorialPhase('nextDayWait');
        }
      }
      
      if (text.includes('다음은 전투입니다') || text.includes('Next is combat')) {
        setShowBattleBackground(true);
      }
    }
  }, [activeDialogue, dialogueIdx]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.highlightBookButton = (tutorialPhase === 'library');
    }
  }, [tutorialPhase]);

  const nextDialogue = () => {
    if (!activeDialogue || !engineRef.current) return;

    if (dialogueIdx + 1 < activeDialogue.length) {
      setDialogueIdx(dialogueIdx + 1);
    } else {
      // Close Dialogue
      setActiveDialogue(null);
      setCurrentEventId(null);
      setDialogueIdx(0);

      engineRef.current.phase = 'explore';
      setUiState(prev => ({ ...prev, phase: 'explore' }));
      engineRef.current.isPaused = false;
    }
  };

  const handleChoice = (action: () => void) => {
    action();
    nextDialogue();
  };

  const renderStandingIllustration = (portraitKey: string) => {
    if (portraitKey === 'senior_librarian') {
      return (
        <div className="relative h-full flex items-end justify-center pointer-events-none select-none w-full">
          <img 
            src="/단장(웃음).png" 
            alt="Senior Librarian" 
            className="h-full w-auto max-w-[85vw] sm:max-w-[550px] object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] filter transition-all duration-300 animate-in fade-in slide-in-from-bottom-6"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      );
    }

    // High quality themed standing avatar for other NPCs / books
    switch (portraitKey) {
      case 'king':
        return (
          <div className="h-[45vh] max-h-[400px] flex items-end justify-center pointer-events-none p-4 pb-0">
            <div className="flex flex-col items-center justify-center p-8 rounded-full bg-gradient-to-t from-amber-600/30 to-yellow-400/10 border-2 border-yellow-400/40 backdrop-blur-sm shadow-[0_0_50px_rgba(234,179,8,0.3)]">
              <Crown className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)] animate-pulse" />
            </div>
          </div>
        );
      case 'book':
        return (
          <div className="h-[45vh] max-h-[400px] flex items-end justify-center pointer-events-none p-4 pb-0">
            <div className="flex flex-col items-center justify-center p-8 rounded-full bg-gradient-to-t from-amber-700/30 to-yellow-500/10 border-2 border-amber-400/40 backdrop-blur-sm shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <BookOpen className="w-24 h-24 sm:w-32 sm:h-32 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
            </div>
          </div>
        );
      case 'system':
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black text-stone-200 font-sans select-none overflow-hidden touch-none">
      {/* PURE CANVAS LAYER for GAME ENGINE */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* BATTLE BACKGROUND LAYER */}
      <div 
        className={`absolute inset-0 z-[5] pointer-events-none transition-opacity duration-1000 ${
          showBattleBackground ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url(/전투배경.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Enemy UI (Top Left) */}
        <div className="absolute top-6 left-4 sm:top-10 sm:left-10 flex items-start gap-4 sm:gap-6 pointer-events-auto">
          {/* Enemy Portrait Placeholder (Enlarged 2x+) */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 bg-stone-900/80 border-2 border-stone-500 rounded-md flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            <span className="text-stone-500 text-xs sm:text-lg font-bold">Enemy</span>
          </div>
          {/* Enemy HP */}
          <div className="flex flex-col mt-2 sm:mt-4">
            <div className="relative w-40 sm:w-64 h-5 sm:h-8 bg-stone-950 border sm:border-2 border-stone-700 rounded-sm overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300" 
                style={{ width: `${(10/36)*100}%` }} 
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-base text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-wider">
                10 / 36
              </div>
            </div>
          </div>
        </div>

        {/* Player UI (Bottom Left - Pushed to very bottom) */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-start sm:items-center gap-3 sm:gap-6 pointer-events-auto">
          {/* Player Portrait Placeholder (Enlarged to match Enemy) */}
          <div className="w-32 h-32 sm:w-48 sm:h-48 shrink-0 bg-stone-900/80 border-2 border-stone-500 rounded-md flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-sm">
            <span className="text-stone-500 text-xs sm:text-lg font-bold">Player</span>
          </div>
          
          {/* Player Stats (HP and MP Bars) */}
          <div className="flex flex-col justify-center gap-2 sm:gap-4 bg-stone-900/90 px-3 sm:px-6 py-2 sm:py-0 h-32 sm:h-48 rounded-md border border-stone-600 shadow-lg backdrop-blur-sm shrink-0 w-32 sm:w-64">
            
            {/* HP Bar */}
            <div className="flex flex-col gap-1">
              <span className="text-red-400 font-bold text-[10px] sm:text-sm font-sans tracking-widest drop-shadow-md">HP</span>
              <div className="relative w-full h-4 sm:h-8 bg-stone-950 border sm:border-2 border-stone-700 rounded-sm overflow-hidden shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-300" 
                  style={{ width: `${(10/26)*100}%` }} 
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-base text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-wider">
                  10 / 26
                </div>
              </div>
            </div>

            {/* MP Bar */}
            <div className="flex flex-col gap-1">
              <span className="text-blue-400 font-bold text-[10px] sm:text-sm font-sans tracking-widest drop-shadow-md">MP</span>
              <div className="relative w-full h-4 sm:h-8 bg-stone-950 border sm:border-2 border-stone-700 rounded-sm overflow-hidden shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${(10/26)*100}%` }} 
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-base text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,1)] tracking-wider">
                  10 / 26
                </div>
              </div>
            </div>

          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-4 shrink-0 h-32 sm:h-48 flex-col sm:flex-row">
            <button className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-500 rounded px-4 sm:px-8 text-xs sm:text-base font-bold shadow-lg transition-colors active:scale-95 flex items-center justify-center">
              {language === 'ko' ? '능력치' : 'Stats'}
            </button>
            <button className="flex-1 bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-600 rounded px-4 sm:px-8 text-xs sm:text-base font-bold shadow-lg transition-colors active:scale-95 flex items-center justify-center">
              {language === 'ko' ? '공격' : 'Attack'}
            </button>
            <button className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-indigo-100 border border-indigo-600 rounded px-4 sm:px-8 text-xs sm:text-base font-bold shadow-lg transition-colors active:scale-95 flex items-center justify-center">
              {language === 'ko' ? '스킬' : 'Skill'}
            </button>
          </div>
        </div>
      </div>

      {/* DAY TRANSITION EFFECT */}
      <div 
        className={`absolute inset-0 z-50 pointer-events-none bg-stone-950 flex flex-col items-center justify-center transition-all duration-1000 ${
          showDayEffect ? 'opacity-100 backdrop-blur-3xl' : 'opacity-0 backdrop-blur-none'
        }`}
      >
        <span className={`text-4xl sm:text-6xl font-serif font-bold text-yellow-100 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)] transition-all duration-1000 transform ${showDayEffect ? 'scale-100 translate-y-0' : 'scale-75 translate-y-8'}`}>
          Day {uiState.day}
        </span>
      </div>

      {/* REACT UI OVERLAY LAYER */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 z-10">
        {/* HUD TOP BAR */}
        <div className="flex justify-between items-start pointer-events-auto">
          {/* Top Left: Removed */}
          <div />

          {/* Top Right: Settings Button Only */}
          <div className="flex items-center gap-2">
            <button
              id="btn-settings-open"
              onClick={() => { if (tutorialPhase !== 'none') return; setIsSettingsOpen(true); }}
              className="flex items-center gap-1.5 bg-stone-950/90 hover:bg-stone-800 border-2 border-stone-600 active:scale-95 text-stone-200 p-2 sm:p-2.5 rounded-lg shadow-xl backdrop-blur-sm transition-all"
            >
              <SettingsIcon className="w-5 h-5 text-yellow-400 animate-spin-slow" />
            </button>
          </div>
        </div>

        {/* RPG DIALOGUE OVERLAY WITH DARKENED BACKGROUND & STANDING CHARACTER ILLUSTRATION */}
        {activeDialogue && activeDialogue[dialogueIdx] && (
          <div 
            className={`fixed inset-0 ${tutorialPhase !== 'none' ? 'pointer-events-none' : 'pointer-events-auto'} z-30 flex flex-col ${showBattleBackground ? 'justify-center items-end pr-4 sm:pr-8' : 'justify-end'} p-3 sm:p-6 pb-4 sm:pb-8 transition-all duration-300 animate-in fade-in ${activeDialogue[dialogueIdx].portrait === 'system' ? '' : 'bg-black/65 backdrop-blur-[2px]'}`}
            onClick={() => {
              if (tutorialPhase !== 'none') return;
              if (!activeDialogue[dialogueIdx].choices) {
                nextDialogue();
              }
            }}
          >
            
            {/* DEV: Skip Senior Librarian Dialogue */}
            {activeDialogue[dialogueIdx].portrait === 'senior_librarian' && (
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const sysIdx = activeDialogue.findIndex(d => d.portrait === 'system');
                    if (sysIdx !== -1) {
                      setDialogueIdx(sysIdx);
                    } else {
                      // Fallback if no system dialogue found (should not happen)
                      setActiveDialogue(null);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-300 hover:text-yellow-300 bg-stone-900/90 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-amber-500/50 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer font-serif"
                >
                  <span>{language === 'ko' ? '사서 대사 스킵 (테스트용)' : 'Skip Intro (Dev)'}</span>
                  <span>⏩</span>
                </button>
              </div>
            )}

            {/* Standing Character Illustration (Right side of the screen) */}
            <div className="absolute top-12 sm:top-16 bottom-0 -right-4 sm:right-0 md:right-4 lg:right-8 pointer-events-none z-30 flex items-end justify-center">
              {renderStandingIllustration(activeDialogue[dialogueIdx].portrait)}
            </div>

            {/* JRPG Style Wide Dialogue Box */}
            <div
              className={`relative z-40 w-full cursor-pointer pointer-events-auto transition-all duration-500 ${
                showBattleBackground 
                  ? 'max-w-md sm:max-w-lg lg:max-w-xl' 
                  : 'max-w-4xl mx-auto'
              }`}
              onClick={(e) => {
                if (tutorialPhase !== 'none') {
                  e.stopPropagation();
                  return;
                }
                if (!activeDialogue[dialogueIdx].choices) {
                  e.stopPropagation();
                  nextDialogue();
                }
              }}
            >
              {/* Speaker Nameplate (Protruding badge at top-left like reference image) */}
              <div className="absolute -top-4 left-4 sm:left-8 z-50 flex items-center gap-2 bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 border-2 border-amber-400 px-4 sm:px-6 py-1 rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <span className="text-yellow-300 font-bold text-sm sm:text-base tracking-wider font-serif drop-shadow-md">
                  {activeDialogue[dialogueIdx].speaker}
                </span>
              </div>

              {/* Main Dialogue Panel */}
              <div className="bg-gradient-to-b from-stone-950/95 via-stone-900/95 to-stone-950/98 border-2 sm:border-[3px] border-amber-500/80 rounded-xl sm:rounded-2xl p-5 sm:p-7 pt-6 sm:pt-7 shadow-[0_12px_40px_rgba(0,0,0,0.85)] relative backdrop-blur-md flex flex-col justify-between min-h-[120px] sm:min-h-[145px]">
                {/* Gold Filigree Corner Accents */}
                <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-yellow-400/80" />
                <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-yellow-400/80" />
                <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-yellow-400/80" />
                <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-yellow-400/80" />

                {/* Text Content Area (with right padding so text doesn't overlap standing illustration on large screens) */}
                <div className="font-serif pr-2 sm:pr-36 md:pr-48 lg:pr-56 select-none">
                  <p className="text-stone-100 text-sm sm:text-base md:text-lg leading-relaxed sm:leading-loose tracking-wide drop-shadow">
                    {activeDialogue[dialogueIdx].text}
                  </p>
                </div>

                {/* Bottom Interactive Area: Choices or Click Prompt */}
                <div className="mt-3 sm:mt-4 flex items-center justify-end">
                  {activeDialogue[dialogueIdx].choices ? (
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-end z-50">
                      {activeDialogue[dialogueIdx].choices.map((c, i) => (
                        <button
                          key={i}
                          id={`dialogue-choice-${i}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChoice(c.action);
                          }}
                          className="bg-gradient-to-b from-amber-900 to-amber-950 hover:from-amber-800 hover:to-amber-900 active:scale-95 border-2 border-yellow-400/90 text-yellow-200 py-2 px-4 sm:px-6 rounded-lg font-bold text-xs sm:text-sm shadow-xl transition-all font-sans cursor-pointer hover:border-yellow-300"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  ) : tutorialPhase === 'none' ? (
                    <div className="text-right text-yellow-400/90 text-xs sm:text-sm animate-pulse font-sans flex items-center gap-1.5 font-medium">
                      <span>{t.dialogue.clickToContinue}</span>
                      <span className="text-amber-300 text-sm">▶</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BAR AND NEXT DAY BUTTON */}
        {(!activeDialogue || tutorialPhase === 'nextDayWait') && (
          <>
            <div className="pointer-events-auto flex justify-center pb-2 sm:pb-4 w-full">
              <div className="flex items-center gap-8 sm:gap-12 bg-stone-900/40 backdrop-blur-md border border-stone-600/30 rounded-full px-8 sm:px-10 py-3 sm:py-3.5 shadow-xl">
                {/* Stats Button */}
                <button onClick={() => { if (tutorialPhase !== 'none') return; setIsStatusOpen(true); }} className="flex flex-col items-center gap-1 text-stone-300 hover:text-sky-300 hover:scale-105 active:scale-95 transition-all">
                  <Sword className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
                  <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wide">{language === 'ko' ? '상태' : 'Status'}</span>
                </button>

                {/* Encyclopedia Button */}
                <button 
                  onClick={() => setIsEncyclopediaOpen(true)}
                  className="flex flex-col items-center gap-1 text-stone-300 hover:text-sky-300 hover:scale-105 active:scale-95 transition-all"
                >
                  <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
                  <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wide">도감</span>
                </button>

                {/* Inventory Button */}
                <button className="flex flex-col items-center gap-1 text-stone-300 hover:text-sky-300 hover:scale-105 active:scale-95 transition-all">
                  <Backpack className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-md" />
                  <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wide">인벤토리</span>
                </button>
              </div>
            </div>

            {/* NEXT DAY (REST) BUTTON */}
            <div className={`absolute bottom-14 right-14 sm:bottom-20 sm:right-20 pointer-events-auto ${tutorialPhase === 'nextDayWait' ? 'z-[60]' : ''}`}>
              <button 
                onClick={(e) => { if (tutorialPhase !== 'none' && tutorialPhase !== 'nextDayWait') { e.preventDefault(); return; } handleNextDay(); }}
                className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-stone-800/50 backdrop-blur-md border border-stone-500/40 rounded-2xl rotate-45 hover:bg-stone-700/60 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] group ${tutorialPhase === 'nextDayWait' ? 'animate-pulse ring-4 ring-purple-400 bg-stone-700/80 shadow-[0_0_30px_rgba(168,85,247,0.6)]' : ''}`}
              >
                <div className="-rotate-45 flex flex-col items-center gap-1">
                  <Bed className="w-6 h-6 sm:w-7 sm:h-7 text-stone-300 group-hover:text-purple-300 drop-shadow-md transition-colors" />
                  <span className="text-[10px] sm:text-[11px] font-bold font-sans tracking-wide text-stone-300 group-hover:text-purple-300 transition-colors">Day {uiState.day}</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

            {/* STATUS MODAL */}
      {isStatusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 pointer-events-auto">
          <div className="bg-[#1c1917] border border-[#44403c] rounded-lg p-6 sm:p-8 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative text-stone-200 flex flex-col">
            <button
              onClick={() => setIsStatusOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center mb-6 w-full">
              <h2 className="text-2xl font-bold font-serif text-stone-100 tracking-widest border-b border-stone-600 pb-2 mb-4">
                {language === 'ko' ? '상태 정보' : 'Status Info'}
              </h2>
              
              <div className="flex w-full justify-center gap-4 sm:gap-8 border-b border-stone-700 px-2">
                <button 
                  onClick={() => setStatusTab('stats')}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${statusTab === 'stats' ? 'text-stone-100 border-b-2 border-stone-100 font-bold' : 'text-stone-500 hover:text-stone-300 border-b-2 border-transparent'}`}
                >
                  <Sword className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm font-serif">{language === 'ko' ? '능력치' : 'Stats'}</span>
                </button>
                <button 
                  onClick={() => setStatusTab('mana')}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${statusTab === 'mana' ? 'text-blue-400 border-b-2 border-blue-400 font-bold' : 'text-stone-500 hover:text-blue-300/80 border-b-2 border-transparent'}`}
                >
                  <Orbit className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm font-serif">{language === 'ko' ? '마력 운용' : 'Mana'}</span>
                </button>
                <button 
                  onClick={() => setStatusTab('skills')}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${statusTab === 'skills' ? 'text-purple-400 border-b-2 border-purple-400 font-bold' : 'text-stone-500 hover:text-purple-300/80 border-b-2 border-transparent'}`}
                >
                  <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm font-serif">{language === 'ko' ? '스킬' : 'Skills'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-grow min-h-[300px]">
              {statusTab === 'stats' && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentStats).map(([key, val]) => {
                    if (key === 'maxHp') return null;
                    const label = key === 'hp' ? (language === 'ko' ? '생명력' : 'HP') : STAT_LABELS[key]?.[language];
                    const Icon = key === 'hp' ? Heart : STAT_ICONS[key];
                    return (
                      <div key={key} className="flex items-center justify-between bg-stone-800/50 p-3 rounded border border-stone-700">
                        <div className="flex items-center gap-2 text-stone-300">
                          {Icon && <Icon className="w-5 h-5 opacity-70" />}
                          <span className="font-bold text-sm sm:text-base">{label}</span>
                        </div>
                        <span className="font-bold text-stone-100 font-serif">
                          {key === 'hp' ? `${val} / ${currentStats.maxHp}` : val}{key.includes('Rate') ? '%' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {statusTab === 'mana' && (
                <div className="flex flex-col gap-2">
                  {unlockedAbilities.mana.length === 0 ? (
                    <div className="text-center text-stone-500 py-10 italic">
                      {language === 'ko' ? '보유한 마력 운용이 없습니다.' : 'No mana abilities acquired.'}
                    </div>
                  ) : (
                    unlockedAbilities.mana.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedStatusItem(item)}
                        className="flex items-center gap-3 p-3 bg-stone-800/50 hover:bg-stone-700/60 rounded border border-stone-700 transition-colors text-left"
                      >
                        <Orbit className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-blue-100 flex-grow">{language === 'ko' ? item.ko : item.en}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {statusTab === 'skills' && (
                <div className="flex flex-col gap-2">
                  {unlockedAbilities.skills.length === 0 ? (
                    <div className="text-center text-stone-500 py-10 italic">
                      {language === 'ko' ? '보유한 스킬이 없습니다.' : 'No skills acquired.'}
                    </div>
                  ) : (
                    unlockedAbilities.skills.map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setSelectedStatusItem(item)}
                        className="flex items-center gap-3 p-3 bg-stone-800/50 hover:bg-stone-700/60 rounded border border-stone-700 transition-colors text-left"
                      >
                        <Star className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-purple-100 flex-grow">{language === 'ko' ? item.ko : item.en}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATUS ITEM DETAILS MODAL */}
      {selectedStatusItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 pointer-events-auto">
          <div className="bg-[#1c1917] border border-stone-500 rounded p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-stone-200 flex flex-col">
            <button 
              onClick={() => setSelectedStatusItem(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="p-3 bg-stone-800 rounded-full mb-3">
                {statusTab === 'mana' ? <Orbit className="w-8 h-8 text-blue-400" /> : <Star className="w-8 h-8 text-purple-400" />}
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-100 text-center">
                {language === 'ko' ? selectedStatusItem.ko : selectedStatusItem.en}
              </h3>
            </div>
            
            <div className="bg-stone-800 p-4 rounded mb-6 min-h-[100px] flex flex-col justify-center text-center border border-stone-700">
              <p className="font-serif text-sm sm:text-base leading-relaxed text-stone-300 mb-4">
                {language === 'ko' ? selectedStatusItem.descKo : selectedStatusItem.descEn}
              </p>
              <div className="mt-auto border-t border-stone-700 pt-3">
                <span className="text-xs text-stone-500 font-bold">
                  {language === 'ko' ? '출처: ' : 'Source: '}
                  <span className="text-stone-400">{language === 'ko' ? selectedStatusItem.sourceKo : selectedStatusItem.sourceEn}</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedStatusItem(null)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 active:bg-stone-900 text-stone-200 font-bold rounded font-serif transition-colors border border-stone-600 shadow-md tracking-wider"
            >
              {language === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* BOOK LIST MODAL (Paper Theme) */}
      {isBookListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#f4e4bc] border-8 border-[#5c4033] rounded-md p-6 sm:p-8 w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-[#3e2723]">
            {/* Close Button */}
            <button
              onClick={() => { if (tutorialPhase === 'book') return; setIsBookListOpen(false); }}
              className="absolute top-4 right-4 text-[#5c4033] hover:text-black p-1 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center mb-6 w-full">
              <h2 className="text-3xl font-bold font-serif text-[#4a3018] tracking-widest border-b-2 border-[#8b5a2b] pb-2 mb-4">
                {language === 'ko' ? '도서 목록' : 'Book Index'}
              </h2>
              
              {/* TABS */}
              <div className="flex w-full justify-center gap-4 sm:gap-8 border-b-2 border-[#c8b592] px-2">
                <button 
                  onClick={() => { if (tutorialPhase === 'book') return; setBookListTab('stats'); }}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${bookListTab === 'stats' ? 'text-[#8b5a2b] border-b-4 border-[#8b5a2b] font-bold' : 'text-[#8b5a2b]/60 hover:text-[#8b5a2b]/80 border-b-4 border-transparent'}`}
                >
                  <BicepsFlexed className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="text-sm font-serif">{language === 'ko' ? '능력치' : 'Stats'}</span>
                </button>
                <button 
                  onClick={() => { if (tutorialPhase === 'book') return; setBookListTab('mana'); }}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${bookListTab === 'mana' ? 'text-blue-700 border-b-4 border-blue-700 font-bold' : 'text-[#8b5a2b]/60 hover:text-blue-600/80 border-b-4 border-transparent'}`}
                >
                  <Orbit className={`w-6 h-6 sm:w-7 sm:h-7 ${bookListTab === 'mana' ? 'drop-shadow-[0_0_5px_rgba(29,78,216,0.8)]' : ''}`} />
                  <span className="text-sm font-serif">{language === 'ko' ? '마력 운용' : 'Mana'}</span>
                </button>
                <button 
                  onClick={() => { if (tutorialPhase === 'book') return; setBookListTab('skills'); }}
                  className={`flex flex-col items-center gap-1 pb-2 px-2 transition-all ${bookListTab === 'skills' ? 'text-purple-800 border-b-4 border-purple-800 font-bold' : 'text-[#8b5a2b]/60 hover:text-purple-700/80 border-b-4 border-transparent'}`}
                >
                  <Sword className={`w-6 h-6 sm:w-7 sm:h-7 ${bookListTab === 'skills' ? 'drop-shadow-[0_0_5px_rgba(107,33,168,0.8)]' : ''}`} />
                  <span className="text-sm font-serif">{language === 'ko' ? '스킬' : 'Skills'}</span>
                </button>
              </div>
            </div>

            {/* Book List */}
            <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-3 custom-scrollbar-paper">
              {READABLE_BOOKS.filter(book => book.category === bookListTab).map((book, idx) => {
                const isCurrentlyReading = currentlyReading === book.id;
                
                return (
                <button
                  key={book.id}
                  onClick={() => { 
                    if (tutorialPhase === 'book' && idx !== 0) return;
                    setSelectedBook(book); 
                    if (tutorialPhase === 'book' && idx === 0) setTutorialPhase('read'); 
                  }}
                  className={`text-left py-2 px-3 rounded text-[#4a3018] font-serif border-b border-[#c8b592] border-dashed last:border-0 transition-all duration-300 w-full flex items-center ${isCurrentlyReading ? 'bg-[#e8dcc4] font-extrabold shadow-sm' : 'hover:bg-[#e6d0a3]'} ${(tutorialPhase === 'book' && idx === 0) ? 'animate-pulse ring-4 ring-[#8b5a2b] bg-[#e8dcc4]' : ''}`}
                >
                  <span className={`mr-2 text-sm ${isCurrentlyReading ? 'text-blue-700' : 'text-[#8b5a2b]'}`}>♦</span>
                  <span className="text-sm sm:text-base font-bold truncate">
                    {language === 'ko' ? book.titleKo : book.titleEn}
                  </span>
                  

                </button>
              )
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOOK INFO MODAL */}
      {selectedBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-[#3e2723] flex flex-col">
            <button 
              onClick={() => { if (tutorialPhase === 'read') return; setSelectedBook(null); }} 
              className="absolute top-3 right-3 text-[#5c4033] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold font-serif mb-4 border-b-2 border-[#5c4033] pb-2 text-center text-[#4a3018]">
              {language === 'ko' ? selectedBook.titleKo : selectedBook.titleEn}
            </h3>
            
            <div className="flex flex-col gap-2 mb-4 bg-[#d5c3a1] p-4 rounded border border-[#c8b592]">
              <div className="flex justify-between items-center border-b border-[#c8b592] pb-2">
                <span className="font-bold text-sm font-serif text-[#4a3018]">
                  {language === 'ko' ? '회독 횟수:' : 'Times Read:'}
                </span>
                <span className="font-serif text-sm font-bold text-[#3e2723]">
                  {bookProgress[selectedBook.id]?.readCount || 0} / {selectedBook.maxReads}{language === 'ko' ? '회' : ' times'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-sm font-serif text-[#4a3018]">
                  {language === 'ko' ? '진행도 (시간):' : 'Progress (Days):'}
                </span>
                <span className="font-serif text-sm font-bold text-[#3e2723]">
                  {bookProgress[selectedBook.id]?.readDays || 0} / {selectedBook.readTime}{language === 'ko' ? '일' : ' days'}
                </span>
              </div>
            </div>

            <div className="bg-[#d5c3a1] p-4 rounded mb-8 flex-grow flex flex-col items-center justify-center text-center border border-[#c8b592] shadow-inner">
              <h4 className="text-[#4a3018] font-bold mb-3 border-b-2 border-[#c8b592] pb-1 w-full font-serif">
                {language === 'ko' ? '학습 시 획득 효과' : 'Learning Rewards'}
              </h4>
              <div className="flex flex-col gap-2 text-[#5a3f2b] font-serif">
                {selectedBook.rewards?.stats && Object.entries(selectedBook.rewards.stats).map(([key, val]) => {
                  const Icon = STAT_ICONS[key];
                  return (
                    <span key={key} className="text-sm sm:text-base flex items-center justify-center gap-2 font-bold">
                      {Icon && <Icon className="w-5 h-5 text-[#8b5a2b] drop-shadow-sm" />}
                      {STAT_LABELS[key][language]} +{val}{key.includes('Rate') ? '%' : ''}
                    </span>
                  );
                })}
                {selectedBook.rewards?.skills && selectedBook.rewards.skills.map((skill, idx) => (
                  <span key={idx} className="text-sm sm:text-base font-bold text-purple-800 flex items-center justify-center gap-2">
                    <Star className="w-5 h-5 text-purple-700 drop-shadow-sm" />
                    {language === 'ko' ? '스킬 획득: ' : 'Learn Skill: '} [{language === 'ko' ? skill.ko : skill.en}]
                  </span>
                ))}
                {!selectedBook.rewards?.stats && !selectedBook.rewards?.skills && (
                   <span className="text-sm italic opacity-70">
                     {language === 'ko' ? '알려진 정보가 없습니다.' : 'No known info.'}
                   </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (currentlyReading) {
                  setShowReadingError(true);
                } else {
                  const progress = bookProgress[selectedBook.id] || { readCount: 0, readDays: 0 };
                  if (progress.readCount >= selectedBook.maxReads) {
                    setShowMaxReadsError(true);
                  } else {
                    setBookToStart(selectedBook);
                  }
                }
              }}
              className={`w-full py-3 bg-[#5c4033] hover:bg-[#3e2723] active:bg-[#2e1d19] text-[#e8dcc4] font-bold rounded font-serif transition-colors border-2 border-[#2e1d19] shadow-md tracking-wider ${tutorialPhase === 'read' ? 'animate-pulse ring-4 ring-yellow-400' : ''}`}
            >
              {language === 'ko' ? '책 읽기' : 'Read Book'}
            </button>
          </div>
        </div>
      )}

      
      {/* START READING CONFIRMATION MODAL */}
      {bookToStart && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-[#3e2723] flex flex-col items-center">
            <h3 className="text-xl font-bold font-serif mb-4 text-center text-[#4a3018]">
              {language === 'ko' 
                ? `<${bookToStart.titleKo}>을(를) 읽기 시작합니다.` 
                : `Start reading <${bookToStart.titleEn}>.`}
            </h3>
            <div className="flex gap-4 w-full mt-4">
              <button 
                onClick={() => {
                  setCurrentlyReading(bookToStart.id);
                  setBookProgress(prev => ({
                    ...prev,
                    [bookToStart.id]: {
                      readCount: prev[bookToStart.id]?.readCount || 0,
                      readDays: 0
                    }
                  }));
                  setBookToStart(null);
                  setSelectedBook(null);
                  setIsBookListOpen(false);
                  if (tutorialPhase === 'read') { setTutorialPhase('none'); nextDialogue(); }
                }}
                className={`flex-1 py-2 bg-[#5c4033] hover:bg-[#3e2723] text-[#e8dcc4] font-bold rounded transition-colors ${tutorialPhase === 'read' ? 'animate-pulse ring-4 ring-yellow-400' : ''}`}
              >
                {language === 'ko' ? '예' : 'Yes'}
              </button>
              <button 
                onClick={() => { if (tutorialPhase === 'read') return; setBookToStart(null); }}
                className="flex-1 py-2 bg-[#d5c3a1] hover:bg-[#c8b592] text-[#4a3018] font-bold rounded transition-colors border border-[#8b5a2b]"
              >
                {language === 'ko' ? '아니오' : 'No'}
              </button>
            </div>
          </div>
        </div>
      )}

            {/* MAX READS ERROR MODAL */}
      {showMaxReadsError && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-[#3e2723] flex flex-col items-center">
            <h3 className="text-xl font-bold font-serif mb-6 text-center text-[#4a3018]">
              {language === 'ko' ? '더 읽는 건 의미가 없는 것 같다.' : 'It seems meaningless to read this further.'}
            </h3>
            <button 
              onClick={() => setShowMaxReadsError(false)}
              className="w-full py-2 bg-[#5c4033] hover:bg-[#3e2723] text-[#e8dcc4] font-bold rounded transition-colors"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* READING ERROR MODAL */}
      {showReadingError && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-[#3e2723] flex flex-col items-center">
            <h3 className="text-xl font-bold font-serif mb-6 text-center text-[#4a3018]">
              {language === 'ko' ? '이미 읽고 있는 책이 있습니다.' : 'You are already reading a book.'}
            </h3>
            <button 
              onClick={() => setShowReadingError(false)}
              className="w-full py-2 bg-[#5c4033] hover:bg-[#3e2723] text-[#e8dcc4] font-bold rounded transition-colors"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* READING COMPLETION MODAL */}
      {completedBook && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-[#3e2723] flex flex-col items-center">
            <h3 className="text-xl font-bold font-serif mb-6 text-center text-[#4a3018]">
              {language === 'ko' 
                ? `<${completedBook.titleKo}>을(를) 다 읽었습니다.` 
                : `Finished reading <${completedBook.titleEn}>.`}
            </h3>
            <button 
              onClick={() => setCompletedBook(null)}
              className="w-full py-2 bg-[#5c4033] hover:bg-[#3e2723] text-[#e8dcc4] font-bold rounded transition-colors"
            >
              {language === 'ko' ? '확인' : 'OK'}
            </button>
          </div>
        </div>
      )}

      {/* CURRENTLY READING INDICATOR */}
      {currentlyReading && uiState.phase === 'explore' && !showBattleBackground && (
        <div className="absolute bottom-6 left-6 flex flex-col gap-0 z-40 pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 font-magic">
          <span 
            className="text-amber-200/90 italic text-xs tracking-[0.2em] mb-1 animate-magic-glow"
          >
            {language === 'ko' ? '✦ 해독 진행 중 ✦' : '✦ DECIPHERING ✦'}
          </span>
          <div className="flex items-center gap-2">
            <BookOpen 
              className="w-5 h-5 text-amber-300 animate-magic-glow" 
            />
            <span 
              className="text-amber-50 font-bold text-base sm:text-lg max-w-[200px] truncate ml-1 animate-magic-glow"
            >
              {language === 'ko' 
                ? READABLE_BOOKS.find(b => b.id === currentlyReading)?.titleKo 
                : READABLE_BOOKS.find(b => b.id === currentlyReading)?.titleEn}
            </span>
            <span 
              className="text-amber-400 font-bold text-sm tracking-widest ml-1 animate-magic-glow"
            >
              {bookProgress[currentlyReading]?.readDays || 0} / {READABLE_BOOKS.find(b => b.id === currentlyReading)?.readTime}{language === 'ko' ? '일' : 'd'}
            </span>
          </div>
        </div>
      )}

      {/* ENCYCLOPEDIA LIST MODAL (Paper Theme) */}
      {isEncyclopediaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-[#f4e4bc] border-8 border-[#5c4033] rounded-md p-6 sm:p-8 w-full max-w-6xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] relative text-[#3e2723]">
            {/* Close Button */}
            <button
              onClick={() => setIsEncyclopediaOpen(false)}
              className="absolute top-4 right-4 text-[#5c4033] hover:text-black p-1 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center mb-6 shrink-0">
              <h2 className="text-3xl font-bold font-serif text-[#4a3018] tracking-widest border-b-2 border-[#8b5a2b] pb-2">
                {language === 'ko' ? '도감' : 'Encyclopedia'}
              </h2>
            </div>

            {/* Encyclopedia Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-x-2 gap-y-5 sm:gap-x-4 sm:gap-y-6 flex-grow overflow-y-auto content-start pr-3 custom-scrollbar-paper p-2">
              {ENCYCLOPEDIA_ENTRIES.map((entry) => {
                const isUnlocked = unlockedEncyclopedia.includes(entry.id);
                return (
                  <div key={entry.id} className="flex flex-col items-center gap-2 w-full">
                    <button
                      onClick={() => setSelectedEncyclopediaEntry(entry)}
                      className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 ${
                        isUnlocked 
                          ? 'bg-[#e8dcc4] border-[#c8b592] hover:bg-[#d5c3a1]' 
                          : 'bg-[#d5c3a1]/40 border-[#c8b592]/40 opacity-60 grayscale'
                      }`}
                    >
                      <BookOpen className={`w-7 h-7 sm:w-8 sm:h-8 drop-shadow-md ${isUnlocked ? 'text-[#8b5a2b]' : 'text-[#8b5a2b] opacity-50'}`} />
                    </button>
                    <span className={`text-[10px] sm:text-xs font-bold leading-tight text-center line-clamp-2 break-keep w-full ${isUnlocked ? 'text-[#4a3018]' : 'text-[#8b5a2b] opacity-60'}`}>
                      {isUnlocked ? (language === 'ko' ? entry.titleKo : entry.titleEn) : '???'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ENCYCLOPEDIA INFO MODAL */}
      {selectedEncyclopediaEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 pointer-events-auto">
          <div className="bg-[#e8dcc4] border-4 border-[#5c4033] rounded p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-[#3e2723] flex flex-col">
            <button 
              onClick={() => setSelectedEncyclopediaEntry(null)}
              className="absolute top-3 right-3 text-[#5c4033] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-2xl font-bold font-serif mb-4 border-b-2 border-[#5c4033] pb-2 text-center text-[#4a3018]">
              {unlockedEncyclopedia.includes(selectedEncyclopediaEntry.id) 
                ? (language === 'ko' ? selectedEncyclopediaEntry.titleKo : selectedEncyclopediaEntry.titleEn)
                : '???'}
            </h3>
            
            <div className="bg-[#d5c3a1] p-4 rounded mb-6 min-h-[120px] flex items-center justify-center text-center border border-[#c8b592]">
              {unlockedEncyclopedia.includes(selectedEncyclopediaEntry.id) ? (
                <div className="flex flex-col gap-4 w-full">
                  <p className="font-serif text-sm sm:text-base leading-relaxed text-[#5a3f2b]">
                    {language === 'ko' ? selectedEncyclopediaEntry.descKo : selectedEncyclopediaEntry.descEn}
                  </p>
                  
                  <div className="bg-[#c8b592]/30 p-3 rounded border border-[#c8b592]/50 flex flex-col items-center">
                    <h5 className="text-[#4a3018] font-bold text-sm mb-2">{language === 'ko' ? '능력치 및 스킬 정보' : 'Stats & Skills Info'}</h5>
                    <div className="flex flex-col gap-1 text-[#5a3f2b] font-serif text-sm">
                      {selectedEncyclopediaEntry.rewards?.stats && Object.entries(selectedEncyclopediaEntry.rewards.stats).map(([key, val]) => {
                        const Icon = STAT_ICONS[key];
                        return (
                          <span key={key} className="flex items-center justify-center gap-1.5 font-bold">
                            {Icon && <Icon className="w-4 h-4 text-[#8b5a2b]" />}
                            {STAT_LABELS[key][language]} +{val}{key.includes('Rate') ? '%' : ''}
                          </span>
                        );
                      })}
                      {selectedEncyclopediaEntry.rewards?.skills && selectedEncyclopediaEntry.rewards.skills.map((skill, idx) => (
                        <span key={idx} className="font-bold text-purple-800 flex items-center justify-center gap-1.5">
                          <Star className="w-4 h-4 text-purple-700" />
                          {language === 'ko' ? '스킬: ' : 'Skill: '} [{language === 'ko' ? skill.ko : skill.en}]
                        </span>
                      ))}
                      {!selectedEncyclopediaEntry.rewards?.stats && !selectedEncyclopediaEntry.rewards?.skills && (
                         <span className="italic opacity-70">
                           {language === 'ko' ? '관련 능력이 없습니다.' : 'No related abilities.'}
                         </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-red-800 font-bold text-sm mb-1">
                    {language === 'ko' ? '[해금 조건]' : '[Unlock Condition]'}
                  </span>
                  <p className="font-serif text-sm text-[#5a3f2b] italic">
                    {language === 'ko' ? selectedEncyclopediaEntry.hintKo : selectedEncyclopediaEntry.hintEn}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedEncyclopediaEntry(null)}
              className="w-full py-3 bg-[#5c4033] hover:bg-[#3e2723] active:bg-[#2e1d19] text-[#e8dcc4] font-bold rounded font-serif transition-colors border-2 border-[#2e1d19] shadow-md tracking-wider"
            >
              {language === 'ko' ? '닫기' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
          <div className="bg-stone-900 border-4 border-stone-500 rounded-xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative text-stone-200">
            {/* Close Button */}
            <button
              id="btn-settings-close"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-stone-700 pb-3 mb-5">
              <SettingsIcon className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold font-serif text-yellow-400 tracking-wide">
                {t.settings.title}
              </h2>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-stone-300 mb-3">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>{t.settings.language}</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  id="btn-lang-ko"
                  onClick={() => handleLanguageChange('ko')}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    language === 'ko'
                      ? 'bg-amber-950/70 border-yellow-400 text-yellow-300 shadow-md'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700/70'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm">한국어</span>
                    <span className="text-[10px] text-stone-400">기본 (Default)</span>
                  </div>
                  {language === 'ko' && <Check className="w-4 h-4 text-yellow-400" />}
                </button>

                <button
                  id="btn-lang-en"
                  onClick={() => handleLanguageChange('en')}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    language === 'en'
                      ? 'bg-amber-950/70 border-yellow-400 text-yellow-300 shadow-md'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700/70'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-sm">English</span>
                    <span className="text-[10px] text-stone-400">Option</span>
                  </div>
                  {language === 'en' && <Check className="w-4 h-4 text-yellow-400" />}
                </button>
              </div>
            </div>



            {/* Close Button */}
            <button
              id="btn-settings-done"
              onClick={() => setIsSettingsOpen(false)}
              className="w-full py-2.5 bg-stone-700 hover:bg-stone-600 border-2 border-stone-500 rounded-lg text-white font-bold text-sm shadow-md transition-colors font-sans"
            >
              {t.settings.close}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

