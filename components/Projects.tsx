
import React from 'react';
import { Project } from '../types';

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      title: "hrittick-web",
      description: "A personal portfolio website built with React and TypeScript, featuring custom animations and a dark mode toggle. Optimized for performance and accessibility.",
      tech: ["React", "TypeScript"],
      githubUrl: "https://github.com/hrittm/hrittick-web",
      liveUrl: "https://hrittm.vercel.app",
      isFeatured: true
    },
    {
      title: "EdVault",
      description: "[ON PROGRESS] An open-source educational platform that leverages AI to provide personalized learning experiences, interactive content, and real-time feedback for students and educators.",
      tech: ["Python", "Typescript", "React", "FastAPI", "TensorFlow"],
      githubUrl: "https://github.com/hrittm/edvault",
      liveUrl: "https://hrittm.github.io/edvault",
      isFeatured: false
    },
    {
      title: "Dotfiles",
      description: "[ON PROGRESS] A comprehensive collection of configuration files and scripts to set up a personalized development environment across multiple operating systems, focusing on productivity and efficiency.",
      tech: ["Shell", "Vim", "Tmux", "Git", "Zsh", "Lua", "Fish"],
      githubUrl: "https://github.com/hrittm/dotfiles",
      isFeatured: false
    },
    {
      title: "// Coming Soon",
      description: "A new project that is currently under development. Stay tuned for more details!",
      tech: ["Details Coming Soon"  ],
      githubUrl: "#",
      isFeatured: false
    }
  ];

  return (
    <section 
      id="projects" 
      className="relative z-10 min-h-screen px-6 py-24 md:px-12 lg:px-24 max-w-7xl mx-auto"
    >
      <div className="space-y-12 animate-fade-in-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            Selected Works.
          </h2>
          <p className="text-gray-500 max-w-xl text-lg font-light">
            A collection of experiments, side projects, and professional work focusing on performance and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="group relative border border-white/10 bg-black/40 backdrop-blur-sm p-8 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Subtle hover background glow */}
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    {project.isFeatured && (
                      <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                        Featured
                      </span>
                    )}
                    <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="flex gap-4">
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-white transition-colors p-1"
                      aria-label="GitHub Repository"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors p-1"
                        aria-label="Live Demo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 font-light leading-relaxed mb-8">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t) => (
                  <span 
                    key={t} 
                    className="text-[11px] font-mono text-gray-500 border border-white/5 px-2 py-1 rounded bg-white/5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
