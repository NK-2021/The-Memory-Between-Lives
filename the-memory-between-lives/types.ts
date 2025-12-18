
export interface Scene {
  imgUrl: string;
}

export interface Story {
  id: string;
  title: string;
  category: 'Healer' | 'Explorer' | 'Warrior' | 'Scholar' | 'Artisan';
  durationMin: number;
  moral: string;
  disclaimer: string;
  audioUrl: string;
  videoUrl: string;
  scenes: Scene[];
}

export type AppView = 'home' | 'player';
