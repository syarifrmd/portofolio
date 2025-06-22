'use client'
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Github, ExternalLink, Calendar, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

async function getProject(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl = baseUrl ? `${baseUrl}/api/projects?id=${id}` : `/api/projects?id=${id}`;
    
    const res = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch project:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    if (data.success && data.data) return data.data;
    
    console.error('API returned error:', data.message);
    return null;
  } catch (error) {
    console.error('Error in getProject:', error);
    return null;
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [projectId, setProjectId] = useState<string>('');
  const [openLightbox, setOpenLightbox] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      // Await the params to get the id
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setProjectId(id);
      
      const projectData = await getProject(id);
      if (!projectData) {
        notFound();
      }
      setProject(projectData);
      setLoading(false);
    };
    fetchProject();
  }, [params]);

  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-300">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return notFound();

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      
      {/* Animated Glow Elements */}
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
      </div>
      
      <div className="relative z-10 py-8 px-4">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700/50 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            
            {/* Hero Section with Image Carousel */}
            <div className="relative p-8 pb-0">
              {project.images && project.images.length > 0 ? (
                <div 
                  className="relative h-80 mb-8 rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => setOpenLightbox(true)}
                >
                  {/* Main Image */}
                  <Image
                    src={project.images[currentImageIndex]}
                    alt={`${project.title} image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    unoptimized
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                  
                  {/* Navigation Buttons */}
                  {project.images.length > 1 && (
                    <>
                      {/* Previous Button */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      >
                        <ChevronLeft className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
                      </button>
                      
                      {/* Next Button */}
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                      >
                        <ChevronRight className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
                      </button>
                      
                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {project.images.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-80 mb-8 rounded-2xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-slate-600 rounded-full flex items-center justify-center">
                        <Tag className="w-8 h-8 text-slate-400" />
                      </div>
                      <span className="text-slate-400 text-lg font-medium">No Images Available</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Image Thumbnails */}
              {project.images && project.images.length > 1 && (
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                  {project.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => goToImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                        idx === currentImageIndex 
                          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' 
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="px-8 pb-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
                    {project.category}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'Completed' 
                      ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' 
                      : project.status === 'In Progress' 
                      ? 'bg-amber-900/50 text-amber-300 border border-amber-700/50' 
                      : 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      project.status === 'Completed' ? 'bg-emerald-400' :
                      project.status === 'In Progress' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    {project.status}
                  </span>
                </div>
                
                <h1 className="text-4xl font-bold mb-4 text-gradient">
                  {project.title}
                </h1>
                
                {/* Project Date */}
                {project.startDate && (
                  <div className="flex items-center gap-2 mb-4 text-neutral-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      Created: {new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                
                <p className="text-xl text-neutral-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier"> 
                      <path d="M19.6471 15.5357H4.35294M19.6471 15.5357V8C19.6471 6.11438 19.6471 5.17157 19.0613 4.58579C18.4755 4 17.5327 4 15.6471 4H8.35294C6.46732 4 5.52451 4 4.93873 4.58579C4.35294 5.17157 4.35294 6.11438 4.35294 8V15.5357M19.6471 15.5357L21.3911 17.3358C21.4356 17.3818 21.4579 17.4048 21.4787 17.4276C21.7998 17.7802 21.9843 18.2358 21.999 18.7124C22 18.7433 22 18.7753 22 18.8393C22 18.9885 22 19.0631 21.996 19.1261C21.9325 20.1314 21.1314 20.9325 20.1261 20.996C20.0631 21 19.9885 21 19.8393 21H4.16068C4.01148 21 3.93688 21 3.87388 20.996C2.86865 20.9325 2.06749 20.1314 2.00398 19.1261C2 19.0631 2 18.9885 2 18.8393C2 18.7753 2 18.7433 2.00096 18.7124C2.01569 18.2358 2.20022 17.7802 2.52127 17.4276C2.54208 17.4048 2.56438 17.3818 2.60888 17.3358L4.35294 15.5357" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> 
                      <path d="M9.5 18.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path> 
                      <path d="M12.75 6.75C12.75 7.16421 12.4142 7.5 12 7.5C11.5858 7.5 11.25 7.16421 11.25 6.75C11.25 6.33579 11.5858 6 12 6C12.4142 6 12.75 6.33579 12.75 6.75Z" fill="currentColor"></path> 
                    </g>
                  </svg>
                  Technology Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.techStack && project.techStack.map((tech: string) => (
                    <span 
                      key={tech} 
                      className="tech-badge"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.githubUrls && project.githubUrls.map((url: string, idx: number) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/20 group"
                  >
                    <Github className="w-4 h-4 transition-transform group-hover:rotate-12" />
                    <span className="font-semibold">
                      GitHub {project.githubUrls.length > 1 ? `${idx + 1}` : ''}
                    </span>
                  </a>
                ))}
                
                {project.liveUrls && project.liveUrls.map((url: string, idx: number) => (
                  <a 
                    key={idx} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 group font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <span>
                      Live Demo {project.liveUrls.length > 1 ? `${idx + 1}` : ''}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={openLightbox}
        close={() => setOpenLightbox(false)}
        slides={project?.images?.map((img: string) => ({ src: img })) || []}
        index={currentImageIndex}
        on={{
          view: ({ index: currentIndex }) => setCurrentImageIndex(currentIndex),
        }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
      />

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}