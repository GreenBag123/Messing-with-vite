import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

const FLOATING_PIXELS = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  color: ["#7cfbde", "#baff8f", "#9cd3ff", "#e2a7ff"][i % 4],
  left: Math.random() * 100,
  top: Math.random() * 100,
  xDrift: Math.random() * 12 - 6,
  duration: Math.random() * 3 + 3,
}));

export default function MyWorks() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setTheme("myworks");
    document.title = "My Works";
  }, [setTheme]);

  const projects = [
    {
      id: 1,
      title: "Founder OS",
      description: "Dashboard that fuses CRM, ops rituals, and weekly scorecards for solo founders.",
      tech: ["Next.js", "Supabase", "Stripe", "Framer Motion"],
      impact: "+32% weekly activation for early users",
    },
    {
      id: 2,
      title: "Motion Library",
      description: "Reusable motion patterns (micro-interactions, page transitions) packaged for teams.",
      tech: ["React", "Framer Motion", "Storybook"],
      impact: "Cut prototype time from days to hours",
    },
    {
      id: 3,
      title: "Creator Delivery Engine",
      description: "Automations that take raw ideas to multi-platform posts with AI-assisted edits.",
      tech: ["Node.js", "OpenAI", "FFmpeg", "Cloudflare Workers"],
      impact: "5x content throughput; consistent brand tone",
    },
    {
      id: 4,
      title: "Design Sandbox",
      description: "Palette/spacing system with tokens and live previews to keep teams in sync.",
      tech: ["Tailwind", "Radix", "Figma Tokens", "Vite"],
      impact: "Reduced design drift; one source of truth",
    },
  ];

  const quickWins = ["Live dashboards", "3D hero moments", "Notion → UI bridges", "API-first thinking", "Performance first"];

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_70%_15%,#3c2d5c_0%,#110a1f_35%,#070812_75%)] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 border border-emerald-300/30"
              style={{
                left: `${(i % 15) * 7}%`,
                top: `${Math.floor(i / 15) * 8}%`,
              }}
            />
          ))}
        </div>

        {FLOATING_PIXELS.map((pixel) => (
          <motion.div
            key={pixel.id}
            className="absolute w-3 h-3"
            style={{
              backgroundColor: pixel.color,
              left: `${pixel.left}%`,
              top: `${pixel.top}%`,
            }}
            animate={{
              y: [0, -18, 0],
              x: [0, pixel.xDrift, 0],
            }}
            transition={{
              duration: pixel.duration,
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
          className="max-w-5xl w-full space-y-10"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-200">Shiproom</h1>
            <p className="text-emerald-100/80 text-lg max-w-3xl mx-auto">
              Product design and engineering with a bias to ship. Here are the builds that moved needles, not just pixels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className={`p-6 rounded-2xl border border-emerald-200/20 text-left ${theme.card}`}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-emerald-100">{project.title}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 border border-emerald-200/30">
                    {project.impact}
                  </span>
                </div>
                <p className="text-emerald-50/80 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((stack) => (
                    <span
                      key={stack}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-100/90"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="rounded-2xl border border-emerald-200/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-emerald-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-200/70">Quick hits</p>
              <h4 className="text-xl font-semibold">Things I can plug into your stack next sprint</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickWins.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/25 text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="flex justify-center">
            <Link to="/" className={`px-6 py-3 rounded-full ${theme.button}`}>
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
