import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  Wrench,
  Clock3,
  GitBranch,
  Code2,
  BarChart3,
  Lightbulb,
} from "lucide-react";

import maintenanceImage from "../../assets/images/case-study-maintenance.png";

export default function EnhancedCaseStudies() {

  const particles = useMemo(
  () =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
  []
);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* ================= LEFT IMAGE ================= */}
      <motion.div
        className="relative flex justify-center items-center translate-x-16 overflow-visible"
        animate={{
        y: [0, -18, 0],
        rotate: [0, 1.2, 0, -1.2, 0],
        scale: [1, 1.015, 1],
      }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >

      <motion.div
      className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/20 blur-[120px]"
      animate={{
        opacity: [0.2, 0.45, 0.2],
        scale: [0.95, 1.08, 0.95],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />  

      {/* Floating Green Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-green-400 shadow-[0_0_18px_#22c55e]"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -120],
            opacity: [0, 1, 0],
            scale: [0.2, 1.2, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

        {/* Green Glow */}
        

        <img
          src={maintenanceImage}
          alt="Case Studies Coming Soon"
          className="relative z-10
            w-[90%]
            max-w-none
            object-contain
            drop-shadow-[0_0_100px_rgba(34,197,94,0.35)]"
        />
      </motion.div>
        {/* ================= RIGHT CONTENT ================= */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-400 mb-6">
            <Wrench size={18} />
            COMING SOON
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Case Studies
            <br />
            <span className="text-green-400">
              Under Construction
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-neutral-400 leading-8 max-w-xl mb-10">
            I'm building a premium Case Studies experience featuring real-world
            cloud architectures, Kubernetes deployments, DevOps workflows,
            security implementations, detailed walkthroughs, metrics, and
            infrastructure diagrams.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-green-500/50 transition">
              <GitBranch className="text-green-400 mb-3" size={28} />
              <h3 className="text-white font-semibold">
                Architectures
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                Real infrastructure diagrams
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-green-500/50 transition">
              <Code2 className="text-green-400 mb-3" size={28} />
              <h3 className="text-white font-semibold">
                Walkthroughs
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                Step-by-step implementation
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-green-500/50 transition">
              <BarChart3 className="text-green-400 mb-3" size={28} />
              <h3 className="text-white font-semibold">
                Metrics
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                Performance & impact analysis
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-green-500/50 transition">
              <Lightbulb className="text-green-400 mb-3" size={28} />
              <h3 className="text-white font-semibold">
                Learnings
              </h3>
              <p className="text-neutral-500 text-sm mt-1">
                Challenges & best practices
              </p>
            </div>
          </div>

          {/* Bottom Notice */}
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5 flex items-start gap-4">
            <Clock3
              className="text-green-400 mt-1 flex-shrink-0"
              size={24}
            />

            <div>
              <h3 className="text-white font-semibold">
                Currently Building
              </h3>

              <p className="text-neutral-400 mt-1 leading-7">
                This section is being crafted with the same level of detail as
                the Projects and Blog sections. It will include interactive
                architecture diagrams, implementation guides, deployment
                workflows, and production-ready case studies.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}