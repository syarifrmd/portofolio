"use client";

import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Aurora from './components/Aurora/Aurora';
import ScrollVelocity from './components/ScrollVelocity/ScrollVelocity';
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ContactForm from "./components/ContactForm";
import { TypeAnimation } from 'react-type-animation';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack'
import { GlassDock, type DockItem } from "@/components/glass-dock";
import { FolderKanban, Mail, UserRound, Wrench } from "lucide-react";


type JourneyItem = {
  title: string;
  organization?: string;
  period: string;
  tag?: string;
  points: string[];
};

const workJourney: JourneyItem[] = [
  {
    title: "Magang",
    organization: "Wiyora Technology",
    period: "Agustus 2025 - Desember 2025",
    points: [
      "Front-End Developer untuk pengembangan web profile perusahaan menggunakan React.js dan Bun Framework.",
      "Merancang antarmuka responsif, optimasi performa aplikasi, serta kolaborasi tim di seluruh tahap pengembangan.",
    ],
  },
  {
    title: "Freelance",
    organization: "Riif Creative",
    period: "2023 - Sekarang",
    points: [
      "Menangani proyek UI/UX Design, website development, desain grafis, dan editing video untuk personal, organisasi, serta klien.",
      "Bertanggung jawab dari konsep, riset pengguna, desain visual, hingga implementasi teknis dengan Figma, Illustrator, Photoshop, dan Laravel.",
      "Mengembangkan antarmuka website menggunakan React, Next.js, dan Tailwind CSS.",
    ],
  },
  {
    title: "Owner",
    organization: "WONDES (Wonton Pedes)",
    period: "Desember 2023 - Sekarang",
    points: [
      "Mendirikan dan mengelola usaha kuliner wonton pedas sebagai usaha sampingan kuliah.",
      "Menangani produksi, pemasaran, dan penjualan melalui Instagram @wondes.id.",
      "Mencapai omzet jutaan rupiah dalam kurang dari satu tahun.",
    ],
  },
  {
    title: "Magang",
    organization: "Studio E&E",
    period: "Januari 2022 - April 2022",
    points: [
      "Training Design Graphics, Social Media Marketing, 3D Blender, Video Editing (Premiere dan After Effects), UI/UX Figma, serta Adobe InDesign.",
    ],
  },
];

const competitionJourney: JourneyItem[] = [
  {
    title: "LIDM 2025 - Divisi Video Digital Pendidikan",
    period: "September 2025",
    points: [
      "Membuat film pendek tentang penggunaan AI di perguruan tinggi untuk edukasi etika, batasan, dan integritas akademik.",
      "Lolos seleksi internal UNNES.",
      "Total views TikTok dan YouTube mencapai 43,5 ribu.",
    ],
  },
  {
    title: "GEMASTIK 2025 - Divisi Software Engineering",
    period: "Agustus 2025",
    points: [
      "Mengembangkan aplikasi monitoring gizi anak yang mendukung program MBG.",
      "Lolos seleksi internal UNNES dari puluhan tim.",
      "Berperan sebagai FullStack Developer.",
    ],
  },
  {
    title: "Finalis 4th Lomba UI/UX HIFEST 2024",
    period: "Oktober 2024",
    points: [
      "Berkompetisi pada bidang Teknologi Pendidikan.",
      "Merancang UI/UX dengan metode Design Thinking dan melibatkan puluhan responden sebagai umpan balik.",
    ],
  },
];

const trainingJourney: JourneyItem[] = [
  {
    title: "Bootcamp IDCamp 2024",
    period: "Desember 2024 - Januari 2025",
    points: [
      "Menyelesaikan Android Development Learning Path kelas pemula.",
      "Mendalami fundamental aplikasi Android dan bahasa Kotlin.",
      "Membuat proyek akhir aplikasi LokalFood di Android Studio.",
    ],
  },
  {
    title: "Course Training Web Development - E&E Studio",
    period: "2022",
    points: [
      "Pelatihan dasar web development: HTML, CSS, JavaScript, dan Bootstrap.",
      "Menyelesaikan modul Laravel sebagai FullStack Developer.",
    ],
  },
];

const learningJourney: JourneyItem[] = [
  ...competitionJourney.map((item) => ({ ...item, tag: "Lomba" })),
  ...trainingJourney.map((item) => ({ ...item, tag: "Pelatihan" })),
];


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

const heroOverlaySlots = [
  { x: -175, y: -145, rotate: -4 },
  { x: 190, y: -30, rotate: 2 },
  { x: -70, y: 185, rotate: -2 },
  { x: 175, y: 175, rotate: 3 },
  { x: -10, y: -185, rotate: 1 },
  { x: 225, y: 95, rotate: -3 },
];

const heroOverlayIds = ["experience", "project", "client"];
const lanyardDividerItems = ["Web Development", "App Development", "Desain Graphics", "Video Graphics", "Branding", "UI/UX"];

const shuffleSlots = (count: number) => {
  const slotIndexes = heroOverlaySlots.map((_, index) => index);
  for (let i = slotIndexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [slotIndexes[i], slotIndexes[j]] = [slotIndexes[j], slotIndexes[i]];
  }
  return slotIndexes.slice(0, count);
};

