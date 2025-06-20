"use client";

import Image from 'next/image'
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import React from "react";

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  status: 'Completed' | 'In Progress' | 'Planned';
  githubUrl?: string;
  liveUrl?: string;
  image: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 100, mass: 0.5 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 100, mass: 0.5 });

  const rotateX = useTransform(mouseY, [-150, 150], [25, -25]);
  const rotateY = useTransform(mouseX, [-150, 150], [-25, 25]);

  const cardVariants: Variants = {
    initial: {
      scale: 0.9,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="project-card-container"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
    >
      <motion.div
        className="project-card"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Image Background */}
        <div style={{ transform: "translateZ(20px)" }} className="absolute inset-0">
          {project.image && project.image.trim() !== "" ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover rounded-xl"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-medium">No Image</span>
            </div>
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20 rounded-xl" />
        </div>

        {/* Text Content */}
        <div style={{ transform: "translateZ(50px)" }} className="absolute bottom-4 left-4 text-white">
          <p className="text-sm font-light text-white">{project.category}</p>
          <h3 className="text-xl font-bold">{project.title}</h3>
        </div>

        {/* Technologies on Hover */}
        <div style={{ transform: "translateZ(60px)" }} className="project-card-tech">
          <h4 className="text-lg font-semibold mb-2">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2 justify-center px-4">
            {(project.techStack || []).map((tech: string) => (
              <span key={tech} className="tech-badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectCard; 