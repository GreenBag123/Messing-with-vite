import { useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import CustomCursor from "./components/CustomCursor";
import AboutMe from "./pages/AboutMe";
import Creativity from "./pages/Creativity";
import Home from "./pages/Home";
import MyWorks from "./pages/MyWorks";
import Productivity from "./pages/Productivity";
import ReachMeOut from "./pages/ReachMeOut";

function App() {
  const location = useLocation();
  const [isVisible] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  const cursorKey = useMemo(() => location.key || location.pathname, [location.key, location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDebugMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.cursor = "none";
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/myworks" element={<MyWorks />} />
        <Route path="/creativity" element={<Creativity />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/reachmeout" element={<ReachMeOut />} />
      </Routes>

      {isVisible && <CustomCursor key={cursorKey} />}

      {debugMode && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded z-50 text-xs">
          <div>Debug Mode: ON</div>
          <div>Press Ctrl+Shift+D to toggle</div>
        </div>
      )}
    </>
  );
}

export default App;
