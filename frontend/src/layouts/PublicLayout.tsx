import { Routes, Route } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Skills } from "../pages/Skills";
import { Projects } from "../pages/Projects";
import Blog from "../pages/Blog";
import CaseStudies from "../pages/CaseStudies";
import { Contact } from "../pages/Contact";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-bg-page text-neutral-200 font-sans">
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
  );
}
