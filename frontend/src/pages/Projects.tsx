import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TerminalHeader } from '../components/TerminalHeader';
import { useProjects } from '../queries/useProjects';
import { useRecordProjectView } from '../queries/useProject';
import { LoadingState } from '../components/states/LoadingState';
import { ErrorState } from '../components/states/ErrorState';
import { ProjectDetailsModal } from "../components/projects/ProjectDetailsModal";
import type { ProjectListItemDto } from "../api/types";
import { usePublicSettings } from '../hooks/usePublicSettings';
import {
  ExternalLink,
  Github,
  Filter,
  Search,
} from "lucide-react";

export const Projects = () => {
  const { data: settings } = usePublicSettings();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  

  const { data, isLoading, isError, error, refetch } = useProjects({ limit: 100 });
  const projects = data?.data ?? [];
  const [selectedProject, setSelectedProject] =
  useState<ProjectListItemDto | null>(null);


  const viewMutation = useRecordProjectView();
  const viewedProjectId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedProject?.id) return;

    if (viewedProjectId.current === selectedProject.id) return;

    viewedProjectId.current = selectedProject.id;

    viewMutation.mutate({
    id: selectedProject.id,
    slug: selectedProject.slug,
  });
  }, [selectedProject?.id, selectedProject?.slug]);

  // Filter tabs are derived from whatever categories actually exist in
  // the live data, rather than the old hardcoded ['all', 'devops'] pair —
  // necessary since categories are now backend-owned content, not a
  // frontend constant. Tab mechanism/styling is unchanged.
  const filters = useMemo(() => {
    const categoryCounts = new Map<string, number>();
    for (const project of projects) {
      categoryCounts.set(project.category, (categoryCounts.get(project.category) ?? 0) + 1);
    }
    return [
      { id: 'all', label: 'All Projects', count: projects.length },
      ...Array.from(categoryCounts.entries()).map(([id, count]) => ({ id, label: id, count })),
    ];
  }, [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      activeFilter === "all" ||
      project.category === activeFilter;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(search) ||
      project.shortDescription.toLowerCase().includes(search) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(search)
      );

    const matchesFeatured =
      !featuredOnly || project.featured;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesFeatured
    );
  });

  const visibleProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);

      case "oldest":
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );

      case "newest":
      default:
        return (
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
        );
    }
  });
    
  const totalTechnologies = new Set(projects.flatMap((p) => p.technologies)).size;
  const devopsCount = projects.filter((p) => p.category.toLowerCase() === 'devops').length;

  return (
    <div className="min-h-screen bg-black">
      {/* Terminal Header */}
      <TerminalHeader
        command="docker ps -a"
        description="Listing deployed projects and applications"
      />

      {/* Filter Tabs */}
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && <LoadingState label="Fetching projects..." />}
          {isError && (
            <ErrorState
              message={error instanceof Error ? error.message : undefined}
              onRetry={() => refetch()}
            />
          )}
          {!isLoading && !isError && (
            <>
              {/* Search */}
              <div className="mb-8 flex flex-col items-center gap-4">
                <div className="relative w-full max-w-lg">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-neutral-700 bg-bg-surface py-3 pl-11 pr-4 text-neutral-200 placeholder:text-neutral-500 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                  />
                  Featured Only
                </label>

                  {/* 👇 Add it here */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-neutral-700 bg-bg-surface px-4 py-2 text-neutral-200"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="title">A-Z</option>
                  </select>

                </div>

              {/* Category Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-mono font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? "bg-primary-500 text-bg-surface shadow-glow"
                        : "bg-bg-elevated text-neutral-200 border border-neutral-700 hover:border-primary-500/50 hover:text-primary-500"
                    }`}
                  >
                    <Filter size={16} />
                    <span>{filter.label}</span>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activeFilter === filter.id
                          ? "bg-bg-surface text-primary-500"
                          : "bg-neutral-700 text-neutral-400"
                      }`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </motion.div>
            </>
          )}
            
        </div>
      </section>

      {/* Projects Grid */}
      {!isLoading && !isError && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              layout
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onClick={() => setSelectedProject(project)}
                  className="bg-bg-surface border border-neutral-700 rounded-xl overflow-hidden group hover:border-primary-500/50 transition-all duration-300 shadow-card hover:shadow-card-hover cursor-pointer"
                >
                  {/* Project Image */}
                  <div className="relative">
                    <div className="aspect-video overflow-hidden rounded-t-xl bg-neutral-900">
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-neutral-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono ${
                          project.category.toLowerCase() === "devops"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-blue-500/20 text-blue-500"
                        }`}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>


                  {/* Project Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <h3 className="font-mono text-xl font-bold text-primary-500 group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-neutral-200 text-sm leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-neutral-800 text-neutral-300 text-xs rounded border border-neutral-700 hover:border-primary-500/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded border border-neutral-700">
                          +{project.technologies.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4 pt-4">
                      {project.githubUrl && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="flex items-center space-x-2 text-neutral-400 hover:text-primary-500 transition-colors group/btn"
                        >
                          <Github size={16} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="text-sm font-mono">Code</span>
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          onClick={(e) => e.stopPropagation()}
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-neutral-400 hover:text-primary-500 transition-colors group/btn"
                        >
                          <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="text-sm font-mono">Live</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {visibleProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="font-mono text-4xl text-neutral-600 mb-4">404</div>
                <div className="text-neutral-400">No projects found in this category.</div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Terminal-style project summary */}
      <ProjectDetailsModal
        open={!!selectedProject}
        project={selectedProject}
        onClose={() => {
          viewedProjectId.current = null;
          setSelectedProject(null);
        }}
      />
      {!isLoading && !isError && (
        <section className="py-24 bg-bg-elevated">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-bg-surface border border-neutral-700 rounded-xl p-8 font-mono"
            >
              <div className="space-y-4">
                <div className="text-accent-500">
                  $ cat project_summary.txt
                </div>

                <div className="space-y-2 text-neutral-200">
                  <div className="flex justify-between">
                    <span>Total Projects:</span>
                    <span className="text-primary-500">{projects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DevOps Projects:</span>
                    <span className="text-primary-500">{devopsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technologies Used:</span>
                    <span className="text-primary-500">
                      {totalTechnologies}+
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-700 text-sm text-neutral-400">
                  <div className="flex items-center space-x-2">
                    <span className="text-accent-500">$</span>
                    <span>echo "Each project demonstrates real-world implementation of cloud-native architecture and modern development practices"</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-bg-elevated to-bg-surface border border-primary-500/20 p-12 rounded-2xl shadow-glow"
          >
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-primary-500 mb-6">
              Interested in Collaboration?
            </h2>
            <p className="text-xl text-neutral-200 mb-8 leading-relaxed">
              These projects showcase my expertise in DevOps and Cloud Security.
              Let's discuss how we can work together on your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={settings?.github ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-500 text-bg-surface font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-glow hover:shadow-card-hover"
              >
                <Github className="mr-2 h-5 w-5" />
                View All Projects
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-neutral-600 text-neutral-200 hover:border-primary-500 hover:text-primary-500 font-semibold rounded-lg transition-all duration-200"
              >
                <ExternalLink className="mr-2 h-5 w-5" />
                Start a Project
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
