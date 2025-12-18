
import React, { useState } from 'react';
import { STORIES } from './constants';
import Home from './components/Home';
import Player from './components/Player';
import { AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const handleSelectStory = (id: string) => {
    setSelectedStoryId(id);
    setView('player');
    // Smooth scroll to top when changing view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('home');
    setSelectedStoryId(null);
  };

  const currentStory = STORIES.find(s => s.id === selectedStoryId);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 selection:bg-violet-500/30">
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10">
        {view === 'home' && (
          <Home 
            stories={STORIES} 
            onSelectStory={handleSelectStory} 
          />
        )}
        
        {view === 'player' && currentStory && (
          <Player 
            story={currentStory} 
            onBack={handleBack} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
