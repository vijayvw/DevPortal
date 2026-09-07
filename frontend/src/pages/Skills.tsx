import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { Typewriter } from '../components/Typewriter';
import {
  Cloud,
  Container,
  Code,
  Database,
  Monitor,
  Shield,
  Award,
  Server,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useSkills } from '../queries/useSkills';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { EmptyState } from '../components/states/EmptyState';
import type { SkillDto } from '../api/types';

// Category display metadata (title/icon/color/order) is presentation
// config, not data — it stays local. Only the skill *items* inside each
// category now come from the live API (M5), grouped client-side by the
// same `category` slugs the backend already uses (see prisma seed.ts).
const CATEGORY_META: Array<{ id: string; title: string; icon: typeof Award; color: string }> = [
  { id: 'cert', title: 'Certifications', icon: Award, color: 'text-blue-500' },
  { id: 'os', title: 'Operating Systems', icon: Monitor, color: 'text-blue-500' },
  { id: 'cloud', title: 'Cloud Platforms', icon: Cloud, color: 'text-blue-500' },
  { id: 'containers', title: 'Container & Orchestration', icon: Container, color: 'text-blue-400' },
  { id: 'infrastructure', title: 'Infrastructure as Code', icon: TerminalIcon, color: 'text-purple-500' },
  { id: 'monitoring', title: 'Monitoring & Observability', icon: Monitor, color: 'text-yellow-500' },
  { id: 'network', title: 'Networking', icon: Monitor, color: 'text-cyan-500' },
  { id: 'webserver', title: 'Web Servers', icon: Server, color: 'text-emerald-500' },
  { id: 'devops', title: 'DevOps & Automation', icon: Code, color: 'text-green-500' },
  { id: 'security', title: 'Cloud & Cyber Security', icon: Shield, color: 'text-orange-500' },
  { id: 'database', title: 'Databases', icon: Database, color: 'text-red-500' },
];

