import React from 'react';
import { HeroProps } from '../types';

const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full select-none">
      <div className="flex flex-col items-center animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-4">
          {title}
        </h1>
        <p className="text-gray-500 text-sm md:text-base font-light tracking-widest lowercase opacity-80">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default Hero;