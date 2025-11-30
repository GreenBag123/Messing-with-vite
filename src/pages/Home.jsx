import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

const Pixel = ({
  size,
  color,
  angle,
  distance,
  zDistance,
  rotateX,
  rotateY,
  pixelPhase,
  pixelIntensity,
  driftX,
  driftY,
}) => {
  const offsetX = useTransform(pixelPhase, [0, 1], [0, Math.cos(angle) * distance + driftX]);
  const offsetY = useTransform(pixelPhase, [0, 1], [0, Math.sin(angle) * distance + driftY]);
  const offsetZ = useTransform(pixelPhase, [0, 1], [0, -zDistance]);

  const scale = useTransform([pixelPhase, pixelIntensity], ([phase, intensity]) => 0.3 + (phase * 1.3) * intensity);

  const opacity = useTransform([pixelPhase, pixelIntensity], ([phase, intensity]) => {
    if (phase < 0.8) return phase * intensity;
    return (1 - phase) * intensity;
  });

  return (
    <motion.div
      className="absolute rounded-sm pixel"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: "50%",
        top: "50%",
        x: offsetX,
        y: offsetY,
        z: offsetZ,
        scale,
        opacity,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
    />
  );
};

const ImpactCircle = ({ phase, size = 100 }) => {
  const scale = useTransform(phase, [0, 0.2, 1], [0, 2.5, 6]);
  const opacity = useTransform(phase, [0, 0.05, 0.6, 1], [1, 0.9, 0.4, 0]);
  const blur = useTransform(phase, [0, 0.3, 1], ["0px", "8px", "20px"]);

  return (
    <>
      <motion.div
        className="absolute rounded-full impact-circle"
        style={{
          width: size,
          height: size,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          scale,
          opacity,
          filter: blur,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.2) 60%, transparent 80%)",
          border: "2px solid rgba(255,255,255,0.6)",
          boxShadow: "0 0 60px rgba(255,255,255,0.6)",
          zIndex: 20,
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
          scale: useTransform(phase, [0, 0.4, 1], [0, 3, 7]),
          opacity: useTransform(phase, [0, 0.5, 1], [0.5, 0.2, 0]),
          border: "1px solid rgba(255,255,255,0.3)",
          zIndex: 19,
        }}
      />
    </>
  );
};

const Crack = ({ angle, length, originX = 0, originY = 0, scale, opacity, isMain = false, widthBase }) => {
  const crackWidth = useTransform(scale, [0, 1], [0, widthBase]);
  const crackLength = useTransform(scale, [0, 1], [0, length]);

  return (
    <motion.div
      className="absolute crack"
      style={{
        width: crackWidth,
        height: crackLength,
        background: isMain
          ? "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(124,251,222,0.4) 40%, rgba(255,255,255,0) 100%)"
          : "linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(124,251,222,0.25) 50%, rgba(255,255,255,0) 100%)",
        left: `calc(50% + ${originX}px)`,
        top: `calc(50% + ${originY}px)`,
        rotate: angle,
        opacity,
        transformOrigin: "center top",
        borderRadius: "1px",
        boxShadow: isMain
          ? "0 0 20px rgba(124,251,222,0.45), 0 0 60px rgba(255,255,255,0.35)"
          : "0 0 12px rgba(124,251,222,0.25)",
        mixBlendMode: "screen",
        filter: "drop-shadow(0 0 6px rgba(255,255,255,0.2))",
        zIndex: 14,
      }}
    />
  );
};

const GlassParticle = ({ size, initialX, initialY, phase, xOffset, rotationAngle, clipPath, widthFactor, heightFactor, colorAlpha }) => {
  const x = useTransform(phase, [0, 1], [0, xOffset]);
  const y = useTransform(phase, [0, 1], [0, typeof window !== "undefined" ? window.innerHeight + 200 : 800]);
  const rotate = useTransform(phase, [0, 1], [0, rotationAngle]);
  const opacity = useTransform(phase, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: size * widthFactor,
        height: size * heightFactor,
        backgroundColor: `rgba(255, 255, 255, ${colorAlpha})`,
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
        left: `calc(50% + ${initialX}px)`,
        top: `calc(50% + ${initialY}px)`,
        x,
        y,
        rotate,
        opacity,
        transformStyle: "preserve-3d",
        clipPath,
        boxShadow: "0 0 8px rgba(255, 255, 255, 0.4)",
        zIndex: 16,
      }}
    />
  );
};

