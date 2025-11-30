import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../contexts/useTheme";

export default function CustomCursor() {
  const { cursorVariant, setCursorVariant } = useTheme();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const lastPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const [waterRipples, setWaterRipples] = useState([]);
  const [defaultTrails, setDefaultTrails] = useState([]);
  const [pixelTrails, setPixelTrails] = useState([]);
  const [flameParticles, setFlameParticles] = useState([]);
  const [filmFrames, setFilmFrames] = useState([]);
  const timeoutIds = useRef([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
  }, []);

  const scheduleTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      callback();
      timeoutIds.current = timeoutIds.current.filter((timeoutId) => timeoutId !== id);
    }, delay);
    timeoutIds.current.push(id);
    return id;
  }, []);

  const springConfig = useMemo(
    () => ({
      damping: isPointer ? 15 : 10,
      stiffness: isPointer ? 400 : 250,
      mass: isPointer ? 0.5 : 0.8,
    }),
    [isPointer]
  );

  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const stretchX = useTransform(x, (latestX) => {
    const deltaX = latestX - lastPosition.current.x;
    velocity.current.x = deltaX;
    lastPosition.current.x = latestX;
    return Math.min(1.8, 1 + Math.abs(deltaX) / 30);
  });

  const stretchY = useTransform(y, (latestY) => {
    const deltaY = latestY - lastPosition.current.y;
    velocity.current.y = deltaY;
    lastPosition.current.y = latestY;
    return Math.min(1.8, 1 + Math.abs(deltaY) / 30);
  });

  const createDefaultTrail = useCallback((xPos, yPos) => {
    const id = Date.now();
    const newTrail = {
      id,
      x: xPos,
      y: yPos,
      size: 16 + Math.random() * 10,
    };
    setDefaultTrails((prev) => [...prev.slice(-12), newTrail]);
    scheduleTimeout(() => {
      setDefaultTrails((prev) => prev.filter((t) => t.id !== id));
    }, 900);
  }, [scheduleTimeout]);

  const createWaterRipple = useCallback((xPos, yPos) => {
    const id = Date.now();
    const newRipple = { id, x: xPos, y: yPos, size: 18 };
    setWaterRipples((prev) => [...prev.slice(-6), newRipple]);
    scheduleTimeout(() => {
      setWaterRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1200);
  }, [scheduleTimeout]);

  const createPixelTrail = useCallback((xPos, yPos) => {
    const id = Date.now();
    const newTrail = { id, x: xPos, y: yPos, offsetX: (Math.random() - 0.5) * 24 };
    setPixelTrails((prev) => [...prev.slice(-14), newTrail]);
    scheduleTimeout(() => {
      setPixelTrails((prev) => prev.filter((t) => t.id !== id));
    }, 1100);
  }, [scheduleTimeout]);

  const createFlameParticle = useCallback((xPos, yPos) => {
    const id = Date.now() + Math.random();
    const newParticle = {
      id,
      x: xPos,
      y: yPos,
      size: Math.random() * 6 + 4,
      moveX: (Math.random() - 0.5) * 40,
      moveY: -(Math.random() * 40 + 20),
    };
    setFlameParticles((prev) => [...prev.slice(-12), newParticle]);
    scheduleTimeout(() => {
      setFlameParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1100);
  }, [scheduleTimeout]);

  const createFilmFrame = useCallback((xPos, yPos) => {
    const id = Date.now() + Math.random();
    const newFrame = { id, x: xPos, y: yPos, rotation: Math.random() * 360 };
    setFilmFrames((prev) => [...prev.slice(-6), newFrame]);
    scheduleTimeout(() => {
    setFilmFrames((prev) => prev.filter((f) => f.id !== id));
    }, 1400);
  }, [scheduleTimeout]);

  const addTrail = useCallback(
    (xPos, yPos) => {
      if (cursorVariant === "water") {
        createWaterRipple(xPos, yPos);
      } else if (cursorVariant === "default") {
        createDefaultTrail(xPos, yPos);
      } else if (cursorVariant === "pixel") {
        createPixelTrail(xPos, yPos);
      } else if (cursorVariant === "wood" && isClicked) {
        createFlameParticle(xPos, yPos);
      } else if (cursorVariant === "production") {
        createFilmFrame(xPos, yPos);
      }
    },
    [createDefaultTrail, createFilmFrame, createPixelTrail, createWaterRipple, cursorVariant, isClicked, createFlameParticle]
  );

  const createFlameEffect = useCallback(() => {
    for (let i = 0; i < 3; i += 1) {
      scheduleTimeout(() => {
        if (cursorX.get() !== -100) {
          createFlameParticle(cursorX.get() + 10, cursorY.get() + 10);
        }
      }, i * 100);
    }
  }, [createFlameParticle, cursorX, cursorY, scheduleTimeout]);

  useEffect(() => {
    const cursorSize = 20;

    const onMove = (e) => {
      setIsVisible(true);
      const posX = e.clientX;
      const posY = e.clientY;

      cursorX.set(posX - cursorSize / 2);
      cursorY.set(posY - cursorSize / 2);

      const isInteractive =
        e.target &&
        e.target.closest &&
        e.target.closest(
          'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])'
        );
      setIsPointer(!!isInteractive);

      addTrail(posX, posY);
    };

    const onLeave = () => {
      setIsVisible(false);
      cursorX.set(-100);
      cursorY.set(-100);
    };

    const onDown = () => {
      setIsClicked(true);
      if (cursorVariant === "wood") createFlameEffect();
    };

    const onUp = () => setIsClicked(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      clearAllTimeouts();
    };
  }, [addTrail, clearAllTimeouts, createFlameEffect, cursorVariant, cursorX, cursorY]);

  return (
    <>
      {cursorVariant === "water" &&
        waterRipples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="fixed rounded-full bg-blue-300 pointer-events-none z-[9998] shadow-[0_0_12px_rgba(96,165,250,0.8)]"
            style={{ zIndex: 2147483647 }}
            initial={{
              x: ripple.x,
              y: ripple.y,
              width: ripple.size,
              height: ripple.size,
              opacity: 0.7,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: 50,
              height: 50,
              opacity: 0,
            }}
            transition={{ duration: 1.1 }}
          />
        ))}

      {cursorVariant === "default" &&
        defaultTrails.map((trail) => (
          <motion.div
            key={trail.id}
            className="fixed rounded-full bg-white/80 pointer-events-none z-[9998] shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{ zIndex: 2147483647 }}
            initial={{
              x: trail.x,
              y: trail.y,
              width: trail.size,
              height: trail.size,
              translateX: "-50%",
              translateY: "-50%",
              opacity: 0.6,
              filter: "blur(1px)",
            }}
            animate={{
              y: trail.y + 20,
              opacity: 0,
              scale: 0.7,
            }}
            transition={{ duration: 0.6 }}
          />
        ))}

      {cursorVariant === "pixel" &&
        pixelTrails.map((trail, index) => (
          <motion.div
            key={trail.id}
            className="fixed w-3 h-3 bg-green-400 pointer-events-none z-[9998] shadow-[0_0_12px_rgba(82,255,105,0.7)]"
            style={{ zIndex: 2147483647 }}
            initial={{
              x: trail.x,
              y: trail.y,
              translateX: "-50%",
              translateY: "-50%",
              opacity: 0.5 * (1 - index / pixelTrails.length),
            }}
            animate={{
              x: trail.x + trail.offsetX,
              y: trail.y + 15,
              opacity: 0,
            }}
            transition={{ duration: 1 }}
          />
        ))}

      {cursorVariant === "wood" &&
        flameParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed rounded-full pointer-events-none z-[9998]"
            style={{ zIndex: 2147483647 }}
            initial={{
              x: particle.x,
              y: particle.y,
              width: particle.size,
              height: particle.size,
              translateX: "-50%",
              translateY: "-50%",
              background: `radial-gradient(circle, 
              rgba(255, 230, 100, 0.9) 0%, 
              rgba(255, 150, 50, 0.7) 70%, 
              rgba(255, 80, 0, 0.5) 100%)`,
            }}
            animate={{
              x: particle.x + particle.moveX,
              y: particle.y + particle.moveY,
              scale: 0.5,
              opacity: 0,
            }}
            transition={{ duration: 0.8 }}
          />
        ))}

      {cursorVariant === "production" &&
        filmFrames.map((frame) => (
          <motion.div
            key={frame.id}
            className="fixed w-3 h-4 pointer-events-none z-[9998]"
            style={{
              zIndex: 2147483647,
              x: frame.x,
              y: frame.y,
              translateX: "-50%",
              translateY: "-50%",
              rotate: frame.rotation,
            }}
            initial={{
              opacity: 0.7,
              scale: 0.8,
            }}
            animate={{
              y: frame.y + 20,
              opacity: 0,
              scale: 0.5,
            }}
            transition={{ duration: 1.2 }}
          >
            <div className="w-full h-full bg-black border border-emerald-400 rounded-sm">
              <div
                className="absolute inset-0.5 bg-emerald-600 opacity-40"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
            </div>
          </motion.div>
        ))}

      {isVisible && (
        <>
      {cursorVariant === "default" && (
        <motion.div
          className="fixed left-0 top-0 w-5 h-5 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            scaleX: stretchX,
            scaleY: stretchY,
            zIndex: 2147483647,
          }}
        />
      )}

      {cursorVariant === "water" && (
        <motion.div
          className="fixed left-0 top-0 w-7 h-4 pointer-events-none z-[9999]"
          style={{ x, y, translateX: "-50%", translateY: "-50%", zIndex: 2147483647 }}
        >
              <div className="absolute inset-0 bg-blue-400 rounded-full" />
              <motion.div
                className="absolute -right-1 top-0 w-3 h-3 bg-blue-500"
                animate={{
                  rotate: [0, -15, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  clipPath: "polygon(100% 0, 0% 50%, 100% 100%)",
                }}
              />
              <div className="absolute left-2 top-1 w-2 h-2 bg-white rounded-full" />
              <div className="absolute left-2.5 top-1.5 w-1 h-1 bg-black rounded-full" />
            </motion.div>
          )}

      {cursorVariant === "pixel" && (
        <motion.div
          className="fixed left-0 top-0 w-2.5 h-2.5 pointer-events-none z-[9999]"
          style={{ x, y, translateX: "-50%", translateY: "-50%", zIndex: 2147483647 }}
          animate={{
            boxShadow: isClicked
              ? "0 0 15px 5px rgba(82, 255, 105, 0.8)"
                  : "0 0 8px 2px rgba(82, 255, 105, 0.5)",
              }}
            >
              <div className="absolute inset-0 bg-green-400" />
              <motion.div
                className="absolute inset-0 bg-green-400"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0.3, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}

      {cursorVariant === "wood" && (
        <motion.div
          className="fixed left-0 top-0 w-5 h-7 pointer-events-none z-[9999]"
          style={{ x, y, translateX: "-50%", translateY: "-50%", zIndex: 2147483647 }}
        >
              <div className="relative w-full h-full">
                <div className="absolute -top-1 left-2.5 w-1 h-2 bg-amber-900 rounded-t-lg" />
                <div className="absolute bottom-0 w-full h-6 bg-amber-800 rounded-lg" />
                {isClicked && (
                  <motion.div
                    className="absolute bottom-4 left-1.5 w-4 h-4 bg-amber-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                      boxShadow: "0 0 15px 5px rgba(255, 191, 0, 0.7)",
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                    }}
                  />
                )}
                <div className="absolute bottom-1 left-2 w-3 h-4 bg-amber-700 opacity-30 rounded-lg" />
                <div className="absolute bottom-2 left-1 w-0.5 h-3 bg-amber-900 opacity-40 rounded" />
                <div className="absolute bottom-1.5 right-1 w-0.5 h-3 bg-amber-900 opacity-40 rounded" />
              </div>
            </motion.div>
          )}

      {cursorVariant === "production" && (
        <motion.div
          className="fixed left-0 top-0 w-8 h-10 pointer-events-none z-[9999]"
          style={{ x, y, translateX: "-50%", translateY: "-50%", zIndex: 2147483647 }}
          animate={{
            rotate: isClicked ? [-5, 5, -5, 5, 0] : 0,
            scale: isClicked ? [1, 1.1, 0.9, 1] : 1,
              }}
              transition={{
                duration: isClicked ? 0.3 : 0.2,
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-black rounded-sm border-2 border-emerald-400" />
                <div
                  className="absolute top-0 left-0 w-full h-full bg-emerald-600 opacity-80"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  }}
                />
                <div className="absolute top-1 left-2 w-4 h-0.5 bg-white" />
                <div className="absolute top-2 left-2 w-4 h-0.5 bg-white" />
                <div className="absolute top-3 left-2 w-4 h-0.5 bg-white" />
                <div className="absolute -top-2 left-3 w-1 h-2 bg-gray-400 rounded-t" />
                <div className="absolute bottom-1 right-1">
                  <div className="w-1 h-1 bg-white rounded-full" />
                </div>
                {isClicked && (
                  <>
                    <motion.div
                      className="absolute inset-0 border-2 border-emerald-400 rounded-sm"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute inset-0 border-2 border-yellow-400 rounded-sm"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    />
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-yellow-500 text-black px-2 py-1 rounded-md font-bold text-xs whitespace-nowrap">
                        CLAP!
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rotate-45" />
                    </motion.div>
                  </>
                )}
              </div>

              {isVisible && !isClicked && (
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex space-x-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 bg-emerald-400 rounded-sm"
                        animate={{
                          y: [0, -3, 0],
                          opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </>
      )}

      <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-50 text-white">
        <button
          className="px-3 py-2 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-sm shadow-lg"
          onClick={() => setShowControls((prev) => !prev)}
          aria-expanded={showControls}
          aria-controls="cursor-variant-panel"
        >
          {showControls ? "Hide cursor styles" : "Cursor styles"}
        </button>

        {showControls && (
          <div
            id="cursor-variant-panel"
            className="flex flex-wrap gap-2 p-3 bg-black/60 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl max-w-xs"
          >
            <button
              className={`px-3 py-1 rounded-md text-sm ${cursorVariant === "default" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
              onClick={() => setCursorVariant("default")}
            >
              Default
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${cursorVariant === "water" ? "bg-blue-500 text-white" : "bg-gray-700 text-white"}`}
              onClick={() => setCursorVariant("water")}
            >
              Water
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${cursorVariant === "pixel" ? "bg-green-500 text-white" : "bg-gray-700 text-white"}`}
              onClick={() => setCursorVariant("pixel")}
            >
              Pixel
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${cursorVariant === "wood" ? "bg-amber-700 text-white" : "bg-gray-700 text-white"}`}
              onClick={() => setCursorVariant("wood")}
            >
              Wood
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${cursorVariant === "production" ? "bg-emerald-500 text-white" : "bg-gray-700 text-white"}`}
              onClick={() => setCursorVariant("production")}
            >
              Production
            </button>
          </div>
        )}
      </div>
    </>
  );
}
