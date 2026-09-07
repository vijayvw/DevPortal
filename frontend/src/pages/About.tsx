import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { Typewriter } from '../components/Typewriter';
import { Calendar, Code } from 'lucide-react';



export const About = () => {
  const timeline = [
    {

      year: '2026 - Present',
      title: "Building Secure Cloud-Native Platforms",
      description:
        'Designing and deploying cloud-native infrastructure using AWS, Kubernetes, Docker, Terraform, GitHub Actions, Jenkins, and Linux while focusing on automation, security, Infrastructure as Code, and production-ready deployments.',
      icon: Code,},
    {

      year: '2022 - 2025',
      title: 'Bachelor of Computer Applications (BCA)',
      college: 'Deogiri Institute Of Technology And Management Studies',
      description: 'Focused on cloud computing, Linux, networking, and DevOps foundations.',
      icon: Calendar,
    },
  ];

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
                    text="Hello, I'm Vijay vw, and I transform ideas into scalable, secure, and reliable infrastructure."
                    delay={30}
                    className="text-primary-500 font-semibold block mb-4"
                  />
                  <p>
                    I engineer secure infrastructure, automate complex systems, and build cloud-native platforms that are designed for resilience from day one. My work sits at the intersection of DevOps, Cloud Engineering, Cybersecurity, and Infrastructure Automation, where reliability is treated as a security feature rather than an afterthought.
                  </p>
                  <p>
Instead of simply deploying applications, I focus on building production-ready ecosystems. Every server, container, pipeline, and Kubernetes cluster should be reproducible, observable, and resilient against failure. I believe modern infrastructure should be version-controlled, automatically provisioned, continuously validated, and secure by default.
                  </p>
                  <p>
                    My engineering journey began with Linux system administration, where understanding operating systems and networking became the foundation for everything that followed. That curiosity gradually expanded into container technologies, Kubernetes orchestration, Infrastructure as Code, CI/CD automation, cloud architecture, and offensive security practices.
                  </p>
                  <p>Alongside AWS and DevOps, I continuously expand my expertise in Azure, GCP, cloud security, infrastructure automation, and modern engineering practices to build secure, resilient, and production-ready systems.
</p>

<p>
  Today I work extensively with AWS, Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, Linux, and modern cloud-native tooling while continuously expanding my expertise in cloud security, container hardening, vulnerability assessment, identity management, and secure software delivery.
</p>

<p>Beyond building systems, I enjoy understanding how they fail. I actively explore penetration testing methodologies, Capture The Flag challenges, infrastructure hardening, and attack simulations because designing secure platforms begins with understanding how they can be compromised.
</p>
<p>For me, infrastructure is more than servers and deployments it's an engineering discipline that combines automation, scalability, performance, observability, and security into one cohesive system.

My long-term mission is to become a Cloud Security Engineer capable of designing highly available, globally distributed, self-healing infrastructure that remains secure throughout its entire lifecycle.</p>
<p className="font-serif italic text-x text-neutral-500 leading-0">
  "I don't just automate deployments.
  <br />
  I engineer platforms that can be trusted."
</p>
                  <p className="text-primary-500 font-medium">
  My goal is to build infrastructure that is scalable by design, secure by default, and automated for the future.
                  </p>
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
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Experience</span>
                    <span className="text-primary-500 font-mono text-sm">1+ years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Cloud Platforms</span>
                    <span className="text-primary-500 font-mono text-sm">AWS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Projects</span>
                    <span className="text-primary-500 font-mono text-sm">12+ deployed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Technologies</span>
                    <span className="text-primary-500 font-mono text-sm">20+ mastered</span>
                  </div>
                </div>
              </div>

              <div className="bg-black border border-neutral-800 rounded-xl p-5">
                <h3 className="font-mono text-primary-500 font-semibold mb-4 text-lg">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Cloud Security",
    "DevSecOps",
    "Kubernetes",
    "Container Security",
    "Infrastructure as Code",
    "AWS",
    "CI/CD Engineering",
    "Linux Administration",
    "Cloud Architecture",
     "Terraform",
    "Infrastructure Automation",
    "Docker & Podman",
    "GitHub Actions",
    "Jenkins",
    "Container Orchestration",
    "Identity & Access Management",
    "Network Security",
    "System Hardening",
    "Vulnerability Assessment",
    "Penetration Testing",
    "Cloud Native",
    "Monitoring & Observability",
    "Incident Response",
    "Shell Scripting"].map((skill) => (
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
              Career Timeline
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              My journey from to DevOps engineering
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-primary-700 to-transparent" />

            <div className="space-y-12">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
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
                      <div className="text-primary-500 font-medium mb-3">
                          {'college' in item ? item.college : 'DevOps & Cloud Engineering'}
                      </div>
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