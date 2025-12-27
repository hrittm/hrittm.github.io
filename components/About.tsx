import React from 'react';

const About: React.FC = () => {
  const technologies = [
    "Python",
    "C",
    "CSS",
    "HTML",
    "TypeScript",
    "React",
    "JavaScript",
    "Vercel",
    "Git",
    "Linux",
    "Bash",
    "SQL",
    "AWS",
  ];

  return (
    <section 
      id="about" 
      className="relative z-10 min-h-screen flex items-center justify-center px-6 py-24 md:px-12 lg:px-24 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center animate-fade-in-up delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        {/* Left Column: Bio */}
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">
            About Me.
          </h2>
          
          <div className="space-y-6 text-base md:text-lg text-gray-400 font-light leading-relaxed">
            <p> 
              I'm a high school student passionate about problem solving that blends <span className="text-white font-medium">mathematics</span> and <span className="text-white font-medium">computer science</span>.
            </p>
            <p> 
              I'm a fan of the splendid elegance of math and CS. I want to leverage this synergy to build impactful software that can make a difference. 
              I desire to continuously achieve greater application of computer as an artistic instrument. Demystifying artistic endeavors provides immense joy and satisfaction.
            </p>
            <p> 
              When I'm not coding or studying, you can find me exploring the nature, texting with my chatmate, or fighting with boredom and loneliness.
            </p>
          </div>

          <div className="pt-4">
             <a href="mailto:thathrimondal@gmail.com" className="inline-flex items-center text-white border-b border-white pb-1 hover:opacity-70 transition-opacity group">
                Let's Connect
                <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
             </a>
          </div>
        </div>

        {/* Right Column: Skills & Visual */}
        <div className="relative group">
            {/* Decorative background element with hover animation */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-10 rounded-2xl space-y-8 hover:border-white/20 transition-colors duration-300">
                <div>
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-6">
                        Tech Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                        <span 
                            key={tech} 
                            className="px-3 py-1.5 text-xs md:text-sm border border-white/5 bg-white/5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default select-none"
                        >
                            {tech}
                        </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
                        Hobbies
                    </h3>
                    <ul className="space-y-4">
                        {[
                          { name: "Problem Solving", color: "bg-blue-400" },
                          { name: "Listening to Music", color: "bg-purple-400" },
                          { name: "Photography", color: "bg-green-400" }
                        ].map((item, i) => (
                          <li key={i} className="flex items-center text-sm md:text-base text-gray-300 group/item">
                              <span className={`w-1.5 h-1.5 ${item.color} rounded-full mr-3 shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover/item:scale-150 transition-transform duration-300`}></span>
                              <span className="group-hover/item:text-white transition-colors duration-300">{item.name}</span>
                          </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default About;