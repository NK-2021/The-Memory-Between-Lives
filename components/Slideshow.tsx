
import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from '../types';

interface SlideshowProps {
  scenes: Scene[];
  currentTime: number;        // from audio
  duration: number;           // from audio
  onSelectScene?: (index: number) => void; // dot click callback
}

const Slideshow: React.FC<SlideshowProps> = ({ scenes, currentTime, duration, onSelectScene }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % scenes.length);
  }, [scenes.length]);

  // useEffect(() => {
  //   let interval: ReturnType<typeof setInterval> | null = null;
    
  //   if (isPlaying) {
  //     interval = setInterval(nextSlide, intervalMs);
  //   }
    
  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isPlaying, intervalMs, nextSlide]);

  useEffect(() => {
  if (!duration || scenes.length === 0) return;

  const segment = duration / scenes.length;
  const idx = Math.min(scenes.length - 1, Math.floor(currentTime / segment));

  setCurrentIndex(idx);
}, [currentTime, duration, scenes.length]);

  return (
    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-700">
      {scenes.map((scene, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={scene.imgUrl} 
            alt={`Scene ${index + 1}`} 
            className="w-full h-full object-cover transform scale-105"
            //style={{ filter: 'brightness(0.8)' }}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",   // fills the frame (best look)
                borderRadius: 16
              }}
          />
        </div>
      ))}
      
      {/* Progress Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/30 backdrop-blur-md rounded-full">
        {scenes.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onSelectScene?.(index)}
                aria-label={`Go to scene ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'w-4 bg-violet-400' : 'w-1 bg-white/40'
                }`}/>
          /*<div 
            key={index} 
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex ? 'w-4 bg-violet-400' : 'w-1 bg-white/40'
            }`}
          />*/
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
