
import React from 'react';
import { Story } from '../types';
import StoryCard from './StoryCard';
import { Sparkles } from 'lucide-react';

interface HomeProps {
  stories: Story[];
  onSelectStory: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ stories, onSelectStory }) => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 min-h-screen">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-violet-300">Inner Explorations</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-3 text-slate-100">Past Life Sessions</h1>
        <p className="text-slate-400 text-sm md:text-base font-light max-w-md mx-auto">
          Narrated regression-style stories designed to unlock the mysteries of your soul's journey.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stories.map(story => (
          <StoryCard 
            key={story.id} 
            story={story} 
            onSelect={onSelectStory} 
          />
        ))}
      </div>

      <footer className="mt-20 text-center border-t border-slate-800/50 pt-10">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-loose max-w-xs mx-auto">
          &copy; The Memory Between Lives. All narratives and visual sequences are generated for meditative and entertainment purposes.
        </p>
      </footer>
    </div>
  );
};

export default Home;
