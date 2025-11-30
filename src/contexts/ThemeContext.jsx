import { useState } from "react";
import ThemeContext from "./ThemeContext";

const themes = {
  default: {
    background:
      "bg-[radial-gradient(circle_at_18%_20%,#13223f_0%,#070c18_32%,#03060f_65%)]",
    text: "text-slate-100",
    button:
      "bg-[#7cfbde] text-[#04101b] font-semibold shadow-[0_12px_30px_rgba(124,251,222,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(124,251,222,0.35)] transition",
    card:
      "bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.45)]",
    accent: "text-[#7cfbde]",
    name: "Default",
    cursor: "default",
  },
  aboutme: {
    background:
      "bg-[radial-gradient(circle_at_10%_10%,#1c4d8f_0%,#0a1a35_35%,#060915_75%)]",
    text: "text-slate-50",
    button:
      "bg-[#7cfbde] text-[#021018] font-semibold shadow-[0_12px_30px_rgba(124,251,222,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(124,251,222,0.35)] transition",
    card:
      "bg-white/8 border border-white/15 backdrop-blur-xl shadow-[0_30px_120px_rgba(12,46,92,0.55)]",
    accent: "text-[#9cd3ff]",
    name: "Calm Water",
    cursor: "water",
  },
  myworks: {
    background:
      "bg-[radial-gradient(circle_at_70%_15%,#3c2d5c_0%,#110a1f_35%,#070812_75%)]",
    text: "text-emerald-200",
    button:
      "bg-emerald-400 text-slate-900 font-semibold shadow-[0_14px_40px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(16,185,129,0.35)] transition",
    card:
      "bg-white/5 border border-emerald-300/30 backdrop-blur-lg shadow-[0_30px_120px_rgba(20,220,160,0.25)]",
    accent: "text-emerald-300",
    name: "Hypergrid",
    cursor: "pixel",
  },
  reachmeout: {
    background:
      "bg-[radial-gradient(circle_at_18%_30%,#7f3b11_0%,#2d1204_32%,#0c0501_75%)]",
    text: "text-amber-50",
    button:
      "bg-amber-400 text-[#2f1303] font-semibold shadow-[0_12px_30px_rgba(251,191,36,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(251,191,36,0.35)] transition",
    card:
      "bg-amber-900/60 border border-amber-500/40 backdrop-blur-lg shadow-[0_30px_120px_rgba(255,150,60,0.35)]",
    accent: "text-amber-200",
    name: "Warm Ember",
    cursor: "wood",
  },
  productivity: {
    background:
      "bg-[radial-gradient(circle_at_70%_75%,#0f5e3d_0%,#052017_40%,#020807_75%)]",
    text: "text-emerald-100",
    button:
      "bg-emerald-500 text-[#03130c] font-semibold shadow-[0_12px_30px_rgba(52,211,153,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(52,211,153,0.35)] transition",
    card:
      "bg-emerald-900/40 border border-emerald-400/30 backdrop-blur-lg shadow-[0_30px_120px_rgba(16,185,129,0.35)]",
    accent: "text-emerald-200",
    name: "Production Room",
    cursor: "production",
  },
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState("default");
  const [cursorVariant, setCursorVariant] = useState(themes.default.cursor);

  const setTheme = (nextTheme) => {
    setCurrentTheme(nextTheme);
    setCursorVariant(themes[nextTheme]?.cursor || "default");
  };

  const value = {
    theme: themes[currentTheme] || themes.default,
    setTheme,
    themeName: currentTheme,
    cursorVariant,
    setCursorVariant,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
