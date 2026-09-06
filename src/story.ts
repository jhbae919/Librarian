import React from 'react';
import { UIState, DialogueNode, Language } from './types';
import { GameEngine } from './engine';
import { TRANSLATIONS } from './i18n';

export const getStoryEvents = (
  lang: Language,
  state: UIState,
  setState: React.Dispatch<React.SetStateAction<UIState>>,
  engine: GameEngine,
  triggerDialogue?: (id: string) => void
): Record<string, () => DialogueNode[]> => {
  const t = TRANSLATIONS[lang];

  return {
    // --- Prologue / Intro Handover ---
    intro: () => {
      if (lang === 'ko') {
        return [
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '어서 와. 연합군 최고의 교육시설, 중앙 도서관에 온 걸 환영해.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '물론, 네가 기대한 서고 정리나 대출 반납 같은 평화로운 사서 업무는 없어. 이곳은 피난 명령이 떨어진 지 오래거든.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '솔직히 도서관째로 버려두고 전 병력을 철수시킬까도 고민했지. 그런데 마왕군 놈들 중, 이 안의 책을 주워 읽고 걷잡을 수 없이 진화해 버린 개체들이 나타났어.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '불행 중 다행으로 놈들 대부분은 활자보다 인간의 냄새에 더 환장하더군.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '대규모 인원을 이곳으로 보내면 냄새를 맡은 놈들이 미친듯이 기어들어 오겠지.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '그래서 우린 가장 좋은 성적을 거둔 한 명만 이곳으로 파견하기로 했어.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '네 임무는 하루에 몇 놈씩 기어 들어오는 개체들을 조용히 처리하는 것.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '남는 시간엔 푹 쉬든, 책을 읽든 상관없으니 경계만 제대로 해주렴.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '…나는 어디로 가냐고?' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '최전방으로 복귀해야지. 이미 완전히 함락된 여기보다는 후방이겠지만..' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '연합군이 승전보를 울리다 보면, 언젠가 이곳을 탈환하러 올 날이 오겠지. 그때까지 부디 살아남아 줘.' },
          { speaker: '선임 사서', portrait: 'senior_librarian', text: '여력이 닿는 대로 지원을 보내줄테니 말이야.' },

          { speaker: '시스템', portrait: 'system', text: '튜토리얼을 시작합니다.' },
          { speaker: '시스템', portrait: 'system', text: '이곳은 도서관 내부입니다.' },
          { speaker: '시스템', portrait: 'system', text: '이곳에서는 독서를 통해 새로운 능력이나 스킬을 얻을 수 있으며, 하루에 한 권씩만 읽을 수 있습니다.' },
          { speaker: '시스템', portrait: 'system', text: '읽을 책을 선정하고 다음 날로 넘어가면 자동으로 책을 읽을 수 있습니다.' },
          { speaker: '시스템', portrait: 'system', text: '같은 책을 여러 번 완독함으로써 새로운 지식을 얻을 수도 있으며' },
          { speaker: '시스템', portrait: 'system', text: '책에서 배운 스킬을 실전해서 활용함으로써 더 깊이 이해할 수도 있습니다.' },
          { speaker: '시스템', portrait: 'system', text: '도서관에 있는 책들 중에는 아직 지식이 부족해 읽지 못하는 책들은 요구되는 지식을 갖추게 되면 읽을 수 있게 됩니다.' },
          { speaker: '시스템', portrait: 'system', text: '또한 현재 도서관에 존재하지 않는 책들 중에는 전투 혹은 이벤트를 통해 습득할 수 있는 책들도 존재합니다.' },
          { speaker: '시스템', portrait: 'system', text: '다음은 전투입니다.' },
          { speaker: '시스템', portrait: 'system', text: '당신은 해당 일에 침입한 적들을 모두 격파해야 다음 날로 넘어갈 수 있습니다.' },
          { speaker: '시스템', portrait: 'system', text: '전투는 턴제로 이루어지며, 한 턴에 한번 씩 공격 혹은 스킬을 사용할 수 있습니다.' },
          { speaker: '시스템', portrait: 'system', text: '민첩이 더 높은 쪽이 선공을 가져갑니다.' },
          { speaker: '시스템', portrait: 'system', text: '상대의 hp를 0으로 만들면 승리합니다.' },
          { speaker: '시스템', portrait: 'system', text: '해당일의 모든 전투가 끝난 후에는 독서를 할지 휴식을 취할지 선택해야 합니다.' },
          { speaker: '시스템', portrait: 'system', text: '체력과 마나가 여유롭다면 독서를 통해 성장을 도모하고, 그렇지 않다면 휴식을 통해 회복하는 것도 방법입니다.' },
          { speaker: '시스템', portrait: 'system', text: '그럼 건투를 빕니다.' }
        ];
      }
      return [
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'Welcome. Welcome to the Central Library, the greatest educational facility of the Allied Forces.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'Of course, there won\'t be any peaceful librarian duties like organizing shelves or handling returns that you might have expected. An evacuation order was issued for this place a long time ago.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'Honestly, we considered abandoning the library entirely and withdrawing all troops. But among the Demon Lord\'s forces, we found entities that read the books here and evolved uncontrollably.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'Fortunately, most of them are much more crazed by the scent of humans than by printed text.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'If we send a large force here, the ones who catch the scent will swarm in like crazy.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'So we decided to dispatch only one person—the one with the best performance.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'Your mission is to quietly eliminate the few entities that crawl in each day.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'In your spare time, you can rest or read books, it doesn\'t matter. Just make sure you keep a proper watch.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: '...Where am I going, you ask?' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'I must return to the frontline. Though it will be further back than here, since this place has already been completely overrun...' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'As the Allied Forces continue to sound the horn of victory, the day will eventually come when we return to reclaim this place. Until then, please stay alive.' },
        { speaker: 'Senior Librarian', portrait: 'senior_librarian', text: 'I\'ll send support as much as I can afford.' },

        { speaker: 'System', portrait: 'system', text: 'The tutorial will now begin.' },
        { speaker: 'System', portrait: 'system', text: 'You are inside the library.' },
        { speaker: 'System', portrait: 'system', text: 'Here, you can acquire new abilities or skills through reading, but you may only read one book per day.' },
        { speaker: 'System', portrait: 'system', text: 'If you select a book to read and proceed to the next day, you will automatically read it.' },
        { speaker: 'System', portrait: 'system', text: 'By fully reading the same book multiple times, you may gain new knowledge.' },
        { speaker: 'System', portrait: 'system', text: 'You can also deepen your understanding by utilizing the skills learned from books in actual combat.' },
        { speaker: 'System', portrait: 'system', text: 'Among the books in the library, those you cannot read yet due to lacking knowledge will become readable once you meet the requirements.' },
        { speaker: 'System', portrait: 'system', text: 'Furthermore, there are books currently not in the library that can be acquired through combat or events.' },
        { speaker: 'System', portrait: 'system', text: 'Next is combat.' },
        { speaker: 'System', portrait: 'system', text: 'You must defeat all enemies that invade on a given day to proceed to the next day.' },
        { speaker: 'System', portrait: 'system', text: 'Combat is turn-based, and you may attack or use a skill once per turn.' },
        { speaker: 'System', portrait: 'system', text: 'The side with higher agility takes the first strike.' },
        { speaker: 'System', portrait: 'system', text: 'You win by reducing the opponent\'s HP to 0.' },
        { speaker: 'System', portrait: 'system', text: 'After all battles for the day are finished, you must choose whether to read or rest.' },
        { speaker: 'System', portrait: 'system', text: 'If you have sufficient HP and mana, reading promotes growth. Otherwise, resting to recover is also a viable strategy.' },
        { speaker: 'System', portrait: 'system', text: 'Good luck.' }
      ];
    },
  };
};