export const Skills = () => {
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: skills, isLoading, isError, error, refetch } = useSkills();

  const categories = useMemo(() => {
    if (!skills) return [];
    return CATEGORY_META.map((meta) => ({
      ...meta,
      skills: skills.filter((s) => s.category === meta.id),
    })).filter((cat) => cat.skills.length > 0);
  }, [skills]);

  const commands = {
    help: [
      'Available commands:',
      '  ls <category>     - List skills in a category',
      '  cat <skill>       - Show skill details',
      '  levels            - Show proficiency levels',
      '  clear             - Clear terminal',
      '  help              - Show this help',
    ],
    levels: [
      'Proficiency Levels:',
      '  Beginner (30%)     - Basic understanding',
      '  Intermediate (60%) - Practical experience',
      '  Advanced (85%)     - Production usage',
      '  Expert (100%)      - Deep expertise',
    ],
    clear: () => setTerminalOutput([]),
    default: (input: string) => [
      `Command not found: ${input}`,
      'Type "help" for available commands.',
    ],
  };

  const executeCommand = (input: string) => {
    setIsProcessing(true);

    const cmd = input.toLowerCase().trim();
    const args = cmd.split(' ');
    const mainCmd = args[0];

    setTimeout(() => {
      let output: string[] = [];

      switch (mainCmd) {
        case 'help':
          output = commands.help;
          break;
        case 'levels':
          output = commands.levels;
          break;
        case 'clear':
          commands.clear();
          setIsProcessing(false);
          return;
        case 'ls': {
          const category = args[1];
          const found = category && categories.find((c) => c.id === category);
          if (found) {
            output = [
              `${found.title}:`,
              ...found.skills.map((skill) => `  ${skill.name} (${skill.proficiency}%)`),
            ];
          } else {
            output = [
              'Available categories:',
              ...categories.map((cat) => `  ${cat.id} - ${cat.title}`),
            ];
          }
          break;
        }
        case 'cat': {
          const skillName = args.slice(1).join(' ');
          const skill: SkillDto | undefined = (skills ?? []).find(
            (s) => s.name.toLowerCase() === skillName
          );

          if (skill) {
            output = [
              `Skill: ${skill.name}`,
              `Category: ${skill.category}`,
              `Proficiency: ${skill.proficiency}%`,
              '',
              `Icon: ${skill.iconUrl ?? 'n/a'}`,
            ];
          } else {
            output = [`Skill "${skillName}" not found`];
          }
          break;
        }
        default:
          output = commands.default(cmd);
      }

      setTerminalOutput((prev) => [...prev, `$ ${input}`, ...output, '']);
      setCurrentInput('');
      setIsProcessing(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim() && !isProcessing) {
      executeCommand(currentInput);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Terminal Header */}
      <TerminalHeader
        command="ls -la skills/"
        description="Exploring technical expertise across cloud, development, and DevOps domains"
      />

      {/* Skills Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-4">
              Technical Expertise
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Hands-on expertise across Cloud Infrastructure, DevOps, DevSecOps, Linux Administration, Infrastructure Automation, Cloud Security, and Modern Platform Engineering.
            </p>
          </motion.div>

          {isLoading && <LoadingState label="Fetching skills..." />}
          {isError && (
            <ErrorState
              message={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          )}
          {!isLoading && !isError && categories.length === 0 && (
            <EmptyState message="No skills to display yet." />
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              {categories.map((category, categoryIndex) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-bg-surface border border-neutral-700 rounded-xl overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="bg-bg-elevated border-b border-neutral-700 p-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-neutral-800 ${category.color}`}>
                          <IconComponent size={24} />
                        </div>
                        <h3 className="font-mono text-xl font-semibold text-primary-500">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {category.skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skill.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05), duration: 0.4 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-bg-elevated border border-neutral-700 p-4 rounded-lg hover:border-primary-500/50 transition-all duration-300 group"
                          >{category.id === 'cert' ? (
                  <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                    <img
                      src={skill.iconUrl ?? undefined}
                      alt={skill.name}
                      className="w-16 h-16 object-contain"
                    />

                    <h3 className="font-mono text-xl text-neutral-100 font-semibold">
                      {skill.name}
                    </h3>

                    <div className="flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-sm border border-primary-500/30">
                        Verified Certification
                      </span>
                    </div>
                  </div>
                ) : (
                      <>

                            <div className="flex items-center space-x-3 mb-3">
                              <img
  src={skill.iconUrl ?? undefined}
  alt={skill.name}
  className="w-8 h-8 object-contain opacity-90 group-hover:scale-110 transition-all duration-300"
/>
                              <span className="font-mono font-medium text-neutral-200">
                                {skill.name}
                              </span>
                            </div>

                            {/* Proficiency Bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-neutral-400">Proficiency</span>
                                <span className="text-primary-500 font-mono">{skill.proficiency}%</span>
                              </div>
                              <div className="w-full bg-neutral-700 rounded-full h-1">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${skill.proficiency}%` }}
                                  transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.3, duration: 0.8 }}
                                  viewport={{ once: true }}
                                  className="h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full"
                                />
                              </div>
                            </div>
                          </>
                        )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Terminal */}
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
              Interactive Skill Explorer
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Explore technologies, certifications, cloud platforms, and DevSecOps expertise through an interactive terminal interface.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-bg-elevated border border-neutral-700 rounded-xl overflow-hidden shadow-card">
              {/* Terminal Header */}
              <div className="bg-bg-surface border-b border-neutral-700 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                </div>
                <span className="font-mono text-sm text-neutral-400">skills-terminal</span>
              </div>

              {/* Terminal Content */}
              <div className="p-6 font-mono text-sm bg-bg-page h-96 overflow-y-auto">
                {terminalOutput.length === 0 && (
                  <div className="text-neutral-400">
                    <Typewriter
                      text='Initializing Skill Database...

Loading Cloud Infrastructure...
Loading DevSecOps Toolchain...
Loading Cybersecurity Stack...

Type "help" to begin. '
                      delay={30}
                      className="block"
                    />
                    <div className="mt-4">
                      <span className="text-accent-500">$</span>
                      <span className="text-neutral-400 ml-2">ready for input...</span>
                    </div>
                  </div>
                )}

                {terminalOutput.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.startsWith('$') ? 'text-accent-500' :
                      line.includes('Command not found') ? 'text-red-500' :
                      'text-neutral-200'
                    }`}
                  >
                    {line}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex items-center space-x-2">
                    <span className="text-accent-500">$</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}

                {/* Input Line */}
                <div className="flex items-center">
                  <span className="text-accent-500 mr-2">$</span>
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent text-primary-500 outline-none placeholder-neutral-600 font-mono"
                    placeholder={isProcessing ? "processing..." : "enter command..."}
                    disabled={isProcessing}
                  />
                  {!isProcessing && (
                    <div className="w-2 h-5 bg-primary-500 animate-pulse ml-1" />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Commands */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { cmd: 'help', desc: 'Show all commands' },
                { cmd: 'ls cloud', desc: 'Cloud skills' },
                { cmd: 'levels', desc: 'Display proficiency guide' },
                { cmd: 'cat Docker', desc: 'Skill details' },
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => setCurrentInput(item.cmd)}
                  className="p-3 bg-bg-elevated border border-neutral-700 rounded-lg text-left hover:border-primary-500/50 transition-colors group"
                >
                  <div className="font-mono text-sm text-primary-500 group-hover:text-primary-400">
                    $ {item.cmd}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};