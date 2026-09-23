import { Routes, Route } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ThemeProvider } from "../context/ThemeContext";

import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Skills } from "../pages/Skills";
import { Projects } from "../pages/Projects";
import Blog from "../pages/Blog";
import CaseStudies from "../pages/CaseStudies";
import { Contact } from "../pages/Contact";

export default function PublicLayout() {
  return (
    <ThemeProvider>
      <div
  className="public-site min-h-screen font-sans transition-colors duration-300"
  style={{
    backgroundColor: "var(--theme-page)",
    color: "var(--theme-text)",
  }}
>
        <Navbar />

        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
}
