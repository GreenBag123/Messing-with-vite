import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

const BUBBLES = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  width: Math.random() * 40 + 10,
  height: Math.random() * 40 + 10,
  top: Math.random() * 100,
  left: Math.random() * 100,
  xDrift: Math.random() * 20 - 10,
  duration: Math.random() * 5 + 3,
}));

export default function AboutMe() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme("aboutme");
    document.title = "About Me";
  }, [setTheme]);

  return (
    <>
      <div className="fixed inset-0 overflow-hidden z-0 bg-blue-400">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-blue-600 opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-blue-500 opacity-40" />

        {BUBBLES.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: bubble.width,
              height: bubble.height,
              top: `${bubble.top}%`,
              left: `${bubble.left}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, bubble.xDrift, 0],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-center max-w-2xl rounded-3xl p-8 shadow-2xl ${theme.card}`}
        >
          <h1 className="text-5xl font-bold mb-6 text-white">About Me</h1>
          <p className="text-xl mb-6 text-white">I'm a passionate developer who loves creating immersive digital experiences.</p>
          <p className="text-lg text-white">
            When I'm not coding, you can find me exploring new technologies, contributing to open source, or enjoying the outdoors.
          </p>

          <div className="flex justify-center mt-12">
            <Link to="/" className={`px-6 py-3 rounded-full transition ${theme.button}`}>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
