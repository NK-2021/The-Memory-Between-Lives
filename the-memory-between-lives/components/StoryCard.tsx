
import React from 'react';
import { Story } from '../types';
import { Play, Video, Clock } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onSelect: (id: string) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onSelect }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-violet-500 transition-all duration-300 group">
      <div 
        className="aspect-[16/9] w-full bg-cover bg-center cursor-pointer overflow-hidden"
        style={{ backgroundImage: `url(${story.scenes[0].imgUrl})` }}
        onClick={() => onSelect(story.id)}
      >
        <div className="w-full h-full bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
           <Play className="text-white w-12 h-12 fill-white" />
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-violet-400 bg-violet-400/10 px-2 py-1 rounded">
            {story.category}
          </span>
          <div className="flex items-center text-slate-400 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {story.durationMin} min
          </div>
        </div>
        
        <h3 className="font-serif text-xl mb-4 group-hover:text-violet-300 transition-colors">
          {story.title}
        </h3>
        
        <div className="flex gap-3">
          <button 
            onClick={() => onSelect(story.id)}
            className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium py-2.5 rounded-xl transition-colors shadow-lg shadow-violet-900/20"
          >
            <Play className="w-4 h-4 fill-current" />
            Listen
          </button>
          <a 
            href={story.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl transition-colors"
            title="Watch Video"
          >
            <Video className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
