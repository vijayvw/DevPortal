import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { calculateReadingTime } from "../../utils/readingTime";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  useProject,
  useRecordProjectView,
  useLikeProject,
  useUnlikeProject,
} from "../../queries/useProject";
import { CodeBlock } from "../common/CodeBlock";
import {
  Calendar,
 Clock,
  X,
  Github,
  ExternalLink,
  PlayCircle,
  Heart,
} from "lucide-react";
interface Props {
  open: boolean;
  project: {
    slug: string;
  } | null;
  onClose: () => void;
}

export function ProjectDetailsModal({
  open,
  project,
  onClose,
}: Props) {
  const {
    data,
    isLoading,
    isError,
  } = useProject(project?.slug);
  const statusColors: Record<string, string> = {
  COMPLETED: "bg-green-500/20 text-green-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  PLANNED: "bg-yellow-500/20 text-yellow-400",
  ARCHIVED: "bg-neutral-700 text-neutral-300",
};

  const recordView = useRecordProjectView();
  const likeMutation = useLikeProject();
  const unlikeMutation = useUnlikeProject();

  const likedKey = `liked-project-${project?.slug}`;
  const viewedKey = `viewed-project-${project?.slug}`;

  const [liked, setLiked] = useState(false);

  useEffect(() => {

    if (!project?.slug) return;

    setLiked(localStorage.getItem(likedKey) === "true");

  }, [project?.slug]);

  // Close with ESC
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  useEffect(() => {
  if (!open || !project?.slug) return;

  if (localStorage.getItem(viewedKey)) return;

  recordView.mutate(project.slug);

  localStorage.setItem(viewedKey, "true");
}, [open, project, viewedKey]);

console.log("LONG DESCRIPTION:");
console.log(data?.longDescription);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="
            relative
            w-full
            max-w-5xl
            h-[95vh]
            rounded-2xl
            border
            border-neutral-700
            bg-bg-surface
            shadow-2xl
            overflow-hidden
            flex
            flex-col
            "
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
            >
              <X size={22} />
            </button>

            {/* Loading */}
            {isLoading && (
              <div className="flex h-96 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="flex h-96 items-center justify-center">
                <div className="text-red-500">
                  Failed to load project.
                </div>
              </div>
            )}

            {/* Content */}
              {data && (
                <div className="flex h-full flex-col">
                  {/* Hero */}
                  <div className="relative h-80 shrink-0 overflow-hidden">

                    {data.coverImageUrl ? (
                      <img
                        src={data.coverImageUrl}
                        alt={data.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-bg-surface/30 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8">

                      {/* Badges */}
                      <div className="mb-4 flex flex-wrap gap-2">

                        <span className="rounded-full bg-primary-500/20 px-3 py-1 text-xs text-primary-400">
                          {data.category}
                        </span>

                        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400">
                          {data.difficulty}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            statusColors[data.status] ??
                            "bg-neutral-700 text-neutral-300"
                          }`}
                        >
                          {data.status.replace(/_/g, " ")}
                        </span>

                      </div>

                      <h2 className="font-mono text-4xl font-bold text-white">
                        {data.title}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-6 text-sm text-neutral-300">

                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(data.createdAt).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {calculateReadingTime(
                            `${data.shortDescription ?? ""} ${data.longDescription ?? ""}`
                          )}{" "}
                          min read
                        </div>


                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          animate={
                            liked
                              ? {
                                  scale: [1, 1.25, 1],
                                }
                              : {
                                  scale: 1,
                                }
                          }
                          transition={{ duration: 0.25 }}
                          onClick={() => {
                            if (!project?.slug) return;

                            if (liked) {
                              unlikeMutation.mutate(project.slug);
                              localStorage.removeItem(likedKey);
                              setLiked(false);
                            } else {
                              likeMutation.mutate(project.slug);
                              localStorage.setItem(likedKey, "true");
                              setLiked(true);
                            }
                          }}
                          className={`flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300 ${
                            liked
                              ? "bg-green-500/20 text-green-400 shadow-lg shadow-green-500/20"
                              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          <Heart
                            size={18}
                            className={`transition-all duration-300 ${
                              liked ? "fill-green-400 text-green-400" : ""
                            }`}
                          />
                            <span>
  {liked ? "Liked" : "Like"}
</span>
                        </motion.button>

                      </div>

                    </div>

                  </div>
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">

                      <p className="mt-3 text-lg leading-relaxed text-neutral-300">
                        {data.shortDescription}
                      </p>

                    {/* Technologies */}
                    <div>
                      <h3 className="mb-4 font-mono text-xl font-semibold text-white">
                        Technologies
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {data.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-300 transition hover:border-primary-500 hover:text-primary-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    {data.longDescription && (
                      <div>
                        <h3 className="mb-4 font-mono text-xl font-semibold text-white">
                          Project Overview
                        </h3>

                        <div className="markdown-body">
                      
  <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeRaw]}
  components={{
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return match ? (
        <CodeBlock
          title={match[1]}
          code={String(children).replace(/\n$/, "")}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {data.longDescription}
</ReactMarkdown>
</div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-2">

                      {data.githubUrl && (
                        <a
                          href={data.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
                        >
                          <Github size={18} />
                          <span>GitHub</span>
                        </a>
                      )}
                      

                      {data.liveUrl && (
                        <a
                          href={data.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-6 py-3 font-medium text-black transition hover:bg-primary-400"
                        >
                          <ExternalLink size={18} />
                          <span>Live Demo</span>
                        </a>
                      )}

                      {data.videoUrl && (
                        <a
                          href={data.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-6 py-3 font-medium text-neutral-300 transition hover:border-primary-500 hover:text-primary-400"
                        >
                          <PlayCircle size={18} />
                          <span>Watch Demo</span>
                        </a>
                      )}
                    </div>

                    {data.architectureDiagramUrl && (
                      <div>
                        <h3 className="mb-4 font-mono text-xl font-semibold text-white">
                          Architecture Diagram
                        </h3>

                        <div className="overflow-hidden rounded-xl border border-neutral-700">
                          <img
                            src={data.architectureDiagramUrl}
                            alt="Architecture Diagram"
                            className="max-h-[700px] w-full rounded-xl object-contain bg-neutral-900"
                          />
                        </div>
                      </div>
                    )}
                    {data.galleryImages?.length > 0 && (
                      <div>
                        <h3 className="mb-4 font-mono text-xl font-semibold text-white">
                          Gallery
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {data.galleryImages.map((image, index) => (
                            <motion.img
                              key={index}
                              whileHover={{ scale: 1.03 }}
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="aspect-video rounded-xl border border-neutral-700 object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {data.lessonsLearned && (
                      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
                        <h3 className="mb-4 font-mono text-xl text-green-400">
                          Lessons Learned
                        </h3>

                        <div className="whitespace-pre-line text-neutral-300">
                          {data.lessonsLearned}
                        </div>
                      </div>
                    )}

                    {data.challenges && (
                      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                        <h3 className="mb-4 font-mono text-xl text-red-400">
                          Challenges
                        </h3>

                        <div className="whitespace-pre-line text-neutral-300">
                          {data.challenges}
                        </div>
                      </div>
                    )}

                    {data.solutions && (
                      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
                        <h3 className="mb-4 font-mono text-xl text-blue-400">
                          Solutions
                        </h3>

                        <div className="whitespace-pre-line text-neutral-300">
                          {data.solutions}
                        </div>
                      </div>
                    )}

                    {data.futureImprovements && (
                      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
                        <h3 className="mb-4 font-mono text-xl text-yellow-400">
                          Future Improvements
                        </h3>

                        <div className="whitespace-pre-line text-neutral-300">
                          {data.futureImprovements}
                        </div>
                      </div>
                    )}

                    {data.dockerCompose && (
                      <CodeBlock
                        title="Docker Compose"
                        code={data.dockerCompose}
                      />
                    )}
                 
                    {data.dockerfile && (
                      <CodeBlock
                        title="Dockerfile"
                        code={data.dockerfile}
                      />
                    )}

                    {data.terraformCode && (
                      <CodeBlock
                        title="Terraform"
                        code={data.terraformCode}
                      />
                    )}

                    {data.helmCharts && (
                      <CodeBlock
                        title="Helm Charts"
                        code={data.helmCharts}
                      />
                    )}

                    {data.kubernetesYaml && (
                      <CodeBlock
                        title="Kubernetes YAML"
                        code={data.kubernetesYaml}
                      />
                    )}
                  </div>
                </div>
              )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}