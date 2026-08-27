import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw,
  Sparkles, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from '../layout/BrandLogo';

export const VideoPlayerSection: React.FC = () => {
  const { navigate } = useShop();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Try autoplay on mount
    video.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });

    const updateProgress = () => {
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        setProgress(percent);

        const curMins = Math.floor(video.currentTime / 60);
        const curSecs = Math.floor(video.currentTime % 60);
        setCurrentTime(`${curMins}:${curSecs < 10 ? '0' : ''}${curSecs}`);

        const durMins = Math.floor(video.duration / 60);
        const durSecs = Math.floor(video.duration % 60);
        setDuration(`${durMins}:${durSecs < 10 ? '0' : ''}${durSecs}`);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('district38-video-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="bg-neutral-950 text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-neutral-800">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">
              Store Film & Sizing Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Inside District 38 Trichy
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl font-normal leading-relaxed">
              A look inside our flagship store on Salai Road — featuring our physical posture fitting rig, intercom sound studio, and certified riding gear collection.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => navigate('/contact')}
              className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors flex items-center space-x-2"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Store Location & Hours</span>
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center space-x-1.5"
            >
              <span>Shop All Gear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video Player Stage */}
        <div 
          id="district38-video-container"
          className="relative w-full rounded-xl overflow-hidden bg-black border border-neutral-800 group"
        >
          <video
            ref={videoRef}
            src="/district35intro.mp4"
            className="w-full aspect-video sm:aspect-[21/9] lg:aspect-[2.4/1] object-cover cursor-pointer"
            autoPlay
            muted
            loop
            playsInline
            onClick={togglePlay}
          />

          {/* Top Overlay Branding */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
            <div className="px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 flex items-center space-x-2 pointer-events-auto">
              <BrandLogo size="sm" variant="dark" />
            </div>

            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-300 pointer-events-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authorised Riding Gear Destination</span>
            </div>
          </div>

          {/* Center Play Button on Pause */}
          {!isPlaying && (
            <div 
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-20"
            >
              <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform pl-0.5">
                <Play className="w-7 h-7 fill-white" />
              </div>
            </div>
          )}

          {/* Bottom Player Control Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-5 z-20 transition-opacity duration-300">
            {/* Progress Scrub Bar */}
            <div className="relative mb-2.5 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-1.5 transition-all"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                </button>

                {/* Restart */}
                <button
                  onClick={handleRestart}
                  className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-neutral-300 hover:text-white"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Audio Mute/Unmute */}
                <button
                  onClick={toggleMute}
                  className={`px-2.5 py-1.5 rounded-md transition-colors flex items-center space-x-1.5 text-xs font-semibold ${
                    isMuted 
                      ? 'bg-white/10 hover:bg-white/20 text-neutral-300' 
                      : 'bg-orange-600 hover:bg-orange-500 text-white'
                  }`}
                  aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                      <span className="hidden sm:inline text-xs">Unmute Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                      <span className="hidden sm:inline text-xs">Audio On</span>
                    </>
                  )}
                </button>

                {/* Time Display */}
                <div className="text-xs font-normal text-neutral-400">
                  <span>{currentTime}</span> / <span>{duration}</span>
                </div>
              </div>

              {/* Right Side: Fullscreen */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-neutral-300 hover:text-white"
                  aria-label="Toggle fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Store overview bar beneath video */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-neutral-800 text-xs text-neutral-300">
          <div>
            <span className="font-semibold text-white">Physical Posture Rig:</span>
            <span className="text-neutral-400 ml-1.5">Test riding tuck, helmet aerodynamics, and visor sightlines before you buy.</span>
          </div>
          <div>
            <span className="font-semibold text-white">Laser Head Sizing:</span>
            <span className="text-neutral-400 ml-1.5">Free in-store head measurement for intermediate oval and round oval helmet shells.</span>
          </div>
          <div>
            <span className="font-semibold text-white">Direct Brand Warranties:</span>
            <span className="text-neutral-400 ml-1.5">Official dealer warranties on MT Helmets, Axor, Rynox, Royal Enfield, and Motul.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
