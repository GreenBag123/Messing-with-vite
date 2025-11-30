import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

export default function Productivity() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme("productivity");
    document.title = "Productivity & Content Creation";
  }, [setTheme]);

  const works = ["Integration", "Swimming", "Trek Recaps", "Paper pens", "Sketch", "Meme"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      <div className={`min-h-screen ${theme.background} py-12 px-4 sm:px-6 lg:px-8`}>
        <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>Content Creation & Editing</h1>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8" />
            <p className={`text-xl ${theme.text} opacity-90 max-w-2xl mx-auto leading-relaxed`}>
              I make magic happen. Transforming ideas into engaging content that connects and inspires.
            </p>
          </motion.div>

          <motion.div className={`${theme.card} rounded-2xl shadow-2xl p-8`} variants={itemVariants}>
            <h2 className={`text-2xl font-semibold ${theme.text} mb-8 text-center`}>Featured Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {works.map((work) => (
                <motion.div
                  key={work}
                  className="bg-gradient-to-r from-emerald-900/50 to-gray-800/50 rounded-xl p-6 text-center hover:from-emerald-800/70 hover:to-gray-700/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-emerald-600/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                >
                  <h3 className={`text-lg font-medium ${theme.text}`}>{work}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <Link
              to="/"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md ${theme.button} transition-colors duration-200`}
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
