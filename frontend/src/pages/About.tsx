import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { Typewriter } from '../components/Typewriter';
import { Calendar, Code } from 'lucide-react';
import { usePublicSettings } from '../hooks/usePublicSettings';
import { useProjects } from '../queries/useProjects';



export const About = () => {
  const { data: settings, isLoading: settingsLoading } = usePublicSettings();
  const { data: projectsData } = useProjects({ limit: 1 });

  const aboutParagraphs = settings?.aboutParagraphs?.length
    ? settings.aboutParagraphs
    : [];

  const specializations = settings?.specializations?.length
    ? settings.specializations
    : [];

  const stats = [
    {
      label: 'Experience',
      value: settings?.yearsExperience
        ? `${settings.yearsExperience} years`
        : '1+ years',
    },
    {
      label: 'Cloud Platforms',
      value: settings?.cloudPlatforms ?? 'AWS',
    },
    {
      label: 'Projects',
      value: projectsData?.meta
        ? `${projectsData.meta.total}+ deployed`
        : '0 deployed',
    },
    {
      label: 'Technologies',
      value: settings?.technologies
        ? `${settings.technologies} mastered`
        : '20+ mastered',
    },
  ];

  const defaultTimeline = [
    {
      year: '2026 - Present',
      title: 'Building Secure Cloud-Native Platforms',
      organization: 'DevOps & Cloud Engineering',
      description:
        'Designing and deploying cloud-native infrastructure using AWS, Kubernetes, Docker, Terraform, GitHub Actions, Jenkins, and Linux while focusing on automation, security, Infrastructure as Code, and production-ready deployments.',
      icon: 'Code',
    },
    {
      year: '2022 - 2025',
      title: 'Bachelor of Computer Applications (BCA)',
      organization: 'Deogiri Institute Of Technology And Management Studies',
      description:
        'Focused on cloud computing, Linux, networking, and DevOps foundations.',
      icon: 'Calendar',
    },
  ];

  const timeline =
    settings?.timeline?.length
      ? settings.timeline
      : defaultTimeline;

  const iconMap = {
    Code,
    Calendar,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Terminal Header */}
      <TerminalHeader
        command="cat about.txt"
        description="Displaying professional background and technical philosophy"
      />

      {/* Bio Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-8 space-y-8"
            >
              <div className="bg-bg-surface border border-neutral-700 rounded-xl p-8 shadow-card">
                <div className="font-mono text-lg mb-6">
                  <span className="text-accent-500">$</span>
                  <span className="text-primary-500"> cat</span>
                  <span className="text-neutral-400"> bio.txt</span>
                </div>
                <div className="space-y-4 text-neutral-200 leading-relaxed">
                  <Typewriter
                    text={
                      settings?.aboutGreeting ??
                      "Hello, I'm Vijay vw, and I transform ideas into scalable, secure, and reliable infrastructure."
                    }
                    delay={30}
                    className="text-primary-500 font-semibold block mb-4"
                  />

                  {aboutParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  {settings?.aboutQuote && (
                    <p className="font-serif italic text-x text-neutral-500 leading-0">
                      {settings.aboutQuote.split("\n").map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < settings.aboutQuote!.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  )}

                  {settings?.aboutGoal && (
                    <p className="text-primary-500 font-medium">
                      {settings.aboutGoal}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-5"
            >
              <div className="bg-black border border-neutral-800 rounded-xl p-5">
                <h3 className="font-mono text-primary-500 font-semibold mb-4 text-lg">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-neutral-400">{stat.label}</span>
                      <span className="text-primary-500 font-mono text-sm">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-5">
                <h3 className="font-mono text-primary-500 font-semibold mb-4 text-lg">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-[#080D10] text-neutral-300 text-sm rounded-md border border-neutral-800 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">
              {settings?.timelineTitle ?? "Career Timeline"}
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              {settings?.timelineSubtitle ??
                "My journey from learning to DevOps engineering"}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-700 to-transparent" />

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const IconComponent =
                  iconMap[item.icon as keyof typeof iconMap] ?? Code;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-4 border-bg-page shadow-glow z-10">
                      <IconComponent size={16} className="text-bg-surface" />
                    </div>

                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                      <div className="bg-bg-elevated border border-neutral-700 rounded-lg p-6 hover:border-primary-500/50 transition-colors shadow-card">
                        <div className="font-mono text-accent-500 text-sm mb-2">{item.year}</div>
                        <h3 className="font-semibold text-xl text-neutral-200 mb-1">{item.title}</h3>
                      {item.organization && (
                        <div className="text-primary-500 font-medium mb-3">
                          {item.organization}
                        </div>
                      )}
                        <p className="text-neutral-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};