const buildOverlaySlotMap = (slotIndexes: number[]) => {
  return heroOverlayIds.reduce<Record<string, number>>((acc, id, index) => {
    acc[id] = slotIndexes[index] ?? index;
    return acc;
  }, {});
};

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDockMode, setIsDockMode] = useState(false);
  const [overlaySlotMap, setOverlaySlotMap] = useState<Record<string, number>>(() =>
    buildOverlaySlotMap(shuffleSlots(heroOverlayIds.length))
  );
  const [workLineValue, setWorkLineValue] = useState(0);
  const [learningLineValue, setLearningLineValue] = useState(0);
  const workTimelineRef = useRef<HTMLDivElement | null>(null);
  const learningTimelineRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress: workLineProgress } = useScroll({
    target: workTimelineRef,
    offset: ["start 85%", "end end"],
  });
  const workLineFill = useSpring(workLineProgress, {
    stiffness: 125,
    damping: 28,
    mass: 0.45,
  });

  const { scrollYProgress: learningLineProgress } = useScroll({
    target: learningTimelineRef,
    offset: ["start 85%", "end end"],
  });
  const learningLineFill = useSpring(learningLineProgress, {
    stiffness: 125,
    damping: 28,
    mass: 0.45,
  });

  useMotionValueEvent(workLineProgress, "change", (latest) => {
    setWorkLineValue(latest);
  });

  useMotionValueEvent(learningLineProgress, "change", (latest) => {
    setLearningLineValue(latest);
  });

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

  useEffect(() => {
    if (isMobile) return;

    const interval = window.setInterval(() => {
      setOverlaySlotMap(buildOverlaySlotMap(shuffleSlots(heroOverlayIds.length)));
    }, 3600);

    return () => window.clearInterval(interval);
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      setIsDockMode(window.scrollY > 90);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const target = document.querySelector(sectionId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navLinks = [
    { id: "about", label: "About", href: "#about" },
    { id: "skills", label: "Skills", href: "#skills" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "contact", label: "Contact", href: "#contact" },
  ];

  const dockItems: DockItem[] = [
    {
      id: "about",
      label: "About",
      icon: <UserRound className="h-5 w-5" />,
      onClick: () => scrollToSection("#about"),
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Wrench className="h-5 w-5" />,
      onClick: () => scrollToSection("#skills"),
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderKanban className="h-5 w-5" />,
      onClick: () => scrollToSection("#projects"),
    },
    {
      id: "contact",
      label: "Contact",
      icon: <Mail className="h-5 w-5" />,
      onClick: () => scrollToSection("#contact"),
    },
  ];

  const evadeOverlay = (overlayId: string) => {
    if (isMobile) return;

    setOverlaySlotMap((prev) => {
      const usedSlots = Object.entries(prev)
        .filter(([id]) => id !== overlayId)
        .map(([, slot]) => slot);

      const availableSlots = heroOverlaySlots
        .map((_, index) => index)
        .filter((index) => !usedSlots.includes(index));

      if (availableSlots.length === 0) {
        return prev;
      }

      const randomSlot =
        availableSlots[Math.floor(Math.random() * availableSlots.length)];

      return {
        ...prev,
        [overlayId]: randomSlot,
      };
    });
  };

  // Get projects to display (4 latest initially, or all if showAllProjects is true)
  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);
  const hasMoreProjects = projects.length > 4;
  const heroOverlayData = [
    {
      id: "experience",
      label: "Year of Experience",
      value: "3+",
      accent: "from-emerald-300 to-cyan-300",
      dot: "bg-emerald-400",
    },
    {
      id: "project",
      label: "Complete Project",
      value: `${projects.length}+`,
      accent: "from-sky-300 to-blue-300",
      dot: "bg-sky-400",
    },
    {
      id: "client",
      label: "Client",
      value: "10+",
      accent: "from-fuchsia-300 to-pink-300",
      dot: "bg-fuchsia-400",
    },
  ];

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

      {/* Transforming top navbar -> dock on scroll */}
      <div
        className={`fixed inset-x-0 z-[80] pointer-events-none transition-all duration-300 ${
          isDockMode ? "bottom-4 px-4" : "top-0 px-4 sm:px-8 pt-4"
        }`}
      >
        <motion.header
          className={`pointer-events-auto mx-auto overflow-hidden transition-all duration-300 ${
            isDockMode
              ? "bg-transparent border-transparent shadow-none"
              : "border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(0,0,0,0.1)]"
          }`}
          animate={
            isDockMode
              ? {
                  width: "fit-content",
                  borderRadius: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                  paddingLeft: 0,
                  paddingRight: 0,
                }
              : {
                  width: "min(1100px, calc(100vw - 2rem))",
                  borderRadius: 24,
                  paddingTop: 20,
                  paddingBottom: 20,
                  paddingLeft: 28,
                  paddingRight: 28,
                }
          }
          transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.7 }}
          data-aos="fade-down"
        >
          <motion.div
            className="flex items-center justify-between gap-6"
            animate={{
              opacity: isDockMode ? 0 : 1,
              height: isDockMode ? 0 : "auto",
            }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              onClick={() => scrollToSection("#hero")}
              className="text-2xl font-bold text-gradient hover:text-blue-400 transition-colors duration-300"
            >
              Riif Creative
            </button>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="nav-item text-xl hover:text-blue-400 transition-colors duration-300"
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="flex justify-center"
            animate={{
              opacity: isDockMode ? 1 : 0,
              height: isDockMode ? "auto" : 0,
              marginTop: 0,
            }}
            transition={{ duration: 0.24 }}
          >
            <GlassDock
              items={dockItems}
              baseSize={isMobile ? 42 : 48}
              maxSize={isMobile ? 62 : 72}
              magnification={1.55}
              glassIntensity="high"
              className="mx-auto"
            />
          </motion.div>
        </motion.header>
      </div>

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
      
      {/* Header Background Aurora */}
      <section className="absolute inset-x-0 top-0 h-52 sm:h-64 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0">
          <Aurora
            colorStops={["#0037FF", "#27ADB0", "#1357F6"]}
            blend={0.5}
            amplitude={1.0}
            speed={1.1}
          />
        </div>
      </section>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-26">
        {/* Hero Section */}
        <section id="hero" className="relative">
          <motion.div
            className="grid lg:grid-cols-12 gap-6 lg:gap-8 pt-2 pb-4 lg:pt-4 lg:pb-6 lg:items-center origin-center"
            initial={{ opacity: 0, y: 28, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
          {/* Text Content */}
          {isMobile ? (
            <div className="lg:col-span-7 space-y-4 lg:space-y-6 text-center lg:text-left">
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
              className="lg:col-span-7 space-y-4 lg:space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.58, delay: 0.08, ease: "easeOut" }}
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
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <motion.div
                className="relative group w-full max-w-sm h-[300px] sm:h-[350px] mx-auto overflow-visible"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute left-1/2 top-0 bottom-0 -z-10 w-full -translate-x-1/2 rounded-[1.6rem] bg-gradient-to-b from-sky-300 to-cyan-500 shadow-[0_18px_55px_rgba(34,211,238,0.28)]"
                />
                <div className="absolute left-1/2 top-6 bottom-6 -z-20 w-full -translate-x-1/2 rounded-[2rem] border border-cyan-300/35 bg-cyan-400/12 blur-[1px]" />

                <div className="absolute left-1/2 top-0 z-10 h-full w-full -translate-x-1/2 overflow-hidden rounded-[1.6rem]">
                  <Image
                    src="/assets/images/hero.png"
                    alt="Syarif Romadloni"
                    width={384}
                    height={500}
                    className="profile-img h-full w-full object-cover object-center"
                    priority
                  />
                </div>

                <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-full -translate-x-1/2">
                  <Image
                    src="/assets/images/hero.png"
                    alt="Syarif Romadloni left hand out frame"
                    width={384}
                    height={500}
                    className="h-full w-full object-cover object-center"
                    style={{ clipPath: "polygon(0% 40%, 32% 40%, 32% 72%, 0% 72%)" }}
                  />
                </div>
              </motion.div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {heroOverlayData.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/15 bg-slate-900/70 backdrop-blur-md px-3 py-2 text-center"
                  >
                    <p className="text-[11px] text-white/70 leading-tight">{item.label}</p>
                    <p className="text-base font-semibold text-white mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="lg:col-span-5 flex justify-center"
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.14, ease: "easeOut" }}
            >
              <motion.div
                className="relative group w-full max-w-sm h-[500px] mx-auto overflow-visible"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute left-1/2 top-0 bottom-0 -z-10 w-full -translate-x-1/2 rounded-[1.8rem] bg-gradient-to-b from-sky-300 to-cyan-500 shadow-[0_24px_70px_rgba(34,211,238,0.34)]"
                />
                <div className="absolute left-1/2 top-6 bottom-6 -z-20 w-full -translate-x-1/2 rounded-[2.3rem] border border-cyan-300/35 bg-cyan-400/12 blur-[1px]" />

                <div className="absolute left-1/2 top-0 z-10 h-full w-full -translate-x-1/2 overflow-hidden rounded-[1.8rem]">
                  <Image
                    src="/assets/images/hero.png"
                    alt="Syarif Romadloni"
                    width={384}
                    height={500}
                    className="profile-img h-full w-full object-cover object-center"
                    priority
                  />
                </div>

                <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-full -translate-x-1/2">
                  <Image
                    src="/assets/images/hero.png"
                    alt="Syarif Romadloni left hand out frame"
                    width={384}
                    height={500}
                    className="h-full w-full object-cover object-center"
                    style={{ clipPath: "polygon(0% 40%, 32% 40%, 32% 72%, 0% 72%)" }}
                  />
                </div>
                {heroOverlayData.map((overlay, index) => {
                  const slotIndex = overlaySlotMap[overlay.id] ?? index;
                  const slot = heroOverlaySlots[slotIndex] ?? heroOverlaySlots[index];

                  return (
                    <motion.div
                      key={overlay.id}
                      className="absolute left-1/2 top-1/2 z-20"
                      animate={{ x: slot.x, y: slot.y, rotate: slot.rotate }}
                      transition={{ type: "spring", stiffness: 90, damping: 14 }}
                      onHoverStart={() => evadeOverlay(overlay.id)}
                    >
                      <motion.div
                        className="cursor-pointer rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-md"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.6 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${overlay.dot}`}></span>
                          <p className="text-[11px] uppercase tracking-wider text-slate-500">Portfolio Stat</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-tight">{overlay.label}</p>
                        <p className={`text-lg font-semibold bg-gradient-to-r ${overlay.accent} bg-clip-text text-transparent`}>
                          {overlay.value}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
          </motion.div>
        </section>

        {/* Lanyard Divider */}
        <div className="relative mt-16 mb-0 overflow-visible z-40">
          <div className="relative left-1/2 -translate-x-1/2 h-12 lg:h-18 w-screen -rotate-[6.8deg] border border-cyan-300/45 bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-500 shadow-[0_16px_40px_rgba(34,211,238,0.3)]">
            <div className="absolute inset-0  bg-linear-to-b from-white/25 via-white/5 to-transparent" />
            <div className="relative h-full px-6 lg:px-12 flex items-center justify-center gap-3 lg:gap-5 text-[10px] lg:text-sm font-bold uppercase tracking-[0.08em] text-slate-950/90 whitespace-nowrap overflow-hidden">
              {lanyardDividerItems.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-3 lg:gap-5">
                  <span>{item}</span>
                  {index < lanyardDividerItems.length - 1 && <span className="text-white/85">✦</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* About Section with Stack Field */}
        <section id="about" className="relative mt-0 lg:mt-0 pt-10 overflow-visible mb-26">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-center relative"
            initial={{ opacity: 0, y: 30, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.62, ease: "easeOut" }}
          >
            {/* Desktop: Lanyard as free absolute layer (not constrained by 50% column). */}
            {!isMobile && (
              <motion.div
                className="hidden lg:block absolute left-[50%] top-0 h-full w-[170vw] -translate-x-[64%] overflow-visible z-30"
                initial={{ opacity: 0, y: 22, scale: 0.985 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.56, delay: 0.08, ease: "easeOut" }}
              >
                <div className="relative h-full w-full overflow-visible flex items-center justify-center">
                  <div className="relative z-0 w-full h-full overflow-visible">
                    <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} transparent={true} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mobile: keep lanyard in normal flow */}
            {isMobile && (
              <motion.div
                className="relative overflow-visible flex justify-center items-start pt-8 h-[450px]"
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.52, ease: "easeOut" }}
              >
                <div className="relative z-0 w-full h-full overflow-visible">
                  <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} transparent={true} />
                </div>
              </motion.div>
            )}

            <motion.div
              className="space-y-4 lg:space-y-6 lg:col-start-2 relative z-10"
              initial={{ opacity: 0, y: 24, scale: 0.99 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.56, delay: 0.1, ease: "easeOut" }}
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-cyan-400">About Me</h2>
              <div className="w-16 lg:w-20 h-1 lg:h-1.5 bg-cyan-400 rounded-lg" />
              <p className="text-neutral-300 text-base lg:text-lg leading-relaxed">
              Ketertarikan saya pada dunia teknologi dan desain dimulai sejak masa SMK, di mana saya mulai mendalami berbagai hal seperti pemrograman web, desain grafis, dan produksi media kreatif.
Saat ini, saya melanjutkan pendidikan di Universitas Negeri Semarang, program studi Pendidikan Teknik Informatika dan Komputer, sembari aktif sebagai freelancer di bidang UI/UX Design, Web Development, Graphic Design, dan Creative Media.
Bagi saya, teknologi bukan sekadar alat, tapi ruang untuk menuangkan ide, memecahkan masalah, dan menciptakan solusi yang berdampak.
              </p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Skills Section - Full Width */}
      <section id="skills" className="skills-section min-h-32 lg:min-h-40 text-4xl flex flex-col items-center justify-center w-full pt-40 px-4">
        {/* Scroll Velocity Effect pada Judul */}
        <ScrollVelocity
          texts={["EXPERIENCE WITH ✦ "]}
          velocity={34}
          followScroll={false}
          className="text-gray-300 font-bold text-2xl md:text-3xl lg:text-5xl tracking-widest uppercase mb-6 lg:mb-10"
          damping={50}
          stiffness={400}
          numCopies={28}
          parallaxClassName="w-full overflow-hidden pointer-events-none"
          scrollerClassName="flex whitespace-nowrap pointer-events-none select-none"
        />
        
        {/* Skills Icons dengan efek scroll velocity */}
        <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-18">
          {/* Laravel SVG */}
          <motion.span 
            className="skill-icon w-8 h-8 md:w-10 md:h-10 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg fill="#ff0000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ff0000" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <title>laravel</title>
              <path d="M13.143 23.585l10.46-5.97-4.752-2.736-10.453 6.019zM24.084 11.374l-4.757-2.736v5.417l4.758 2.737zM24.559 5.078l-4.756 2.736 4.756 2.736 4.755-2.737zM9.911 18.928l2.76-1.589v-11.934l-4.758 2.738v11.934zM7.437 1.846l-4.756 2.737 4.756 2.737 4.753-2.737zM2.204 5.406v18.452l10.464 6.022v-5.471l-5.472-3.096c-0.018-0.013-0.032-0.027-0.051-0.039-0.014-0.013-0.030-0.023-0.044-0.034l-0.001-0.003c-0.015-0.015-0.028-0.031-0.039-0.049l-0.001-0.001c-0.014-0.013-0.025-0.028-0.035-0.045l-0.001-0.001h-0.003c-0.008-0.015-0.016-0.035-0.024-0.055l-0.001-0.004c-0.007-0.015-0.015-0.032-0.022-0.051l-0.001-0.003c-0.004-0.020-0.008-0.045-0.010-0.070l-0-0.002c-0.003-0.015-0.006-0.033-0.008-0.051l-0-0.001v-12.759l-2.757-1.59zM24.085 23.857v-5.422l-10.464 5.974v5.47zM29.789 14.055v-5.417l-4.756 2.737v5.417zM30.725 7.69c0.011 0.038 0.018 0.081 0.018 0.126v0 6.513c-0 0.176-0.095 0.329-0.237 0.411l-0.002 0.001-5.468 3.149v6.241c-0 0.175-0.095 0.328-0.236 0.411l-0.002 0.001-11.416 6.57c-0.024 0.013-0.052 0.025-0.081 0.033l-0.003 0.001-0.030 0.013c-0.036 0.011-0.078 0.017-0.121 0.017s-0.085-0.006-0.125-0.018l0.003 0.001c-0.015-0.004-0.027-0.009-0.039-0.016l0.001 0.001c-0.031-0.011-0.057-0.021-0.082-0.033l0.004 0.002-11.413-6.57c-0.144-0.084-0.239-0.237-0.239-0.412v0-19.548c0-0.044 0.007-0.087 0.019-0.127l-0.001 0.003c0.004-0.015 0.013-0.025 0.018-0.040 0.009-0.029 0.019-0.053 0.030-0.076l-0.001 0.003c0.008-0.016 0.018-0.030 0.029-0.042l-0 0 0.042-0.057 0.047-0.034c0.018-0.015 0.034-0.030 0.052-0.043h0.001l5.708-3.285c0.068-0.040 0.15-0.064 0.237-0.064s0.169 0.024 0.239 0.065l-0.002-0.001 5.71 3.285c0.019 0.013 0.035 0.027 0.051 0.042l-0-0 0.048 0.034c0.016 0.018 0.025 0.038 0.042 0.057 0.012 0.012 0.022 0.026 0.031 0.041l0.001 0.001c0.010 0.020 0.020 0.044 0.029 0.069l0.001 0.004 0.016 0.040c0.011 0.035 0.018 0.076 0.018 0.118 0 0.002 0 0.004-0 0.006v-0 12.208l4.756-2.737v-6.241c0-0.001 0-0.002 0-0.002 0-0.043 0.006-0.085 0.017-0.125l-0.001 0.003c0.004-0.013 0.013-0.025 0.016-0.040 0.010-0.030 0.020-0.054 0.032-0.078l-0.002 0.004c0.009-0.015 0.023-0.025 0.032-0.042 0.015-0.019 0.027-0.038 0.042-0.054 0.014-0.013 0.029-0.025 0.045-0.035l0.001-0.001c0.018-0.013 0.033-0.029 0.052-0.040h0.001l5.708-3.286c0.068-0.040 0.15-0.064 0.237-0.064s0.169 0.024 0.239 0.065l-0.002-0.001 5.708 3.286c0.020 0.013 0.034 0.027 0.053 0.039 0.015 0.013 0.032 0.023 0.046 0.035 0.016 0.018 0.028 0.038 0.043 0.056 0.011 0.012 0.021 0.026 0.030 0.040l0.001 0.001c0.012 0.022 0.022 0.047 0.030 0.073l0.001 0.003c0.008 0.012 0.014 0.025 0.019 0.039l0 0.001z"></path>
            </svg>
          </motion.span>
          {/* Next.js SVG */}
          <motion.span 
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <svg fill="#007bff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#007bff" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <path d="M23.749 30.005c-0.119 0.063-0.109 0.083 0.005 0.025 0.037-0.015 0.068-0.036 0.095-0.061 0-0.021 0-0.021-0.1 0.036zM23.989 29.875c-0.057 0.047-0.057 0.047 0.011 0.016 0.036-0.021 0.068-0.041 0.068-0.047 0-0.027-0.016-0.021-0.079 0.031zM24.145 29.781c-0.057 0.047-0.057 0.047 0.011 0.016 0.037-0.021 0.068-0.043 0.068-0.048 0-0.025-0.016-0.020-0.079 0.032zM24.303 29.688c-0.057 0.047-0.057 0.047 0.009 0.015 0.037-0.020 0.068-0.041 0.068-0.047 0-0.025-0.016-0.020-0.077 0.032zM24.516 29.547c-0.109 0.073-0.147 0.12-0.047 0.068 0.067-0.041 0.181-0.131 0.161-0.131-0.043 0.016-0.079 0.043-0.115 0.063zM14.953 0.011c-0.073 0.005-0.292 0.025-0.484 0.041-4.548 0.412-8.803 2.86-11.5 6.631-1.491 2.067-2.459 4.468-2.824 6.989-0.129 0.88-0.145 1.14-0.145 2.333 0 1.192 0.016 1.448 0.145 2.328 0.871 6.011 5.147 11.057 10.943 12.927 1.043 0.333 2.136 0.563 3.381 0.704 0.484 0.052 2.577 0.052 3.061 0 2.152-0.24 3.969-0.771 5.767-1.688 0.276-0.14 0.328-0.177 0.291-0.208-0.88-1.161-1.744-2.323-2.323-3.495l-2.557-3.453-3.203-4.745c-1.068-1.588-2.14-3.172-3.229-4.744-0.011 0-0.025 2.109-0.031 4.681-0.011 4.505-0.011 4.688-0.068 4.792-0.057 0.125-0.151 0.229-0.276 0.287-0.099 0.047-0.188 0.057-0.661 0.057h-0.541l-0.141-0.088c-0.088-0.057-0.161-0.136-0.208-0.229l-0.068-0.141 0.005-6.271 0.011-6.271 0.099-0.125c0.063-0.077 0.141-0.14 0.229-0.187 0.131-0.063 0.183-0.073 0.724-0.073 0.635 0 0.74 0.025 0.907 0.208 1.296 1.932 2.588 3.869 3.859 5.812 2.079 3.152 4.917 7.453 6.312 9.563l2.537 3.839 0.125-0.083c1.219-0.813 2.328-1.781 3.285-2.885 2.016-2.308 3.324-5.147 3.767-8.177 0.129-0.88 0.145-1.141 0.145-2.333 0-1.193-0.016-1.448-0.145-2.328-0.871-6.011-5.147-11.057-10.943-12.928-1.084-0.343-2.199-0.577-3.328-0.697-0.303-0.031-2.371-0.068-2.631-0.041zM21.5 9.688c0.151 0.072 0.265 0.208 0.317 0.364 0.027 0.084 0.032 1.823 0.027 5.74l-0.011 5.624-0.989-1.52-0.995-1.521v-4.083c0-2.647 0.011-4.131 0.025-4.204 0.047-0.167 0.161-0.307 0.313-0.395 0.124-0.063 0.172-0.068 0.667-0.068 0.463 0 0.541 0.005 0.645 0.063z"></path>
            </svg>
          </motion.span>
          {/* Tailwind SVG */}
          <motion.span 
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12">
              <title>file_type_tailwind</title>
              <path d="M9,13.7q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q11.1,10.9,9,13.7ZM2,22.1q1.4-5.6,7-5.6c5.6,0,6.3,4.2,9.1,4.9q2.8.7,4.9-2.1-1.4,5.6-7,5.6c-5.6,0-6.3-4.2-9.1-4.9Q4.1,19.3,2,22.1Z" fill="#44a8b3" />
            </svg>
          </motion.span>
          {/* HTML5 SVG */}
          <motion.span 
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
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
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* Photoshop */}
          <motion.span
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.76 498.97" className="w-full h-full">
              <rect fill="#001e36" width="511.76" height="498.97" rx="90.62"/>
              <path fill="#31a8ff" d="M115.24,349.91V130.53c0-1.59.68-2.4,2.06-2.4,3.65,0,7,0,12-.17s10.47-.23,16.31-.34l18.54-.35q9.78-.17,19.39-.17,26.09,0,44,6.52a76.4,76.4,0,0,1,28.66,17.51,67.06,67.06,0,0,1,15.62,24.21A80.31,80.31,0,0,1,276.61,203q0,27.48-12.7,45.32a71.82,71.82,0,0,1-34.33,25.92c-14.42,5.38-30.45,7.2-48.07,7.2-5,0-8.58-.05-10.64-.17s-5.15-.17-9.27-.17v68.49a2.72,2.72,0,0,1-2.32,3.09,2.49,2.49,0,0,1-.77,0H117.64C116,352.65,115.24,351.74,115.24,349.91ZM161.6,169.33v71.55q4.46.35,8.24.34h11.33a80.56,80.56,0,0,0,24.55-3.92A37,37,0,0,0,223.23,226q6.69-7.89,6.69-22a34.74,34.74,0,0,0-5-18.88A32,32,0,0,0,210,172.93,63.68,63.68,0,0,0,185,168.64q-8.25,0-14.59.17t-8.76.52Z"/>
              <path fill="#31a8ff" d="M409.35,227.87a80,80,0,0,0-20.43-7.21,108.28,108.28,0,0,0-23.86-2.75,44.38,44.38,0,0,0-12.87,1.55,11.55,11.55,0,0,0-6.7,4.29,10.79,10.79,0,0,0-1.71,5.84,9.08,9.08,0,0,0,2.06,5.49,23.25,23.25,0,0,0,7.21,5.66,141.8,141.8,0,0,0,15.1,7,150,150,0,0,1,32.79,15.62,50,50,0,0,1,16.82,17.68,47.17,47.17,0,0,1,5,22,49.41,49.41,0,0,1-8.24,28.33,54.23,54.23,0,0,1-23.86,19.05Q375,357.3,352,357.3a140.51,140.51,0,0,1-29-2.75,92.44,92.44,0,0,1-21.8-6.87,4.44,4.44,0,0,1-2.41-4.12V306.49a2,2,0,0,1,.86-1.89,1.66,1.66,0,0,1,1.89.17A91.62,91.62,0,0,0,328,315.24a108.66,108.66,0,0,0,25.07,3.26q12,0,17.68-3.09a9.7,9.7,0,0,0,5.66-8.92q0-4.47-5.15-8.59T350.3,288a126.06,126.06,0,0,1-30.38-15.45,52.42,52.42,0,0,1-16.14-18,47.35,47.35,0,0,1-5-21.8A49.21,49.21,0,0,1,306,206.93a52.37,52.37,0,0,1,22.32-19.57q15.1-7.55,37.76-7.55a167.13,167.13,0,0,1,26.44,1.88,69.58,69.58,0,0,1,18.4,5,3.13,3.13,0,0,1,2.06,1.89,9.31,9.31,0,0,1,.34,2.57v34.68a2.3,2.3,0,0,1-1,2.06A3.33,3.33,0,0,1,409.35,227.87Z"/>
            </svg>
          </motion.span>
          {/* Adobe Illustrator */}
          <motion.span
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center transition duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511.45 498.66" className="w-full h-full">
              <rect fill="#300" width="511.45" height="498.66" rx="90.57"/>
              <path fill="#ff9a00" d="M247.84,299.26H168.58l-16.12,50.09a4,4,0,0,1-4.12,3.09H108.2q-3.44,0-2.4-3.78L174.42,151q1-3.09,2.06-7a74.51,74.51,0,0,0,1.37-13.9,2.11,2.11,0,0,1,1.8-2.4,2,2,0,0,1,.6,0H234.8c1.6,0,2.51.57,2.75,1.71L315.43,349c.69,2.28,0,3.43-2.06,3.43h-44.6a3.17,3.17,0,0,1-3.43-2.4ZM180.94,256h54.2q-2.05-6.87-4.8-15.44t-5.83-18.36l-6.18-19.55q-3.09-9.78-5.66-18.88T208,167.17h-.34a276.76,276.76,0,0,1-7.21,27.44q-4.8,15.45-9.78,31.57T180.94,256Z"/>
              <path fill="#ff9a00" d="M361.74,164.08a24.9,24.9,0,0,1-18.87-7.55,27.12,27.12,0,0,1-7.2-19.56,25.17,25.17,0,0,1,7.72-19,26.52,26.52,0,0,1,19-7.38q12.35,0,19.38,7.38a26.52,26.52,0,0,1,7,19,26.78,26.78,0,0,1-7.38,19.56A26.32,26.32,0,0,1,361.74,164.08ZM338.07,349V185c0-2.06.91-3.09,2.74-3.09H383c1.82,0,2.74,1,2.74,3.09V349c0,2.28-.91,3.43-2.74,3.43H341.16C339.1,352.44,338.07,351.29,338.07,349Z"/>
            </svg>
          </motion.span>
          {/* Adobe After Effects */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg"
            alt="After Effects"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* CapCut */}
          <motion.span
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: -5 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 512 509.659"
              className="w-full h-full"
            >
              <path fill="#fff" d="M116.971 2.475h278.058c62.971 0 114.494 51.522 114.494 114.494v275.722c0 62.971-51.523 114.493-114.494 114.493H116.971c-62.972 0-114.494-51.522-114.494-114.493V116.969c0-62.972 51.522-114.494 114.494-114.494z"/>
              <path fill="#999" fillRule="nonzero" d="M116.97-.001h278.06C459.366-.001 512 52.633 512 116.969v275.722c0 64.335-52.634 116.969-116.97 116.969H116.97C52.636 509.66 0 457.026 0 392.691V116.969C0 52.633 52.636-.001 116.97-.001zm278.06 4.953H116.97C55.364 4.952 4.953 55.363 4.953 116.969v275.722c0 61.605 50.411 112.017 112.017 112.017h278.06c61.607 0 112.017-50.411 112.017-112.017V116.969c0-61.607-50.41-112.017-112.017-112.017z"/>
              <path fill="#fff" fillRule="nonzero" d="M109.095 181.505c-.123 8.897 0 17.813 0 26.71a5.41 5.41 0 003.225 4.917 23898.407 23898.407 0 0084.108 41.646c-27.832 13.672-55.563 27.526-83.353 41.259a5.938 5.938 0 00-4.081 4.876v26.771c1.854 18.195 15.823 32.817 33.913 35.503 3.509.326 7.02.266 10.529.266l155.85.001a45.08 45.08 0 0011.224-.92 40.825 40.825 0 0026.137-20.015 63.699 63.699 0 004.288-11.226c15.997 8.325 32.341 16.079 48.462 24.179.385.291.857.447 1.343.447a2.266 2.266 0 002.265-2.265v-.016-27.669a4.695 4.695 0 00-3.143-4.079l-135.323-67.112c45.203-22.431 90.412-44.876 135.63-67.335a4.573 4.573 0 002.754-4.082v-27.628a2.183 2.183 0 00-3.142-1.673l-49.135 24.363a42.189 42.189 0 00-6.388-14.917 40.613 40.613 0 00-30.097-17.422l-167.133-.001c-19.615.91-35.688 15.918-37.933 35.424v-.002z"/>
              <path fill="#fff" fillRule="nonzero" d="M140.049 181.689a10.082 10.082 0 019.345-5.55h161.545l.106-.001c5.066 0 9.368 3.72 10.096 8.734.205 2.714.102 5.428 0 8.162l-90.597 44.891c-30.608-15.018-61.03-30.22-91.535-45.339.142-3.632-.633-7.53 1.04-10.897zM139.009 317.095a24846.007 24846.007 0 0191.351-45.319c30.322 14.773 60.521 29.954 90.802 44.89-.204 3.918.755 8.162-1.305 11.773a10.085 10.085 0 01-8.755 5.08h-.082l-161.605.002-.277.002a10.202 10.202 0 01-9.007-5.411c-1.796-3.386-.98-7.345-1.122-11.017z"/>
              <path fillRule="nonzero" d="M109.095 181.505c2.223-19.532 18.316-34.578 37.955-35.483l167.194-.001a40.612 40.612 0 0130.095 17.427 42.152 42.152 0 016.39 14.915l49.135-24.364a2.185 2.185 0 013.141 1.674v27.628l.001.096a4.571 4.571 0 01-2.837 4.229 177620.936 177620.936 0 00-135.63 67.336l135.324 66.948a4.695 4.695 0 013.142 4.08v27.685a2.266 2.266 0 01-3.613 1.821c-16.12-8.162-32.464-15.854-48.462-24.18a63.503 63.503 0 01-4.282 11.225 40.813 40.813 0 01-26.098 20.135 44.994 44.994 0 01-11.221.919l-155.833.003c-3.51 0-7.04 0-10.53-.266-18.089-2.705-32.049-17.363-33.869-35.565v-26.77a5.935 5.935 0 014.08-4.879c27.791-13.732 55.521-27.587 83.353-41.258a32412.61 32412.61 0 00-84.17-41.748 5.41 5.41 0 01-3.223-4.918c-.042-8.876-.185-17.792-.042-26.689zm30.975.184c-1.674 3.367-.898 7.263-1.041 10.896 30.608 15.12 60.99 30.321 91.536 45.339 30.185-14.963 60.384-29.927 90.596-44.89 0-2.714.123-5.428 0-8.162a10.203 10.203 0 00-10.096-8.734h-.106l-161.565.001a10.082 10.082 0 00-9.345 5.55h.021zm-1.041 135.406c.142 3.673-.654 7.631 1.122 11.039a10.204 10.204 0 009.284 5.405l161.667.002.081-.001c3.618 0 6.961-1.94 8.754-5.081 2.04-3.57 1.102-7.855 1.305-11.773-30.26-14.936-60.48-30.118-90.801-44.89a43915.126 43915.126 0 00-91.432 45.299h.02z"/>
            </svg>
          </motion.span>
          {/* Bootstrap */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
            alt="Bootstrap"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* React Native */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
            alt="React Native"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: -5 }}
          />
          {/* JavaScript */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
            alt="JavaScript"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* PHP */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"
            alt="PHP"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: -5 }}
          />
          {/* MySQL */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
            alt="MySQL"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          {/* Supabase */}
          <motion.img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg"
            alt="Supabase"
            className="skill-icon w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain"
            whileHover={{ scale: 1.1, rotate: -5 }}
          />
        </div>

        {/* Scroll Velocity Effect pada Judul */}
        <ScrollVelocity
          texts={["EXPERIENCE WITH ✦ "]}
          velocity={-34}
          followScroll={false}
          className="text-gray-300 py-8 lg:py-12 font-bold text-2xl md:text-3xl lg:text-4xl tracking-widest uppercase"
          damping={50}
          stiffness={400}
          numCopies={28}
          parallaxClassName="w-full overflow-hidden pointer-events-none"
          scrollerClassName="flex whitespace-nowrap pointer-events-none select-none"
        />
      </section>
      <section id="journey" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            className="text-center mb-10 lg:mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-block">
            <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-400">Career Line Map</h2>
            <div className="items-start mt-2 w-16 lg:w-20 h-1 lg:h-1.5 bg-cyan-400 rounded-lg" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            <motion.div
              ref={workTimelineRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="rounded-3xl border border-cyan-300/30 bg-white/[0.045] shadow-[0_20px_55px_rgba(34,211,238,0.16)] backdrop-blur-2xl backdrop-saturate-150 p-4 lg:p-5"
            >
              <div className="flex items-center mb-5">
                <h3 className="text-lg font-semibold text-cyan-100">Pengalaman Kerja</h3>
              </div>

              <div className="relative pb-2">
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-700/75" />
                <motion.div
                  className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-300 via-cyan-400 to-cyan-500"
                  style={{ scaleY: workLineFill, transformOrigin: "top" }}
                />

                {workJourney.map((item, itemIndex) => {
                  const workThreshold = (itemIndex + 0.36) / workJourney.length;
                  const isWorkActive = workLineValue >= workThreshold;

                  return (
                    <motion.article
                      key={`work-${item.title}-${itemIndex}`}
                      className="relative mb-8 last:mb-0 md:grid md:grid-cols-2"
                      initial={{ opacity: 0, y: 18, x: itemIndex % 2 === 0 ? -12 : 12 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.32 }}
                    >
                      <motion.span
                        className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-6 h-3.5 w-3.5 rounded-full border-2 bg-slate-950"
                        animate={{
                          borderColor: isWorkActive ? "rgba(103,232,249,1)" : "rgba(100,116,139,0.9)",
                          boxShadow: isWorkActive
                            ? "0 0 12px rgba(34,211,238,0.75)"
                            : "0 0 0px rgba(34,211,238,0)",
                        }}
                        transition={{ duration: 0.34, ease: "easeInOut" }}
                      />
                      <motion.span
                        className={`hidden md:block absolute top-[31px] h-[2px] w-8 ${
                          itemIndex % 2 === 0 ? "right-1/2" : "left-1/2"
                        }`}
                        animate={{ backgroundColor: isWorkActive ? "rgba(103,232,249,0.85)" : "rgba(71,85,105,0.65)" }}
                        transition={{ duration: 0.34, ease: "easeInOut" }}
                      />

                      <motion.div
                        className={`ml-10 md:ml-0 rounded-2xl p-4 backdrop-blur-xl backdrop-saturate-150 ${
                          itemIndex % 2 === 0
                            ? "md:col-start-1 md:mr-10 md:text-right"
                            : "md:col-start-2 md:ml-10"
                        }`}
                        animate={{
                          opacity: isWorkActive ? 1 : 0.6,
                          borderColor: isWorkActive ? "rgba(103,232,249,0.42)" : "rgba(100,116,139,0.24)",
                          backgroundColor: isWorkActive ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.3)",
                          boxShadow: isWorkActive
                            ? "0 14px 34px rgba(34,211,238,0.12)"
                            : "0 8px 20px rgba(15,23,42,0.2)",
                        }}
                        transition={{ duration: 0.42, ease: "easeInOut" }}
                        style={{ borderWidth: 1 }}
                      >
                        <motion.p
                          className="text-xs uppercase tracking-wide"
                          animate={{ color: isWorkActive ? "rgba(103,232,249,0.9)" : "rgba(148,163,184,0.7)" }}
                          transition={{ duration: 0.35 }}
                        >
                          {item.period}
                        </motion.p>
                        <motion.h4
                          className="mt-1 text-base font-semibold"
                          animate={{ color: isWorkActive ? "#ffffff" : "rgba(203,213,225,0.85)" }}
                          transition={{ duration: 0.35 }}
                        >
                          {item.title}
                        </motion.h4>
                        {item.organization && (
                          <motion.p
                            className="text-sm"
                            animate={{ color: isWorkActive ? "rgba(207,250,254,0.92)" : "rgba(148,163,184,0.78)" }}
                            transition={{ duration: 0.35 }}
                          >
                            {item.organization}
                          </motion.p>
                        )}
                        <ul className="mt-2 space-y-1.5 text-sm">
                          {item.points.map((point, pointIndex) => (
                            <motion.li
                              key={`work-point-${itemIndex}-${pointIndex}`}
                              animate={{ color: isWorkActive ? "rgba(226,232,240,0.95)" : "rgba(148,163,184,0.74)" }}
                              transition={{ duration: 0.35 }}
                            >
                              • {point}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              ref={learningTimelineRef}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
              className="rounded-3xl border border-cyan-300/30 bg-white/[0.045] shadow-[0_20px_55px_rgba(34,211,238,0.16)] backdrop-blur-2xl backdrop-saturate-150 p-4 lg:p-5"
            >
              <div className="flex items-center mb-5">
                <h3 className="text-lg font-semibold text-cyan-100">Pelatihan dan Lomba</h3>
              </div>

              <div className="relative pb-2">
                <div className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-slate-700/75" />
                <motion.div
                  className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-sky-300 via-cyan-400 to-cyan-500"
                  style={{ scaleY: learningLineFill, transformOrigin: "top" }}
                />

                {learningJourney.map((item, itemIndex) => {
                  const learningThreshold = (itemIndex + 0.36) / learningJourney.length;
                  const isLearningActive = learningLineValue >= learningThreshold;

                  return (
                    <motion.article
                      key={`learn-${item.title}-${itemIndex}`}
                      className="relative mb-8 last:mb-0 md:grid md:grid-cols-2"
                      initial={{ opacity: 0, y: 18, x: itemIndex % 2 === 0 ? -12 : 12 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: 0.32 }}
                    >
                      <motion.span
                        className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-6 h-3.5 w-3.5 rounded-full border-2 bg-slate-950"
                        animate={{
                          borderColor: isLearningActive ? "rgba(103,232,249,1)" : "rgba(100,116,139,0.9)",
                          boxShadow: isLearningActive
                            ? "0 0 12px rgba(34,211,238,0.75)"
                            : "0 0 0px rgba(34,211,238,0)",
                        }}
                        transition={{ duration: 0.34, ease: "easeInOut" }}
                      />
                      <motion.span
                        className={`hidden md:block absolute top-[31px] h-[2px] w-8 ${
                          itemIndex % 2 === 0 ? "right-1/2" : "left-1/2"
                        }`}
                        animate={{ backgroundColor: isLearningActive ? "rgba(103,232,249,0.85)" : "rgba(71,85,105,0.65)" }}
                        transition={{ duration: 0.34, ease: "easeInOut" }}
                      />

                      <motion.div
                        className={`ml-10 md:ml-0 rounded-2xl p-4 backdrop-blur-xl backdrop-saturate-150 ${
                          itemIndex % 2 === 0
                            ? "md:col-start-1 md:mr-10 md:text-right"
                            : "md:col-start-2 md:ml-10"
                        }`}
                        animate={{
                          opacity: isLearningActive ? 1 : 0.6,
                          borderColor: isLearningActive ? "rgba(103,232,249,0.42)" : "rgba(100,116,139,0.24)",
                          backgroundColor: isLearningActive ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.3)",
                          boxShadow: isLearningActive
                            ? "0 14px 34px rgba(34,211,238,0.12)"
                            : "0 8px 20px rgba(15,23,42,0.2)",
                        }}
                        transition={{ duration: 0.42, ease: "easeInOut" }}
                        style={{ borderWidth: 1 }}
                      >
                        {item.tag && (
                          <motion.p
                            className="inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide"
                            animate={{
                              backgroundColor: isLearningActive ? "rgba(103,232,249,0.15)" : "rgba(100,116,139,0.12)",
                              color: isLearningActive ? "rgba(207,250,254,0.95)" : "rgba(148,163,184,0.82)",
                            }}
                            transition={{ duration: 0.35 }}
                          >
                            {item.tag}
                          </motion.p>
                        )}
                        <motion.p
                          className="text-xs uppercase tracking-wide"
                          animate={{ color: isLearningActive ? "rgba(103,232,249,0.9)" : "rgba(148,163,184,0.7)" }}
                          transition={{ duration: 0.35 }}
                        >
                          {item.period}
                        </motion.p>
                        <motion.h4
                          className="mt-1 text-base font-semibold"
                          animate={{ color: isLearningActive ? "#ffffff" : "rgba(203,213,225,0.85)" }}
                          transition={{ duration: 0.35 }}
                        >
                          {item.title}
                        </motion.h4>
                        {item.organization && (
                          <motion.p
                            className="text-sm"
                            animate={{ color: isLearningActive ? "rgba(207,250,254,0.92)" : "rgba(148,163,184,0.78)" }}
                            transition={{ duration: 0.35 }}
                          >
                            {item.organization}
                          </motion.p>
                        )}
                        <ul className="mt-2 space-y-1.5 text-sm">
                          {item.points.map((point, pointIndex) => (
                            <motion.li
                              key={`learn-point-${itemIndex}-${pointIndex}`}
                              animate={{ color: isLearningActive ? "rgba(226,232,240,0.95)" : "rgba(148,163,184,0.74)" }}
                              transition={{ duration: 0.35 }}
                            >
                              • {point}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    </motion.article>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-10 md:py-12">
        <div className="w-full px-3 md:px-4">
          <div className="mb-6 md:mb-8 text-center">
            <div className="inline-block">
              <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-400">Featured Project</h2>
              <div className="float-right mt-2 w-16 lg:w-20 h-1 lg:h-1.5 bg-cyan-400 rounded-lg" />
            </div>
          </div>

          {displayedProjects && displayedProjects.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 auto-rows-[220px] md:auto-rows-[260px] grid-flow-dense gap-3 md:gap-4 max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {displayedProjects.map((project: any, index: number) => {
                const coverSrc = project?.images?.[0] || "/assets/images/hero.jpg";
                
                let spanClass = "col-span-1 row-span-1";
                
                // 5 Item pertama pola identik dengan referensi (Bento Box 4 kolom)
                if (index === 0) spanClass = "md:col-span-2 md:row-span-2"; // Kiri Besar (50% width)
                else if (index === 1) spanClass = "md:col-span-2 md:row-span-1"; // Kanan Atas Lebar (50% width)
                else if (index === 2) spanClass = "md:col-span-1 md:row-span-1"; // Kanan Bawah Kiri (Kecil)
                else if (index === 3) spanClass = "md:col-span-1 md:row-span-1"; // Kanan Bawah Kanan (Kecil)
                else if (index === 4) spanClass = "md:col-span-2 md:row-span-1"; // Item Ke-5 (Lebar, Kiri bawah)
                // Sisanya pola abstrak agar "Show More" terasa random
                else {
                  // Daftar variasi ukuran acak agar tidak terlalu rapi
                  const randomSpans = [
                    "md:col-span-1 md:row-span-2", // Tinggi
                    "md:col-span-2 md:row-span-1", // Lebar
                    "md:col-span-1 md:row-span-1", // Kecil
                    "md:col-span-2 md:row-span-2", // Besar
                    "md:col-span-1 md:row-span-1", // Kecil
                    "md:col-span-3 md:row-span-1", // Sangat Lebar
                    "md:col-span-1 md:row-span-1", // Kecil
                    "md:col-span-2 md:row-span-1", // Lebar
                  ];
                  // Pilih berdasarkan index secara deterministik agar Next.js Hydration tidak error
                  spanClass = randomSpans[(index - 5) % randomSpans.length];
                }
                
                return (
                  <Link
                    href={`/projects/${project._id}`}
                    key={project._id || index}
                    className={`block ${spanClass}`}
                  >
                    <motion.figure
                      className={`group relative h-full w-full overflow-hidden rounded-xl bg-slate-950`}
                      initial={{ opacity: 0.84 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.38, delay: index * 0.04 }}
                      whileHover={{ scale: 0.98 }}
                    >
                      <Image
                        src={coverSrc}
                        alt={project.title || "Project cover"}
                        fill
                        quality={100}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-all duration-500 opacity-60 group-hover:opacity-100 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-500 group-hover:opacity-60" />
                      <div className="absolute inset-0 ring-1 ring-cyan-300/20 duration-500 group-hover:ring-cyan-400/50" />

                      <div className="absolute top-3 left-3">
                        <span className="text-[11px] px-2.5 py-1 rounded-md border border-white/20 bg-slate-900/60 backdrop-blur-sm text-cyan-100 transition-colors duration-500 group-hover:border-white/40 group-hover:bg-slate-900/40">
                          {project.status || "Active"}
                        </span>
                      </div>

                      <figcaption className="absolute bottom-0 left-0 right-0 p-3 md:p-4 transform transition-all duration-500">
                        <p className="text-white/80 font-medium text-sm md:text-base line-clamp-1 transition-colors duration-500 group-hover:text-white">
                          {project.title || "Untitled Project"}
                        </p>
                      </figcaption>
                    </motion.figure>
                  </Link>
                );
              })}
            </motion.div>
          ) : (
            <div className="h-[40vh] flex items-center justify-center">
              <p className="text-center">No projects found. Add one in the admin panel!</p>
            </div>
          )}

          {hasMoreProjects && (
            <div className="mt-5 md:mt-6 flex justify-center">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/25 bg-slate-900/50 backdrop-blur-md text-cyan-100 hover:text-white transition-colors duration-300 group text-sm"
              >
                <span>{showAllProjects ? "Show Less" : "Show More"}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showAllProjects ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {showAllProjects ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  )}
                </svg>
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
