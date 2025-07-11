"use client";

import Head from "next/head";
import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import CountUp from 'react-countup';
import { motion, useScroll, useTransform } from "framer-motion";
import Aurora from './components/Aurora/Aurora';
import ScrollVelocity from './components/ScrollVelocity/ScrollVelocity';
import ProjectCard from './components/ProjectCard';
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ContactForm from "./components/ContactForm";
import { TypeAnimation } from 'react-type-animation';

// This function will fetch data on the server
async function getProjects() {
  try {
    // Use relative URL for client-side fetching
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl = baseUrl ? `${baseUrl}/api/projects` : '/api/projects';
    
    console.log('🔍 Attempting to fetch from:', apiUrl);
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🔗 Base URL:', baseUrl);
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('📡 Response status:', res.status);
    console.log('📡 Response ok:', res.ok);

    if (!res.ok) {
      console.error('❌ Failed to fetch projects:', res.status, res.statusText);
      console.log('🔄 Using fallback data...');
      return getFallbackProjects();
    }
    
    const data = await res.json();
    console.log('📦 Fetched data:', data);
    
    if (data.success && data.data) {
      console.log('✅ Successfully fetched projects:', data.data.length, 'projects');
      return data.data;
    } else {
      console.error('❌ API returned error:', data.message);
      console.log('🔄 Using fallback data...');
      return getFallbackProjects();
    }
  } catch (error) {
    console.error('💥 Error in getProjects:', error);
    console.log('🔄 Using fallback data due to error...');
    return getFallbackProjects();
  }
}

// Fallback projects data when API is not available
function getFallbackProjects() {
  return [
    {
      _id: 'fallback-1',
      title: 'Portfolio Website',
      description: 'Personal portfolio website built with Next.js, featuring modern design and responsive layout.',
      category: 'Web Development',
      status: 'Completed',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      images: ['/assets/images/hero.jpg'],
      githubUrl: '#',
      liveUrl: '#',
      startDate: '2024-01-01',
      endDate: '2024-01-15'
    },
    {
      _id: 'fallback-2',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce platform with payment integration and admin dashboard.',
      category: 'Web Development',
      status: 'In Progress',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      images: ['/assets/images/hero.jpg'],
      githubUrl: '#',
      liveUrl: '#',
      startDate: '2024-02-01',
      endDate: null
    },
    {
      _id: 'fallback-3',
      title: 'Mobile App Design',
      description: 'UI/UX design for a mobile application with modern interface and user experience.',
      category: 'UI/UX Design',
      status: 'Completed',
      technologies: ['Figma', 'Adobe XD', 'Prototyping'],
      images: ['/assets/images/hero.jpg'],
      githubUrl: '#',
      liveUrl: '#',
      startDate: '2023-12-01',
      endDate: '2023-12-20'
    }
  ];
}

