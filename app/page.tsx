'use client';

import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import portfolioData from './portfolio-data.json';

const DoodleArrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`w-24 h-24 pointer-events-none ${className}`}>
    <motion.path
      d="M20,50 Q50,20 80,50"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    <motion.path
      d="M70,40 L80,50 L75,65"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.8 }}
    />
  </svg>
);

const DoodleCircle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 100" className={`absolute pointer-events-none ${className}`}>
    <motion.path
      d="M10,50 Q50,5 100,50 T190,50"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </svg>
);

const DoodleUnderline = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 20" className={`absolute pointer-events-none ${className}`}>
    <motion.path
      d="M5,15 Q50,5 100,15 T195,10"
      fill="transparent"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    />
  </svg>
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track mouse position for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      rootMargin: '0px 0px -70% 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ['home', 'about', 'certificates', 'projects', 'contact'];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedProject !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);
  const { certificates, projects } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative">
      <div className="bg-noise" />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber-600 origin-left z-50"
        style={{ scaleX }}
      />
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md z-40 border-b border-amber-100"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              <span className="text-amber-600">Arga</span> Adinata
            </motion.div>

            {/* Navigation Links */}
            <motion.ul
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center gap-8"
            >
              {['home', 'about', 'certificates', 'projects', 'contact'].map((section) => (
                <li key={section}>
                  <a 
                    href={`#${section}`} 
                    className="text-gray-800 hover:text-gray-900 transition-colors font-semibold capitalize relative inline-block py-1 px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {activeSection === section && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-yellow-300/60 -z-10 rounded-md"
                        style={{
                          boxShadow: '0 2px 8px rgba(253, 224, 71, 0.4)'
                        }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {section}
                  </a>
                </li>
              ))}
            </motion.ul>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50 relative"
            >
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-900 block origin-center"
              ></motion.span>
              <motion.span 
                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-gray-900 block origin-center"
              ></motion.span>
              <motion.span 
                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-gray-900 block origin-center"
              ></motion.span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-4 right-4 bg-[#fdfbf7] z-50 rounded-2xl shadow-2xl border border-gray-200 p-8 md:hidden"
            >
              <ul className="flex flex-col items-center gap-6">
              {['home', 'about', 'certificates', 'projects', 'contact'].map((section) => (
                <li key={section}>
                  <a 
                    href={`#${section}`} 
                    className="text-3xl font-bold text-gray-800 capitalize hover:text-amber-600 transition-colors"
                    style={{ fontFamily: 'Georgia, serif' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {section}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Paper Container */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen bg-white" 
        style={{
          backgroundImage: 'linear-gradient(to bottom, #fafafa 0%, #ffffff 100%)'
        }}
      >
        
        {/* Hero Section */}
        <motion.section 
          id="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative px-8 sm:px-12 lg:px-16 py-20 border-b-2 border-dashed border-amber-200 min-h-screen flex flex-col md:flex-row items-center justify-center md:gap-12 lg:gap-20 overflow-hidden"
        >
          {/* Profile Photo - Simple Polaroid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.5 },
              scale: { duration: 0.8, delay: 0.5, type: "spring" },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-48 sm:w-56 lg:w-72 mx-auto md:mx-0 mb-8 md:mb-0 z-10 md:order-last flex-shrink-0"
          >
            {/* Hover Wrapper */}
            <motion.div
              whileHover={{ 
                scale: 1.1,
                y: -25,
                rotate: 0
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-pointer"
            >
              {/* Polaroid Frame */}
              <div className="bg-white p-4 shadow-2xl transform rotate-3">
                <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden relative group">
                  <span className="text-gray-500 text-sm text-center group-hover:scale-110 transition-transform duration-500">Your Photo</span>
                  <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay"></div>
                </div>
                <div className="text-center mt-3 pb-2">
                  <p className="text-sm text-gray-600 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Arga Adinata</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="max-w-3xl relative z-20 md:mt-0 md:order-first"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                }
              }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight relative" 
              style={{
              fontFamily: 'Georgia, serif',
              textShadow: '2px 2px 0px rgba(251, 191, 36, 0.1)'
            }}>
              Hello, I'm <span className="text-amber-600 relative inline-block">
                Arga Adinata
                <DoodleCircle className="w-[120%] h-[120%] -top-[10%] -left-[10%] text-amber-400 opacity-60" />
              </span>
            </motion.h1>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                }
              }}
              className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed relative inline-block" 
              style={{
              fontFamily: 'Georgia, serif'
            }}>
              A passionate <span className="font-semibold text-amber-700">Full-Stack Developer</span> crafting beautiful and functional web experiences
            </motion.p>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                }
              }}
              className="text-lg text-gray-600 leading-relaxed max-w-2xl" 
              style={{
              fontFamily: 'Georgia, serif'
            }}>
              I specialize in building modern web applications with clean code and intuitive designs. 
              Let's create something amazing together.
            </motion.p>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }
                }
              }}
              className="mt-10 flex gap-4 flex-wrap"
            >
              <motion.button 
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 20px -5px rgba(217, 119, 6, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 transition-all shadow-md"
              >
                View Project
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-white text-amber-700 font-semibold rounded border-2 border-amber-600 hover:bg-amber-50 transition-all shadow-md"
              >
                Contact Me
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="px-8 sm:px-12 lg:px-16 py-16 border-b-2 border-dashed border-amber-200 bg-gradient-to-b from-amber-50/30 to-transparent"
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 relative inline-block" 
              style={{ fontFamily: 'Georgia, serif' }}
            >
              About Me
              <DoodleUnderline className="w-full h-4 -bottom-2 left-0 text-amber-400 opacity-70" />
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="space-y-4"
              >
                <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  I'm a passionate developer with a love for creating beautiful, functional web experiences. 
                  Currently focusing on modern web technologies, I've worked on diverse projects ranging 
                  from educational platforms to interactive web applications.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  My approach combines technical expertise with creative problem-solving, always keeping 
                  the user experience at the forefront of every decision.
                </p>
              </motion.div>
              
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                }}
                className="space-y-4"
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-amber-700 mb-2">🎯 What I Do</h3>
                  <p className="text-gray-600">Full-stack development, UI/UX design, and turning ideas into reality</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-amber-700 mb-2">💼 Experience</h3>
                  <p className="text-gray-600">Building modern web applications with passion</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-amber-700 mb-2">🚀 Mission</h3>
                  <p className="text-gray-600">Creating impactful digital solutions that make a difference</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Certificates Section */}
        <motion.section 
          id="certificates"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="px-8 sm:px-12 lg:px-16 py-16 border-b-2 border-dashed border-amber-200"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 relative inline-block" style={{
              fontFamily: 'Georgia, serif'
            }}>
              Certificates
              <DoodleUnderline className="w-full h-4 -bottom-2 left-0 text-amber-400 opacity-70" />
            </h2>
            <p className="text-lg text-gray-600 mb-12" style={{
              fontFamily: 'Georgia, serif'
            }}>
              My professional achievements and continuous learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {certificates.map((cert, index) => (
              <motion.div 
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="cursor-pointer w-full group relative"
                onClick={() => setSelectedCert(selectedCert === index ? null : index)}
              >
                {/* Tape effect */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-yellow-100/80 rotate-1 shadow-sm z-30 backdrop-blur-[1px]" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)' }}></div>

                <motion.div 
                  layout 
                  className={`bg-[#fffdf5] p-6 shadow-md hover:shadow-lg transition-all duration-300 relative ${selectedCert === index ? 'rotate-0 scale-100 z-20' : 'rotate-1 hover:rotate-0'}`}
                  style={{
                    boxShadow: '2px 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Paper Texture Overlay */}
                  <div className="absolute inset-0 opacity-30 pointer-events-none" 
                       style={{ 
                         backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.15\'/%3E%3C/svg%3E")' 
                       }}>
                  </div>

                  <div className="flex justify-between items-start gap-4 relative z-10">
                    <div>
                      <h3 className="font-bold text-xl text-gray-800 leading-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                        {cert.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">{cert.issuer} • {cert.year}</p>
                    </div>
                    <motion.div 
                      animate={{ rotate: selectedCert === index ? 180 : 0 }}
                      className="text-amber-600 flex-shrink-0 mt-1"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {selectedCert === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="relative z-10"
                      >
                        <div className="bg-white p-2 shadow-inner border border-gray-100 rotate-1">
                          <img 
                            src={cert.image} 
                            alt={cert.title} 
                            className="w-full h-auto"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section 
          id="projects"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10% 0px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="px-8 sm:px-12 lg:px-16 py-16 pb-20 border-b-2 border-dashed border-amber-200"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 relative inline-block" style={{
              fontFamily: 'Georgia, serif'
            }}>
              Featured Projects
              <DoodleUnderline className="w-full h-4 -bottom-2 left-0 text-amber-400 opacity-70" />
            </h2>
            <p className="text-lg text-gray-600 mb-12" style={{
              fontFamily: 'Georgia, serif'
            }}>
              A collection of my recent work and personal projects
            </p>
          </motion.div>

          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.8, ease: "easeOut" }
                  }
                }}
                className="group"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Polaroid Image */}
                  <motion.div 
                    initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
                    whileInView={{ 
                      opacity: 1, 
                      rotate: index % 2 === 0 ? 2 : -2,
                      scale: 1
                    }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                    className="polaroid flex-shrink-0 w-full lg:w-80"
                    style={{
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="bg-white p-4 shadow-lg group-hover:shadow-2xl transition-shadow">
                      <div className="w-full aspect-video bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Project Screenshot</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Project Details */}
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex-1 space-y-4"
                  >
                    <h3 className="text-3xl font-bold text-gray-900" style={{
                      fontFamily: 'Georgia, serif'
                    }}>
                      {project.title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed" style={{
                      fontFamily: 'Georgia, serif'
                    }}>
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setSelectedProject(index)}
                      className="mt-4 text-amber-700 font-semibold hover:text-amber-800 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      View Project →
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section - Social Links */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="px-8 sm:px-12 lg:px-16 py-20 bg-gradient-to-b from-transparent to-amber-50/30"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Let's Connect
            </h2>
            <p className="text-lg text-gray-600 mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              Feel free to reach out through any of these platforms
            </p>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Email */}
              <motion.a
                href="mailto:argaadinataathallahp@mail.ugm.ac.id"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ y: -8, scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-6 rounded-lg shadow-md group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 ease-out text-amber-700">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm break-all">argaadinataathallahp@mail.ugm.ac.id</p>
              </motion.a>

              {/* LinkedIn */}
              <motion.a
                href="https://linkedin.com/in/argaadinata"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-6 rounded-lg shadow-md group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 ease-out text-amber-700">
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">LinkedIn</h3>
                <p className="text-gray-600 text-sm">Arga Adinata</p>
              </motion.a>

              {/* GitHub */}
              <motion.a
                href="https://github.com/ArgaAdinata"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                whileHover={{ y: -8, scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-6 rounded-lg shadow-md group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 ease-out text-amber-700">
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">GitHub</h3>
                <p className="text-gray-600 text-sm">@ArgaAdinata</p>
              </motion.a>

              {/* Instagram */}
              <motion.a
                href="https://www.instagram.com/adinata_arga/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                whileHover={{ y: -8, scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="bg-white p-6 rounded-lg shadow-md group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 ease-out text-amber-700">
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Instagram</h3>
                <p className="text-gray-600 text-sm">@adinata_arga</p>
              </motion.a>
            </div>
          </div>
        </motion.section>

        {/* Paper edge effect at bottom */}
        <div className="h-4 bg-gradient-to-b from-transparent to-gray-100"></div>
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            style={{ cursor: 'pointer' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative notebook-paper"
              style={{
                cursor: 'default'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="sticky top-4 float-right mr-4 w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors z-10 shadow-lg"
              >
                <svg className="w-6 h-6 text-red-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Content */}
              <div className="pr-8 py-8">
                {/* Project Image */}
                <div className="w-full aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Project Screenshot</span>
                </div>

                {/* Project Title */}
                <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {projects[selectedProject].title}
                </h2>

                {/* Roles */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {projects[selectedProject].roles.map((role, index) => (
                    <span 
                      key={index}
                      className="text-amber-700 font-semibold text-lg"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {role}{index < projects[selectedProject].roles.length - 1 ? " • " : ""}
                    </span>
                  ))}
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {projects[selectedProject].technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex}
                      className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Description */}
                <div className="space-y-4 text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                  <h3 className="text-2xl font-semibold text-gray-900">About This Project</h3>
                  <p className="text-lg leading-relaxed">
                    {projects[selectedProject].description}
                  </p>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 pt-4">Key Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {projects[selectedProject].features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    )) || (
                      <>
                        <li>Responsive design for all devices</li>
                        <li>Modern and intuitive user interface</li>
                        <li>Fast performance and optimization</li>
                        <li>Clean and maintainable code structure</li>
                      </>
                    )}
                  </ul>

                  <h3 className="text-2xl font-semibold text-gray-900 pt-4">Challenges & Solutions</h3>
                  <p className="text-lg leading-relaxed">
                    {projects[selectedProject].challenges || "This project presented unique challenges in terms of scalability and user experience. Through careful planning and implementation, we created a solution that balances functionality with elegant design."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
