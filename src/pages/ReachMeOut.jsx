import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";

export default function ReachMeOut() {
  const { setTheme, theme } = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", topic: "", message: "" });

  useEffect(() => {
    setTheme("reachmeout");
    document.title = "Reach Me Out";
  }, [setTheme]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", topic: "", message: "" });
  };

  const contactMethods = [
    { label: "Email", value: "hello@makerlane.io", action: "Copy" },
    { label: "LinkedIn", value: "linkedin.com/in/makerlane", action: "Connect" },
    { label: "GitHub", value: "github.com/makerlane", action: "Follow" },
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_30%,#7f3b11_0%,#2d1204_32%,#0c0501_75%)] overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/25 blur-2xl"
            style={{
              width: 40 + Math.random() * 60,
              height: 40 + Math.random() * 60,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.9, 1.05, 0.95],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
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
          className={`max-w-4xl w-full rounded-3xl p-8 shadow-2xl ${theme.card} border border-amber-400/30 text-left`}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="md:w-1/2 space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">Contact</p>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-100">Reach me directly</h1>
              <p className="text-amber-100/80">
                Fast responses, clear timelines, and one concrete next step. Tell me about your build, and we’ll lock a time.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                {contactMethods.map((method) => (
                  <div
                    key={method.label}
                    className="p-3 rounded-2xl bg-amber-800/40 border border-amber-400/30 text-amber-50"
                  >
                    <p className="text-xs uppercase tracking-wide text-amber-200/70">{method.label}</p>
                    <p className="text-sm font-semibold break-words">{method.value}</p>
                    <span className="text-xs text-amber-200/80">{method.action}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-3 h-3 rounded-full bg-emerald-300 animate-pulse" />
                <p className="text-amber-100/70 text-sm">Replies within 24 hours • Based in GMT +5:30</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:w-1/2">
              <div>
                <label className="block text-amber-200 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-amber-800/50 border border-amber-500/60 rounded-xl text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-amber-800/50 border border-amber-500/60 rounded-xl text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-amber-200 mb-1">Topic</label>
                  <input
                    type="text"
                    name="topic"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-amber-800/50 border border-amber-500/60 rounded-xl text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Project, collaboration, content"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-200 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-amber-800/50 border border-amber-500/60 rounded-xl text-amber-100 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Give me context, timeline, links."
                  required
                />
              </div>

              <button type="submit" className={`w-full py-3 rounded-xl ${theme.button}`}>
                Send Message
              </button>
            </form>
          </div>

          <div className="flex justify-center mt-8">
            <Link to="/" className="px-4 py-2 text-amber-200 hover:text-amber-100 underline">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