const GlassLayer = ({ phase }) => {
  const opacity = useTransform(phase, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0]);
  const blur = useTransform(phase, [0, 0.5, 1], [0, 8, 15]);
  const scale = useTransform(phase, [0, 0.5, 1], [1, 1.05, 1.1]);

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        scale,
        backdropFilter: blur,
        WebkitBackdropFilter: blur,
        background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(200, 220, 255, 0.1) 70%)",
        zIndex: 15,
      }}
    />
  );
};

const ShatterEffect = ({ progress, revealElement }) => {
  return (
    <motion.div
      className="absolute inset-0 z-40"
      style={{
        clipPath: useTransform(progress, [0, 1], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]),
      }}
    >
      {revealElement}
    </motion.div>
  );
};

const SectionButton = ({ section, index, revealPhase, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);

  const entry = useTransform(revealPhase, [0, 0.25 + index * 0.04, 1], [0, 0, 1]);
  const tilt = useTransform(entry, [0, 1], [index % 2 === 0 ? -10 : 10, 0]);
  const hoverLift = useSpring(isHovered ? 1 : 0, { stiffness: 280, damping: 32 });

  const glowSpread = useTransform(entry, (p) => 20 * p);
  const glow = useMotionTemplate`
    0 15px 50px rgba(0,0,0,0.35),
    0 0 ${glowSpread}px ${section.color},
    inset 0 0 30px rgba(255,255,255,0.1)
  `;

  const pulse = useTransform(entry, [0, 1], [0.4, 1]);

  const previewChips = useMemo(
    () =>
      ["Craft", "Ship", "Evolve", "Connect"]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2),
    []
  );

  return (
    <motion.div
      className="relative group max-w-[280px]"
      style={{
        opacity: entry,
        rotate: useTransform([tilt, hoverLift], ([r, h]) => r + h * 3),
        scale: useTransform([pulse, hoverLift], ([p, h]) => p + h * 0.05),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/${section.id}`}>
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 backdrop-blur-xl transition will-change-transform"
          style={{
            width: isMobile ? 240 : 280,
            height: isMobile ? 180 : 200,
            background: `linear-gradient(150deg, ${section.color}22 0%, ${section.accent}11 40%, transparent 100%)`,
            boxShadow: glow,
          }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-white/10 pointer-events-none" />
          <div className="absolute inset-0 opacity-70 mix-blend-screen">
            <div
              className="absolute inset-10 rounded-2xl border border-white/10"
              style={{
                boxShadow: `0 0 80px ${section.color}33, inset 0 0 40px ${section.color}22`,
              }}
            />
          </div>

          <div className="relative z-10 h-full w-full p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span
                className="text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-white/10 bg-white/5"
                style={{ color: section.color }}
              >
                {section.tag}
              </span>
              <motion.div
                className="w-10 h-10 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-sm font-semibold"
                animate={{ rotate: isHovered ? 8 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                {index + 1}
              </motion.div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight">{section.name}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{section.blurb}</p>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex gap-2">
                {previewChips.map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <motion.div
                className="flex items-center gap-2 text-white/70"
                animate={{ opacity: isHovered ? 1 : 0.7, x: isHovered ? 4 : 0 }}
              >
                <span style={{ color: section.color }}>Open</span>
                <motion.span
                  animate={{ x: isHovered ? 6 : 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                >
                  ↗
                </motion.span>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl"
            style={{
              background: section.color,
              opacity: useTransform([hoverLift, entry], ([h, e]) => 0.1 + (h + e) * 0.15),
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const { setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setTheme("default");
    document.title = "My Portfolio";
  }, [setTheme]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== "undefined" ? window.innerWidth < 768 : false);
      setWindowSize({
        width: typeof window !== "undefined" ? window.innerWidth : 0,
        height: typeof window !== "undefined" ? window.innerHeight : 0,
      });
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
    return undefined;
  }, []);

  const scrollProgress = useMotionValue(0);
  const targetProgress = useRef(0);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const handleWheel = (e) => {
      targetProgress.current += e.deltaY * (isMobile ? 0.0008 : 0.0004);
      targetProgress.current = Math.min(Math.max(targetProgress.current, 0), 1.4);
    };

    const smoothScroll = () => {
      const current = scrollProgress.get();
      scrollProgress.set(current + (targetProgress.current - current) * 0.08);
      rafIdRef.current = requestAnimationFrame(smoothScroll);
    };

    rafIdRef.current = requestAnimationFrame(smoothScroll);
    if (typeof window !== "undefined") {
      window.addEventListener("wheel", handleWheel, { passive: true });
      return () => {
        window.removeEventListener("wheel", handleWheel);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollProgress, isMobile]);

  const topY = useTransform(scrollProgress, [0, 0.25], ["0vh", "-50vh"]);
  const bottomY = useTransform(scrollProgress, [0, 0.25], ["0vh", "50vh"]);

  const hammerPhase = useTransform(scrollProgress, [0.1, 0.55], [0, 1]);
  const hammerScale = useTransform(hammerPhase, [0, 0.5, 1], [1.2, 1, 0.4]);
  const hammerOpacity = useTransform(hammerPhase, [0, 0.8, 1], [1, 0.8, 0]);
  const hammerBlur = useTransform(hammerPhase, [0, 1], ["0px", "5px"]);
  const hammerZ = useTransform(hammerPhase, [0, 0.3, 1], [0, -200, -800]);
  const hammerRotationSeeds = useMemo(
    () => ({
      x: (Math.random() - 0.5) * 90,
      y: (Math.random() - 0.5) * 90,
      z: (Math.random() - 0.5) * 180,
    }),
    []
  );
  const hammerRotateX = useTransform(hammerPhase, [0, 1], [0, hammerRotationSeeds.x]);
  const hammerRotateY = useTransform(hammerPhase, [0, 1], [0, hammerRotationSeeds.y]);
  const hammerRotateZ = useTransform(hammerPhase, [0, 1], [0, hammerRotationSeeds.z]);
  const hammerTransform = useMotionTemplate`
    translate(-50%, -50%) 
    translateZ(${hammerZ}px) 
    rotateX(${hammerRotateX}deg) 
    rotateY(${hammerRotateY}deg) 
    rotateZ(${hammerRotateZ}deg) 
    scale(${hammerScale})
  `;

  const totalPixels = isMobile ? 60 : 110;
  const pixelData = useMemo(
    () =>
      Array.from({ length: totalPixels }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        return {
          size: 3 + Math.random() * 6,
          color: ["#ff0080", "#ffcd00", "#00e0ff", "#00ff7f", "#ff4500"][Math.floor(Math.random() * 5)],
          angle,
          distance,
          zDistance: 50 + Math.random() * 500,
          index: i,
          rotateX: (Math.random() - 0.5) * 180,
          rotateY: (Math.random() - 0.5) * 180,
          driftX: Math.random() * 0.5,
          driftY: Math.random() * 0.5,
        };
      }),
    [totalPixels]
  );

  const pixelPhase = useTransform(scrollProgress, [0.1, 0.55], [0, 1]);
  const pixelIntensity = useTransform(scrollProgress, [0.2, 0.5, 0.7], [0, 1, 0.8]);

  const shatterPhase = useTransform(scrollProgress, [0.6, 0.85, 0.95], [0, 0.5, 1]);
  const impactPhase = useTransform(shatterPhase, [0, 0.2], [0, 1]);
  const crackPhase = useTransform(shatterPhase, [0.1, 0.4], [0, 1]);
  const particlePhase = useTransform(shatterPhase, [0.3, 0.7], [0, 1]);
  const revealPhase = useTransform(shatterPhase, [0.5, 1], [0, 1]);

  const crackCount1 = isMobile ? 5 : 8;
  const cracks1 = useMemo(
    () =>
      Array.from({ length: crackCount1 }).map(() => {
        const angle = Math.random() * 360;
        const screenDiagonal = Math.sqrt(windowSize.width ** 2 + windowSize.height ** 2);
        return {
          angle,
          length: screenDiagonal * 0.7 + Math.random() * screenDiagonal * 0.25,
          originX: 0,
          originY: 0,
          isMain: true,
          widthBase: 3.5 + Math.random(),
        };
      }),
    [crackCount1, windowSize]
  );

  const crackScale1 = useTransform(crackPhase, [0, 1], [0, 1]);
  const crackOpacity1 = useTransform(particlePhase, [0, 0.3], [0.9, 0.05]);

  const crackCount2 = isMobile ? 12 : 20;
  const cracks2 = useMemo(
    () =>
      Array.from({ length: crackCount2 }).map(() => {
        const baseCrack = cracks1[Math.floor(Math.random() * cracks1.length)];
        const distanceFromCenter = 50 + Math.random() * 150;
        const angleVariation = (Math.random() - 0.5) * 60;
        const screenDiagonal = Math.sqrt(windowSize.width ** 2 + windowSize.height ** 2);
        return {
          angle: baseCrack.angle + angleVariation,
          length: screenDiagonal * 0.35 + Math.random() * screenDiagonal * 0.25,
          originX: Math.cos((baseCrack.angle * Math.PI) / 180) * distanceFromCenter,
          originY: Math.sin((baseCrack.angle * Math.PI) / 180) * distanceFromCenter,
          isMain: false,
          widthBase: 1.8 + Math.random() * 0.8,
        };
      }),
    [crackCount2, cracks1, windowSize]
  );

  const crackScale2 = useTransform(crackPhase, [0, 1], [0, 1]);
  const crackOpacity2 = useTransform(particlePhase, [0, 0.3], [0.65, 0]);

  const glassRadius = useTransform(shatterPhase, [0, 0.65, 1], [150, 90, 1]);
  const glassClip = useMotionTemplate`circle(${glassRadius}% at 50% 50%)`;
  const glassOpacity = useTransform(crackPhase, [0, 1], [1, 0.4]);
  const glassBlur = useTransform(shatterPhase, [0, 1], ["blur(0px)", "blur(8px)"]);

  const glassParticles = useMemo(() => {
    const particles = [];
    const particleCount = isMobile ? 90 : 180;
    for (let i = 0; i < particleCount; i += 1) {
      const screenWidth = windowSize.width;
      const screenHeight = windowSize.height;
      const initialX = (Math.random() - 0.5) * screenWidth;
      const initialY = (Math.random() - 0.5) * screenHeight;
      const shapeSeed = Math.random();
      let clipPath = "";
      if (shapeSeed < 0.3) {
        clipPath = "polygon(0 0, 100% 10%, 80% 100%, 10% 90%)";
      } else if (shapeSeed < 0.6) {
        clipPath = "polygon(0 20%, 50% 0, 100% 30%, 80% 70%, 40% 100%, 10% 80%)";
      } else {
        clipPath = "polygon(0 30%, 30% 0, 70% 10%, 100% 40%, 80% 80%, 40% 100%, 10% 70%)";
      }

      particles.push({
        size: 3 + Math.random() * 8,
        initialX,
        initialY,
        delay: Math.random() * 0.7,
        xOffset: (Math.random() - 0.5) * 200,
        rotationAngle: (Math.random() - 0.5) * 360,
        widthFactor: 0.8 + Math.random() * 2,
        heightFactor: 0.8 + Math.random() * 2,
        colorAlpha: 0.6 + Math.random() * 0.4,
        clipPath,
      });
    }
    return particles.slice(0, particleCount);
  }, [windowSize, isMobile]);

  const sections = [
    {
      id: "aboutme",
      name: "About Me",
      color: "#7cfbde",
      accent: "#9cd3ff",
      blurb: "Curated story, principles, and what I’m building toward next.",
      tag: "Origin file",
    },
    {
      id: "myworks",
      name: "My Works",
      color: "#baff8f",
      accent: "#7cfbde",
      blurb: "Selected products, shipped experiments, and tangible impact.",
      tag: "Case studies",
    },
    {
      id: "creativity",
      name: "Creativity",
      color: "#9cd3ff",
      accent: "#e2a7ff",
      blurb: "Motion sketches, palette explorations, and playful prototypes.",
      tag: "Lab",
    },
    {
      id: "productivity",
      name: "Productivity",
      color: "#7cfbde",
      accent: "#5bf6b6",
      blurb: "Systems, automations, and content ops that keep momentum high.",
      tag: "Stacks",
    },
    {
      id: "reachmeout",
      name: "Reach Me Out",
      color: "#ffcf6b",
      accent: "#ff8f3c",
      blurb: "Direct lines, availability, and quick replies—no friction.",
      tag: "Let’s talk",
    },
  ];

  const fallingWords = useMemo(
    () =>
      ["build", "ship", "design", "code", "story", "motion", "impact", "craft", "scale", "launch"].map((word, i) => ({
        id: i,
        word,
        x: (Math.random() - 0.5) * 120,
        delay: i * 0.2,
        speed: 4 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden" style={{ perspective: "2200px" }}>
      <style>{`
          .glass-effect {
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }
          
          .impact-circle {
            background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.5);
          }
          
          .glimmer {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          }

          .glass-pane {
            background:
              linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.12) 100%),
              linear-gradient(90deg, rgba(124,251,222,0.05) 0%, rgba(156,211,255,0.04) 50%, rgba(124,251,222,0.03) 100%);
            border: 1px solid rgba(255,255,255,0.12);
            box-shadow:
              0 25px 80px rgba(0,0,0,0.45),
              inset 0 0 30px rgba(255,255,255,0.08);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
          }
        `}</style>

      <motion.div style={{ y: topY }} className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#0f1d3c] via-[#0b1126] to-[#05070f] z-10" />
      <motion.div style={{ y: bottomY }} className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0d2f26] via-[#082016] to-[#05070f] z-10" />

      <motion.div
        className="absolute inset-0 glass-pane overflow-hidden"
        style={{
          zIndex: 12,
          clipPath: glassClip,
          opacity: glassOpacity,
          filter: glassBlur,
        }}
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(124,251,222,0.3),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(156,211,255,0.35),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.12),transparent_40%)]" />
        <div className="absolute inset-0 opacity-16" style={{ backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="absolute inset-0 opacity-16" style={{ backgroundImage: "linear-gradient(0deg, rgba(255,255,255,0.08) 0%, transparent 28%)" }} />
        <div className="absolute inset-0 mix-blend-screen" style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)" }} />
      </motion.div>

      <motion.div
        style={{
          transform: hammerTransform,
          opacity: hammerOpacity,
          filter: hammerBlur,
          transformStyle: "preserve-3d",
        }}
        className="absolute left-1/2 top-1/2 text-4xl md:text-6xl font-bold z-30 text-center px-4 glimmer"
      >
        Portfolio OS · Crafted for Impact
      </motion.div>

      {pixelData.map((p) => (
        <Pixel
          key={p.index}
          {...p}
          pixelPhase={pixelPhase}
          pixelIntensity={pixelIntensity}
        />
      ))}

      <GlassLayer phase={particlePhase} />
      <ImpactCircle phase={impactPhase} size={isMobile ? 80 : 120} />

      {cracks1.map((c, i) => (
        <Crack key={`c1-${i}`} {...c} scale={crackScale1} opacity={crackOpacity1} widthBase={c.widthBase} isMain />
      ))}

      {cracks2.map((c, i) => (
        <Crack key={`c2-${i}`} {...c} scale={crackScale2} opacity={crackOpacity2} widthBase={c.widthBase} />
      ))}

      {glassParticles.map((particle, i) => (
        <GlassParticle key={`particle-${i}`} {...particle} phase={particlePhase} />
      ))}

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
        {fallingWords.map((item) => (
          <motion.div
            key={item.id}
            className="absolute text-white/80 font-semibold text-xl md:text-2xl"
            style={{ left: `calc(50% + ${item.x}px)` }}
            initial={{ y: "-20vh", opacity: 0, filter: "blur(6px)" }}
            animate={{
              y: "55vh",
              opacity: [0, 1, 0.2],
              filter: ["blur(6px)", "blur(0px)", "blur(10px)"],
            }}
            transition={{
              delay: item.delay,
              duration: item.speed,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
          >
            {item.word}
          </motion.div>
        ))}
      </div>

      <ShatterEffect
        progress={revealPhase}
        revealElement={
          <motion.div
            style={{ opacity: revealPhase }}
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6 z-20 p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.h2
              className="text-2xl md:text-4xl font-bold mb-3 md:mb-6 text-center text-white drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Choose Your Track
            </motion.h2>
            <p className="text-center text-white/70 max-w-2xl">
              Five fast lanes—story, shipped work, creative lab, production stack, and direct lines to me.
            </p>

            <div className="flex flex-wrap justify-center gap-4 md:gap-8 max-w-4xl">
              {sections.map((section, index) => (
                <SectionButton key={section.id} section={section} index={index} revealPhase={revealPhase} isMobile={isMobile} />
              ))}
            </div>

            <motion.div
              className="absolute inset-0 pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{
                background: "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)",
              }}
            />
          </motion.div>
        }
      />
    </div>
  );
}
