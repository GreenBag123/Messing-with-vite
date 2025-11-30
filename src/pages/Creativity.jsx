import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

const HALO_RINGS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  width: Math.random() * 200 + 80,
  height: Math.random() * 200 + 80,
  top: Math.random() * 100,
  left: Math.random() * 100,
  duration: 6 + Math.random() * 4,
}));

export default function Creativity() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme("default");
    document.title = "Creativity";
  }, [setTheme]);

  const ideas = ["Storyboards", "Concept art", "Motion sketches", "Palette exploration", "Microinteractions"];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-cyan-600 via-blue-700 to-black text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {HALO_RINGS.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute rounded-full border border-white/30"
            style={{
              width: ring.width,
              height: ring.height,
              top: `${ring.top}%`,
              left: `${ring.left}%`,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <motion.h1
          className="text-5xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Creativity Lab
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ideas.map((idea, idx) => (
            <motion.div
              key={idea}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-2">{idea}</h3>
              <p className="text-sm text-white/80">Explorations, sketches, and motion tests that fuel the projects.</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/" className={`inline-flex items-center px-6 py-3 rounded-md ${theme.button}`}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
