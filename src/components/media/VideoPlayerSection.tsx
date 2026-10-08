import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  MapPin,
  ArrowRight
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
  const [hasError, setHasError] = useState(false);

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
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <section className="w-full">
      {/* Full-Screen Video Stage */}
      <div
        id="district38-video-container"
        className="relative w-full h-[85vh] min-h-[480px] max-h-[900px] overflow-hidden bg-black group"
      >
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-500 bg-neutral-900">
            <img src="/brand/logodt38.webp" alt="District 38" className="h-8 w-auto object-contain opacity-60" />
            <span className="text-xs font-medium">Store film is temporarily unavailable</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            src="/media/district35intro.mp4"
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            autoPlay
            muted
            loop
            playsInline
            onClick={togglePlay}
            onError={() => setHasError(true)}
          />
        )}

        {/* Legibility Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none" />

        {/* Top Overlay Branding */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-20">
          <div className="px-3 py-1.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 flex items-center space-x-2">
            <BrandLogo size="sm" variant="dark" />
          </div>
        </div>

        {/* Centered Section Copy Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10 pointer-events-none">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
            Store Film &amp; Sizing Studio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-2xl">
            Inside District 38
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-xl leading-relaxed">
            A look inside our flagship store — featuring our physical posture fitting rig, intercom sound studio, and certified riding gear collection.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6 pointer-events-auto">
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors flex items-center gap-2"
            >
              <span>Shop All Gear</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-md border border-white/25 hover:border-white/50 hover:bg-white/5 text-white font-bold text-xs sm:text-sm tracking-wide uppercase transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Store Location &amp; Hours</span>
            </button>
          </div>
        </div>

        {/* Center Play Button on Pause */}
        {!hasError && !isPlaying && (
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
        {!hasError && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 sm:p-6 z-20 transition-opacity duration-300">
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

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3 sm:space-x-4">
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

                <button
                  onClick={handleRestart}
                  className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-neutral-300 hover:text-white"
                  aria-label="Restart video"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

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

                <div className="text-xs font-normal text-neutral-400">
                  <span>{currentTime}</span> / <span>{duration}</span>
                </div>
              </div>

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
        )}
      </div>

      {/* Store overview bar beneath the full-screen video */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-b border-neutral-200 text-xs text-neutral-600">
          <div>
            <span className="font-bold text-neutral-900">Physical Posture Rig:</span>
            <span className="ml-1.5">Test riding tuck, helmet aerodynamics, and visor sightlines before you buy.</span>
          </div>
          <div>
            <span className="font-bold text-neutral-900">Laser Head Sizing:</span>
            <span className="ml-1.5">Free in-store head measurement for intermediate oval and round oval helmet shells.</span>
          </div>
          <div>
            <span className="font-bold text-neutral-900">Direct Brand Warranties:</span>
            <span className="ml-1.5">Official dealer warranties on MT Helmets, Axor, Rynox, Royal Enfield, and Motul.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