const roles = [
  {
    title: "Web Developer",
    description: `Hai! Saya seorang Web Developer yang suka mengeksplorasi ide-ide baru. Coding bagi saya adalah bentuk kreativitas. Saya siap membangun website yang cepat, modern, dan bermakna.`
  },
  {
    title: "UI/UX Designer",
    description: `Hai, saya seorang UI/UX Designer yang fokus pada menciptakan pengalaman pengguna yang nyaman serta tampilan antarmuka yang intuitif dan fungsional. Saya telah menangani beberapa proyek UI/UX untuk berbagai kebutuhan, mulai dari aplikasi mobile hingga platform berbasis web. Jangan ragu ayo hubungi saya!`
  },
  {
    title: "Graphic Designer",
    description: `Hai, saya juga seorang Graphic Designer yang terbiasa menyusun elemen visual yang kuat, konsisten, dan komunikatif. Dalam setiap desain, saya berupaya menyatukan estetika visual dengan identitas dan nilai brand yang ingin disampaikan. Saya telah terlibat dalam berbagai kebutuhan desain seperti branding, poster, konten sosial media, hingga materi promosi digital.`
  },
  {
    title: "Media Creative",
    description: `Hai, sebagai Media Creative, saya suka bikin konten visual yang nggak cuma menarik dilihat, tapi juga nyambung dengan audiens. Mulai dari video, animasi ringan, sampai materi visual untuk media sosial—saya usahakan semuanya punya cerita dan kesan yang pas. Buat saya, konten yang bagus itu bukan cuma keren, tapi juga nyampe pesannya.`
  }
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  
  // Transform values for text (left side)
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textX = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  
  // Transform values for image and stats (right side)
  const rightContentOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const rightContentX = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
      offset: 100,
      disable: isMobile,
    });
    
    // Refresh AOS when mobile state changes
    setTimeout(() => {
      AOS.refresh();
    }, 100);
    
  }, [isMobile]);

  useEffect(() => {
    // Fetch projects
    const fetchProjects = async () => {
      const projectsData = await getProjects();
      console.log('Projects data in component:', projectsData); // Debug log
      setProjects(projectsData);
    };
    fetchProjects();
  }, []);

  // Get projects to display (3 latest initially, or all if showAllProjects is true)
  const displayedProjects = showAllProjects ? projects : projects.slice(0, 3);
  const hasMoreProjects = projects.length > 3;

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden min-h-screen relative">
      <Head>
        <title>Syarif Romadloni - Web Developer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Animated Glow Elements from Project Detail Page */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/25 to-transparent rounded-full blur-2xl animate-bounce-slow"></div>
        
        {/* Center Left Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 via-indigo-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-sky-400/30 to-transparent rounded-full blur-2xl animate-bounce-slow" style={{animationDelay: '0.5s'}}></div>
        
        {/* Bottom Right Glow */}
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-gradient-to-tl from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-[350px] h-[350px] bg-gradient-to-tl from-indigo-400/25 to-transparent rounded-full blur-2xl animate-bounce-slow" style={{animationDelay: '1.5s'}}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/60 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-cyan-400/50 rounded-full animate-float-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400/40 rounded-full animate-float-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 bg-indigo-400/50 rounded-full animate-float-slow" style={{animationDelay: '0.5s'}}></div>
        
        {/* === New Glows Added === */}
        <div className="absolute top-10 left-20 w-[300px] h-[300px] bg-gradient-to-bl from-rose-400/15 to-transparent rounded-full blur-2xl animate-bounce-slow" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Header Section with Aurora */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0">
          <Aurora
            colorStops={["#0037FF", "#27ADB0", "#1357F6"]}
            blend={0.5}
            amplitude={1.0}
            speed={1.1}
          />
        </div>
        
        {/* Header */}
        <header
          className="relative z-50 flex justify-between items-center py-8 px-6 sm:px-12 lg:px-20"
          data-aos="fade-down"
        >
          <div className="text-2xl font-bold text-gradient hover:text-blue-400 transition-colors duration-300">Riif Creative</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#about" className="nav-item text-xl hover:text-blue-400 transition-colors duration-300">About</a>
            <a href="#skills" className="nav-item text-xl hover:text-blue-400 transition-colors duration-300">Skills</a>
            <a href="#projects" className="nav-item text-xl hover:text-blue-400 transition-colors duration-300">Projects</a>
            <a href="#contact" className="nav-item text-xl hover:text-blue-400 transition-colors duration-300">Contact</a>
          </nav>
        </header>
      </section>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-10">
        {/* Hero Section */}
        <section id="hero" className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-center py-8 lg:py-12 lg:py-20">
          {/* Text Content */}
          {isMobile ? (
            <div className="lg:col-span-6 space-y-4 lg:space-y-6 text-center lg:text-left">
              <div>
                <TypeAnimation
                  sequence={[
                    roles[0].title, 9000,
                    roles[1].title, 14000,
                    roles[2].title, 15000,
                    roles[3].title, 15500,
                  ]}
                  wrapper="p" speed={10} deletionSpeed={10}
                  className="text-neutral-300 text-2xl lg:text-3xl lg:text-4xl font-medium mb-4"
                  repeat={Infinity}
                />
                <h1 className="text-3xl lg:text-4xl lg:text-6xl font-semibold tracking-wide text-gradient">
                  Syarif Romadloni
                </h1>
              </div>
              <div className="w-24 lg:w-28 h-2 lg:h-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg pulse-slow mx-auto lg:mx-0" />
              <TypeAnimation
                sequence={[
                  roles[0].description, 5000,
                  roles[1].description, 5000,
                  roles[2].description, 5000,
                  roles[3].description, 5000,
                ]}
                wrapper="p" speed={70} deletionSpeed={99}
                className="text-neutral-300 text-base lg:text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
                repeat={Infinity} style={{ minHeight: '120px' }}
              />
              <a 
                href="https://drive.google.com/file/d/1SEVPKsGmNG0gCpeJPtvUzm2Bb_zyE90X/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-btn w-46 text-center items-center flex items-center space-x-3 px-6 py-3 rounded-lg border border-neutral-300 text-neutral-300 font-medium hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300 mx-auto lg:mx-0"
              >
                <span>Download CV</span>
                <svg className="w-5 h-5 transform rotate-90 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8 8-8-8" />
                </svg>
              </a>
            </div>
          ) : (
            <motion.div
              className="lg:col-span-6 space-y-4 lg:space-y-6 text-center lg:text-left"
              style={{ opacity: textOpacity, x: textX }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <TypeAnimation
                  sequence={[
                    roles[0].title, 9000,
                    roles[1].title, 14000,
                    roles[2].title, 15000,
                    roles[3].title, 15500,
                  ]}
                  wrapper="p" speed={10} deletionSpeed={10}
                  className="text-neutral-300 text-2xl lg:text-3xl lg:text-4xl font-medium mb-4"
                  repeat={Infinity}
                />
                <h1 className="text-3xl lg:text-4xl lg:text-6xl font-semibold tracking-wide text-gradient">
                  Syarif Romadloni
                </h1>
              </div>
              <div className="w-24 lg:w-28 h-2 lg:h-2.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg pulse-slow mx-auto lg:mx-0" />
              <TypeAnimation
                sequence={[
                  roles[0].description, 5000,
                  roles[1].description, 5000,
                  roles[2].description, 5000,
                  roles[3].description, 5000,
                ]}
                wrapper="p" speed={70} deletionSpeed={99}
                className="text-neutral-300 text-base lg:text-lg lg:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
                repeat={Infinity} style={{ minHeight: '120px' }}
              />
              <a 
                href="https://drive.google.com/file/d/1SEVPKsGmNG0gCpeJPtvUzm2Bb_zyE90X/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-btn flex w-46 text-center items-center space-x-3 px-6 py-3 rounded-lg border border-neutral-300 text-neutral-300 font-medium hover:border-blue-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-300 mx-auto lg:mx-0"
              >
                <span>Download CV</span>
                <svg className="w-5 h-5 transform rotate-90 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8 8-8-8" />
                </svg>
              </a>
            </motion.div>
          )}

          {/* Image */}
          {isMobile ? (
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group w-full max-w-sm mx-auto">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="Syarif Romadloni"
                  width={384}
                  height={500}
                  className="profile-img object-cover rounded-2xl shadow-2xl w-full h-auto max-h-[300px] sm:max-h-[350px] lg:max-h-[500px] group-hover:shadow-blue-400/20 transition-all duration-300"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/50 to-transparent group-hover:from-blue-400/20 transition-all duration-300" />
              </div>
            </div>
          ) : (
            <motion.div
              className="lg:col-span-4 flex justify-center"
              style={{ opacity: rightContentOpacity, x: rightContentX }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative group w-full max-w-sm mx-auto">
                <Image
                  src="/assets/images/hero.jpg"
                  alt="Syarif Romadloni"
                  width={384}
                  height={500}
                  className="profile-img object-cover rounded-2xl shadow-2xl w-full h-auto max-h-[300px] sm:max-h-[350px] lg:max-h-[500px] group-hover:shadow-blue-400/20 transition-all duration-300"
                  priority
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-slate-950/50 to-transparent group-hover:from-blue-400/20 transition-all duration-300" />
              </div>
            </motion.div>
          )}

          {/* Stats */}
          {isMobile ? (
             <div className="lg:col-span-2 space-y-6 lg:space-y-8 stats-section">
               <div className="text-center lg:text-right space-y-2 group">
                 <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Year of<br />Experience</p>
                 <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">3+</p>
               </div>
               <div className="text-center lg:text-right space-y-2 group">
                 <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Complete<br />Project</p>
                 <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">{projects.length}</p>
               </div>
               <div className="text-center lg:text-right space-y-2 group">
                 <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Client</p>
                 <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">10++</p>
               </div>
             </div>
          ) : (
            <motion.div
              className="lg:col-span-2 space-y-6 lg:space-y-8 stats-section"
              style={{ opacity: rightContentOpacity, x: rightContentX }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="text-center lg:text-right space-y-2 group">
                <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Year of<br />Experience</p>
                <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                  <CountUp end={3} duration={3.5} suffix="+" enableScrollSpy scrollSpyOnce={true} />
                </p>
              </div>
              <div className="text-center lg:text-right space-y-2 group">
                <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Complete<br />Project</p>
                <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                  <CountUp end={projects.length} duration={3.5} enableScrollSpy scrollSpyOnce={true} />
                </p>
              </div>
              <div className="text-center lg:text-right space-y-2 group">
                <p className="text-neutral-300 text-base lg:text-lg group-hover:text-blue-400 transition-colors duration-300">Client</p>
                <p className="stat-counter text-white text-3xl lg:text-4xl sm:text-5xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                  <CountUp end={10} duration={3.5} enableScrollSpy scrollSpyOnce={true} />+
                </p>
              </div>
            </motion.div>
          )}
        </section>

        {/* About Section with Grid Layout */}
        <section 
          id="about"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-12 lg:mt-20" 
          data-aos={isMobile ? "" : "fade-down"}
          data-aos-duration="1000" 
          data-aos-offset="200"
          data-aos-anchor-placement="top-center"
          data-aos-once="false"
        >
          <div className="relative flex justify-center items-start pt-8 h-[450px] lg:h-auto lg:items-center lg:pt-0" data-aos={isMobile ? "" : "fade-right"} data-aos-delay="200">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 lg:w-32 h-6 lg:h-8 bg-gradient-to-b from-sky-600 bg-blue-400 rounded-t-lg z-10" />
            <div className="relative z-0 w-full h-full">
              <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
            </div>
          </div>
          <div className="space-y-4 lg:space-y-6" data-aos={isMobile ? "" : "fade-left"} data-aos-delay="400">
            <h2 className="text-2xl lg:text-3xl font-bold text-gradient text-blue-400">About Me</h2>
            <div className="w-16 lg:w-20 h-1 lg:h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg" />
            <p className="text-neutral-300 text-base lg:text-lg leading-relaxed">
            Ketertarikan saya pada dunia teknologi dan desain dimulai sejak masa SMK, di mana saya mulai mendalami berbagai hal seperti pemrograman web, desain grafis, dan produksi media kreatif.
Saat ini, saya melanjutkan pendidikan di Universitas Negeri Semarang, program studi Pendidikan Teknik Informatika dan Komputer, sembari aktif sebagai freelancer di bidang UI/UX Design, Web Development, Graphic Design, dan Creative Media.
Bagi saya, teknologi bukan sekadar alat, tapi ruang untuk menuangkan ide, memecahkan masalah, dan menciptakan solusi yang berdampak.
            </p>
          </div>
        </section>
      </main>

      {/* Skills Section - Full Width */}
      <section id="skills" className="skills-section min-h-32 lg:min-h-40 text-4xl flex flex-col items-center justify-center w-full px-6 lg:px-8 py-26 lg:py-12">
        {/* Scroll Velocity Effect pada Judul */}
        <ScrollVelocity
          texts={['   Experience With   -   ']}
          velocity={30}
          className="text-gray-300 font-bold text-2xl md:text-3xl lg:text-5xl tracking-widest uppercase mb-6 lg:mb-10"
          damping={50}
          stiffness={400}
          numCopies={20}
          parallaxClassName="w-full overflow-hidden"
          scrollerClassName="flex whitespace-nowrap justify-center"
        />
        
        {/* Skills Icons dengan efek scroll velocity */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 md:gap-12">
          {/* Laravel SVG */}
          <motion.span 
            className="w-8 h-8 md:w-10 md:h-10 lg:w-16 lg:h-16 flex items-center justify-center md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg fill="#ff0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <title>laravel</title>
              <path d="M13.143 23.585l10.46-5.97-4.752-2.736-10.453 6.019zM24.084 11.374l-4.757-2.736v5.417l4.758 2.737zM24.559 5.078l-4.756 2.736 4.756 2.736 4.755-2.737zM9.911 18.928l2.76-1.589v-11.934l-4.758 2.738v11.934zM7.437 1.846l-4.756 2.737 4.756 2.737 4.753-2.737zM2.204 5.406v18.452l10.464 6.022v-5.471l-5.472-3.096c-0.018-0.013-0.032-0.027-0.051-0.039-0.014-0.013-0.030-0.023-0.044-0.034l-0.001-0.003c-0.015-0.015-0.028-0.031-0.039-0.049l-0.001-0.001c-0.014-0.013-0.025-0.028-0.035-0.045l-0.001-0.001h-0.003c-0.008-0.015-0.016-0.035-0.024-0.055l-0.001-0.004c-0.007-0.015-0.015-0.032-0.022-0.051l-0.001-0.003c-0.004-0.020-0.008-0.045-0.010-0.070l-0-0.002c-0.003-0.015-0.006-0.033-0.008-0.051l-0-0.001v-12.759l-2.757-1.59zM24.085 23.857v-5.422l-10.464 5.974v5.47zM29.789 14.055v-5.417l-4.756 2.737v5.417zM30.725 7.69c0.011 0.038 0.018 0.081 0.018 0.126v0 6.513c-0 0.176-0.095 0.329-0.237 0.411l-0.002 0.001-5.468 3.149v6.241c-0 0.175-0.095 0.328-0.236 0.411l-0.002 0.001-11.416 6.57c-0.024 0.013-0.052 0.025-0.081 0.033l-0.003 0.001-0.030 0.013c-0.036 0.011-0.078 0.017-0.121 0.017s-0.085-0.006-0.125-0.018l0.003 0.001c-0.015-0.004-0.027-0.009-0.039-0.016l0.001 0.001c-0.031-0.011-0.057-0.021-0.082-0.033l0.004 0.002-11.413-6.57c-0.144-0.084-0.239-0.237-0.239-0.412v0-19.548c0-0.044 0.007-0.087 0.019-0.127l-0.001 0.003c0.004-0.015 0.013-0.025 0.018-0.040 0.009-0.029 0.019-0.053 0.030-0.076l-0.001 0.003c0.008-0.016 0.018-0.030 0.029-0.042l-0 0 0.042-0.057 0.047-0.034c0.018-0.015 0.034-0.030 0.052-0.043h0.001l5.708-3.285c0.068-0.040 0.15-0.064 0.237-0.064s0.169 0.024 0.239 0.065l-0.002-0.001 5.71 3.285c0.019 0.013 0.035 0.027 0.051 0.042l-0-0 0.048 0.034c0.016 0.018 0.025 0.038 0.042 0.057 0.012 0.012 0.022 0.026 0.031 0.041l0.001 0.001c0.010 0.020 0.020 0.044 0.029 0.069l0.001 0.004 0.016 0.040c0.011 0.035 0.018 0.076 0.018 0.118 0 0.002 0 0.004-0 0.006v-0 12.208l4.756-2.737v-6.241c0-0.001 0-0.002 0-0.002 0-0.043 0.006-0.085 0.017-0.125l-0.001 0.003c0.004-0.013 0.013-0.025 0.016-0.040 0.010-0.030 0.020-0.054 0.032-0.078l-0.002 0.004c0.009-0.015 0.023-0.025 0.032-0.042 0.015-0.019 0.027-0.038 0.042-0.054 0.014-0.013 0.029-0.025 0.045-0.035l0.001-0.001c0.018-0.013 0.033-0.029 0.052-0.040h0.001l5.708-3.286c0.068-0.040 0.15-0.064 0.237-0.064s0.169 0.024 0.239 0.065l-0.002-0.001 5.708 3.286c0.020 0.013 0.034 0.027 0.053 0.039 0.015 0.013 0.032 0.023 0.046 0.035 0.016 0.018 0.028 0.038 0.043 0.056 0.011 0.012 0.021 0.026 0.030 0.040l0.001 0.001c0.012 0.022 0.022 0.047 0.030 0.073l0.001 0.003c0.008 0.012 0.014 0.025 0.019 0.039l0 0.001z"></path>
            </svg>
          </motion.span>
          {/* Next.js SVG */}
          <motion.span 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <svg fill="#007bff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#007bff" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <path d="M23.749 30.005c-0.119 0.063-0.109 0.083 0.005 0.025 0.037-0.015 0.068-0.036 0.095-0.061 0-0.021 0-0.021-0.1 0.036zM23.989 29.875c-0.057 0.047-0.057 0.047 0.011 0.016 0.036-0.021 0.068-0.041 0.068-0.047 0-0.027-0.016-0.021-0.079 0.031zM24.145 29.781c-0.057 0.047-0.057 0.047 0.011 0.016 0.037-0.021 0.068-0.043 0.068-0.048 0-0.025-0.016-0.020-0.079 0.032zM24.303 29.688c-0.057 0.047-0.057 0.047 0.009 0.015 0.037-0.020 0.068-0.041 0.068-0.047 0-0.025-0.016-0.020-0.077 0.032zM24.516 29.547c-0.109 0.073-0.147 0.12-0.047 0.068 0.067-0.041 0.181-0.131 0.161-0.131-0.043 0.016-0.079 0.043-0.115 0.063zM14.953 0.011c-0.073 0.005-0.292 0.025-0.484 0.041-4.548 0.412-8.803 2.86-11.5 6.631-1.491 2.067-2.459 4.468-2.824 6.989-0.129 0.88-0.145 1.14-0.145 2.333 0 1.192 0.016 1.448 0.145 2.328 0.871 6.011 5.147 11.057 10.943 12.927 1.043 0.333 2.136 0.563 3.381 0.704 0.484 0.052 2.577 0.052 3.061 0 2.152-0.24 3.969-0.771 5.767-1.688 0.276-0.14 0.328-0.177 0.291-0.208-0.88-1.161-1.744-2.323-2.323-3.495l-2.557-3.453-3.203-4.745c-1.068-1.588-2.14-3.172-3.229-4.744-0.011 0-0.025 2.109-0.031 4.681-0.011 4.505-0.011 4.688-0.068 4.792-0.057 0.125-0.151 0.229-0.276 0.287-0.099 0.047-0.188 0.057-0.661 0.057h-0.541l-0.141-0.088c-0.088-0.057-0.161-0.136-0.208-0.229l-0.068-0.141 0.005-6.271 0.011-6.271 0.099-0.125c0.063-0.077 0.141-0.14 0.229-0.187 0.131-0.063 0.183-0.073 0.724-0.073 0.635 0 0.74 0.025 0.907 0.208 1.296 1.932 2.588 3.869 3.859 5.812 2.079 3.152 4.917 7.453 6.312 9.563l2.537 3.839 0.125-0.083c1.219-0.813 2.328-1.781 3.285-2.885 2.016-2.308 3.324-5.147 3.767-8.177 0.129-0.88 0.145-1.141 0.145-2.333 0-1.193-0.016-1.448-0.145-2.328-0.871-6.011-5.147-11.057-10.943-12.928-1.084-0.343-2.199-0.577-3.328-0.697-0.303-0.031-2.371-0.068-2.631-0.041zM21.5 9.688c0.151 0.072 0.265 0.208 0.317 0.364 0.027 0.084 0.032 1.823 0.027 5.74l-0.011 5.624-0.989-1.52-0.995-1.521v-4.083c0-2.647 0.011-4.131 0.025-4.204 0.047-0.167 0.161-0.307 0.313-0.395 0.124-0.063 0.172-0.068 0.667-0.068 0.463 0 0.541 0.005 0.645 0.063z"></path>
            </svg>
          </motion.span>
          {/* Tailwind SVG */}
          <motion.span 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <title>file_type_tailwind</title>
              <path d="M9,13.7q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q11.1,10.9,9,13.7ZM2,22.1q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q4.1,19.3,2,22.1Z" fill="#44a8b3" />
            </svg>
          </motion.span>
          {/* HTML5 SVG */}
          <motion.span 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <title>HTML5</title>
              <path fill="#e44d26" d="M5.902 27.44l-2.363-26.34h24.922l-2.363 26.334-10.1 2.806z"/>
              <path fill="#f16529" d="M16 28.125l8.174-2.273 2.021-22.66h-10.195z"/>
              <path fill="#ebebeb" d="M16 13.118h-4.09l-.277-3.104h4.367v-2.97h-7.36l.072.807.74 8.29h6.548zM16 21.13l-.013.004-3.44-.929-.22-2.46h-2.97l.432 4.84 6.198 1.72.014-.004z"/>
              <path fill="#fff" d="M16.013 13.118v2.97h3.7l-.35 3.91-3.35.93v3.02l6.2-1.72.045-.51.71-7.97.073-.81zM16.013 7.044v2.97h7.08l.06-.67.14-1.6.072-.7z"/>
            </svg>
          </motion.span>
          {/* Figma */}
          <motion.img 
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" 
            alt="Figma" 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* Photoshop */}
          <motion.img 
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" 
            alt="Photoshop" 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
          />
          {/* Adobe Illustrator */}
          <motion.img 
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" 
            alt="Adobe Illustrator" 
            className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain md:grayscale hover:grayscale-0 transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
        </div>

        {/* Scroll Velocity Effect pada Judul */}
        <ScrollVelocity
          texts={['   Experience With   -   ']}
          velocity={-30}
          className="text-gray-300 py-8 lg:py-12 font-bold text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase"
          damping={50}
          stiffness={400}
          numCopies={20}
          parallaxClassName="w-full overflow-hidden"
          scrollerClassName="flex whitespace-nowrap justify-center"
        />
      </section>

      {/* Projects Section - Now with real data */}
      <section id="projects" className="py-12 lg:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl lg:text-4xl font-bold text-gradient text-blue-400">Featured Projects</h2>
            <div className="w-20 lg:w-24 h-1 lg:h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg mx-auto mt-3 lg:mt-4" />
            <p className="text-neutral-300 text-base lg:text-lg mt-3 lg:mt-4 max-w-2xl mx-auto">
              Here are some of the projects I've worked on, showcasing my skills from web development to design.
            </p>
          </div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10"
            initial="initial"
            animate="animate"
            transition={{ staggerChildren: 0.2 }}
          >
            {displayedProjects && displayedProjects.length > 0 ? (
              displayedProjects.map((project: any, index: number) => (
                <ProjectCard key={project._id || index} project={project} />
              ))
            ) : (
              <p className="text-center col-span-full">No projects found. Add one in the admin panel!</p>
            )}
          </motion.div>

          {/* Show More / Show Less Button */}
          {hasMoreProjects && (
            <div className="mt-12 lg:mt-16 text-center">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-2 bg-transparent text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 group text-base lg:text-lg"
              >
                {showAllProjects ? (
                  <>
                    <span>Show Less</span>
                    <svg
                      className="w-4 lg:w-5 h-4 lg:h-5 transition-transform group-hover:-translate-y-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      ></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Show More</span>
                    <svg
                      className="w-4 lg:w-5 h-4 lg:h-5 transition-transform group-hover:translate-y-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section with Grid Layout */}
      <section id="contact" className="py-12 lg:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl lg:text-4xl font-bold text-gradient text-blue-400">Get in Touch</h2>
            <div className="w-20 lg:w-24 h-1 lg:h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg mx-auto mt-3 lg:mt-4" />
            <p className="text-neutral-300 text-base lg:text-lg mt-3 lg:mt-4 max-w-2xl mx-auto">
              Have a project in mind or just want to say hi? Feel free to reach out.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 lg:gap-12 items-start">
            {/* Left Column: Profile Card */}
            <div className="flex justify-center items-center" data-aos="fade-right">
              <ProfileCard
                name="Syarif Romadloni"
                title="Software Engineer"
                handle="syarif_r.m.d"
                status="Online"
                contactText="Hubungi saya"
                avatarUrl="/assets/images/contact.png"
                showUserInfo={true}
                enableTilt={true}
                onContactClick={() => window.location.href = 'mailto:syarifroma@gmail.com'}
              />
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-slate-900/50 p-6 lg:p-8 rounded-2xl border border-slate-800" data-aos="fade-left" data-aos-delay="200">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section id="social-media" className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl lg:text-3xl lg:text-4xl font-bold text-gradient text-blue-400">Social Media</h2>
            <div className="w-20 lg:w-24 h-1 lg:h-1.5 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-lg mx-auto mt-3 lg:mt-4" />
            <p className="text-neutral-300 text-base lg:text-lg mt-3 lg:mt-4 max-w-2xl mx-auto">
              Follow me on social media for updates and more content.
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-8 lg:gap-12">
            {/* Instagram */}
            <motion.a
              href="https://www.instagram.com/riif.creative?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center space-y-3 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center">
                <svg className="w-8 h-8 lg:w-16 lg:h-16 text-pink-500 group-hover:text-pink-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="text-neutral-300 group-hover:text-pink-400 font-medium transition-colors duration-300">Instagram</span>
            </motion.a>

            {/* TikTok */}
            <motion.a
              href="https://www.tiktok.com/@syarif_rmd"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center space-y-3 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                <svg className="w-12 h-12 lg:w-16 lg:h-16 text-cyan-500 group-hover:text-cyan-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
              <span className="text-neutral-300 group-hover:text-cyan-400 font-medium transition-colors duration-300">TikTok</span>
            </motion.a>

            {/* YouTube */}
            <motion.a
              href="https://www.youtube.com/@syarifrmd7179"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center space-y-3 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 lg:w-20 lg:h-20 flex items-center justify-center">
                <svg className="w-8 h-8 lg:w-16 lg:h-16 text-red-500 group-hover:text-red-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-neutral-300 group-hover:text-red-400 font-medium transition-colors duration-300">YouTube</span>
            </motion.a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="text-center py-8 border-t border-slate-800">
        <p className="text-neutral-400">&copy; {new Date().getFullYear()} Riif Creative. All rights reserved.</p>
      </footer>
    </div>
  );
}
