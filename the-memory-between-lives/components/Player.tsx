
import React, { useState, useRef, useEffect } from 'react';
import { Story } from '../types';
import Slideshow from './Slideshow';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  ExternalLink,
  Info,
  AlertCircle
} from 'lucide-react';

interface PlayerProps {
  story: Story;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ story, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setError(null);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsFinished(true);
    };

    const handleError = (e: any) => {
      const audioTag = e.target as HTMLAudioElement;
      let message = "Unable to load audio.";
      
      if (audioTag.error) {
        switch (audioTag.error.code) {
          case 1: message = "Aborted: The fetch was cancelled."; break;
          case 2: message = "Network Error: Please check your connection."; break;
          case 3: message = "Decoding Error: The file format is not supported."; break;
          case 4: message = "Source Error: The URL is invalid or the file is missing."; break;
          default: message = `Audio error: ${audioTag.error.message || 'Unknown error'}`; break;
        }
      }
      
      console.error("Audio playback error details:", audioTag.error);
      setError(message);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Force reload on source change
    setError(null);
    setIsFinished(false);
    audio.load();

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [story.audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsFinished(false);
          setError(null);
        }).catch(e => {
          console.error("Play request failed:", e);
          if (e.name === 'NotAllowedError') {
            setError("Autoplay blocked. Please click play again.");
          } else {
            setError("Unable to start playback. Check the audio source.");
          }
        });
      }
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekValue = parseFloat(e.target.value);
    const seekTime = (seekValue / 100) * duration;
    if (audioRef.current && !isNaN(seekTime)) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen pb-24 px-4 pt-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors flex items-center gap-1 group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Library</span>
        </button>
        <div className="text-right">
          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-violet-400 block mb-0.5">
            {story.category}
          </span>
          <h2 className="font-serif text-lg leading-tight truncate max-w-[200px]">
            {story.title}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Slideshow Area */}
        <Slideshow scenes={story.scenes} isPlaying={isPlaying} />

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Audio Controls */}
        <div className={`bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm transition-opacity ${error ? 'opacity-50' : 'opacity-100'}`}>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-center gap-8">
              <button 
                onClick={() => skip(-15)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Rewind 15 seconds"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              <button 
                onClick={togglePlay}
                className="w-16 h-16 flex items-center justify-center bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-xl shadow-violet-900/40 transition-all active:scale-95 disabled:bg-slate-700"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button 
                onClick={() => skip(15)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Forward 15 seconds"
              >
                <RotateCw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Link */}
        <a 
          href={story.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-violet-500/20 p-2 rounded-lg group-hover:bg-violet-500/30 transition-colors">
              <ExternalLink className="w-5 h-5 text-violet-400" />
            </div>
            // <div className="text-left">
            //   <p className="text-sm font-semibold text-slate-100">Watch Full Video</p>
            //   <p className="text-xs text-slate-400">View cinematic version on External Link</p>
            // </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-slate-500 rotate-180" />
        </a>

        {/* Moral Section - Visible at end or via scroll */}
        <div className={`transition-all duration-1000 transform ${isFinished ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70'}`}>
          <div className="bg-gradient-to-br from-violet-900/20 to-slate-800/40 p-6 rounded-3xl border border-violet-500/20">
            <h3 className="text-violet-400 font-serif italic text-lg mb-3">The Moral of the Session</h3>
            <p className="text-slate-300 leading-relaxed italic">
              &ldquo;{story.moral}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={story.audioUrl} preload="auto" />

      {/* Footer Disclaimer */}
      <div className="mt-12 p-4 border-t border-slate-800">
        <div className="flex gap-3 items-start">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-normal uppercase tracking-wider">
            {story.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Player;
