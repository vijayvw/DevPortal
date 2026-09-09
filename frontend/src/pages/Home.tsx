import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Code2 } from 'lucide-react';
import { Grid3DBackground } from '../components/Grid3D';
import { Typewriter } from '../components/Typewriter';
import { HERO_CONTENT } from '../data/portfolio';
import { useSkills } from '../queries/useSkills';
import { useProjects } from '../queries/useProjects';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';
import { useNavigate } from "react-router-dom";
import { usePublicSettings } from '../hooks/usePublicSettings';



  // ...

// Same 12 skills the original static homepage highlighted (previously
// selected by hardcoded array index into portfolio.ts's SKILLS array —
// replaced with name-based lookup against live data, since index-based
// selection isn't safe against a data source whose order isn't
// guaranteed to match the old static array).
const FEATURED_SKILL_NAMES = [
  'Red Hat', 'AWS', 'Docker', 'Kubernetes', 'Terraform','Jenkins',
  'Kali Linux', 'Wireshark', 'Burp Suite', 'Metasploit', 'Hydra','Nmap'
];



  
export const Home = () => {
  const { data: settings } = usePublicSettings();
  const navigate = useNavigate();
  const [startHeroAnimation, setStartHeroAnimation] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartHeroAnimation(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const { data: skills, isLoading: skillsLoading, isError: skillsError, error: skillsErrorObj, refetch: refetchSkills } = useSkills();
  const { data: projectsData } = useProjects({ limit: 1 });

  const featuredSkills = FEATURED_SKILL_NAMES
    .map((name) => skills?.find((s) => s.name === name))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const stats = [
    { label: 'Years Experience', value: '1+' },
    { label: 'Cloud Platforms', value: '2' },
    { label: 'Projects Completed', value: projectsData?.meta ? String(projectsData.meta.total) : '10+' },
    { label: 'Technologies', value: '20+' },
  ];

  return (
    <div className="min-h-screen bg-bg-page relative overflow-hidden">
      {/* 3D Grid Background */}
      <Grid3DBackground />
       <div

    className="pointer-events-none absolute -left-64 bottom-0

               h-[700px] w-[700px] rounded-full

               bg-primary-500/10
                blur-[140px]"

  />
      

      {/* Main Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Terminal prompt */}
            <div className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide">
              <span className="text-accent-500 mr-3">$</span>
              <span className="text-primary-500">whoami</span>
            </div>

            {/* Typewriter heading */}
            <div className="font-mono text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-primary-500">
              <Typewriter text="DevOps & Cloud Engineer" delay={80} />
              <span className="terminal-cursor ml-2" />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-xl md:text-2xl text-neutral-200 max-w-4xl mx-auto leading-relaxed"
            >
              {HERO_CONTENT}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center px-8 py-4 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-bg-surface transition-all duration-200 font-semibold tracking-wide rounded-lg shadow-glow hover:shadow-card-hover"
              >
                <Code2 className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Projects
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center px-8 py-4 border-2 border-neutral-600 bg-neutral-800 text-neutral-200 hover:border-primary-500 hover:text-primary-500 transition-all duration-200 font-semibold tracking-wide rounded-lg"
              >
                <ExternalLink className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Contact Me
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-[#080D10]/90 border border-neutral-800 p-6 rounded-xl shadow-card hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">
              Featured Technologies
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              A curated collection of the cloud, DevOps, cybersecurity, and offensive security technologies I use to build, secure, automate, and test modern infrastructure.
            </p>
          </motion.div>

          {skillsLoading && <LoadingState label="Loading featured technologies..." />}
          {skillsError && (
            <ErrorState
              message={skillsErrorObj instanceof Error ? skillsErrorObj.message : undefined}
              onRetry={() => refetchSkills()}
            />
          )}
          {!skillsLoading && !skillsError && featuredSkills.length === 0 && (
            <EmptyState message="No featured technologies to display yet." />
          )}

          {!skillsLoading && !skillsError && featuredSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {featuredSkills.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-[#080D10]/90 border border-neutral-800 p-4 rounded-xl text-center hover:border-primary-500/50 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <img
                    src={skill.iconUrl ?? undefined}
                    alt={skill.name}
                    className="w-10 h-10 mx-auto mb-3 object-contain transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="font-mono text-sm text-neutral-200 font-medium">
                    {skill.name}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/skills"
              className="inline-flex items-center text-primary-500 hover:text-primary-400 font-mono font-semibold group"
            >
              <span className="mr-2">View all skills</span>
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-[#080D10] border border-neutral-800 p-12 rounded-2xl shadow-card hover:border-primary-500/30 transition-all duration-300"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-6">
              Ready to Deploy Your Vision?
            </h2>
            <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
              Let's build something amazing together. From infrastructure automation to Cloud Securiy,
              I'm here to turn your ideas into production reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
  onClick={() => {
    navigate("/contact");
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }}
  className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-700 text-neutral-200 hover:border-primary-500 hover:text-primary-500 font-semibold rounded-lg transition-all duration-200"
>
  Start a Project
</button>
              <a
                href={settings?.github ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-600 text-neutral-200 hover:border-primary-500 hover:text-primary-500 font-semibold rounded-lg transition-all duration-200"
              >
                <Github className="mr-2 h-5 w-5" />
                View Code
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
