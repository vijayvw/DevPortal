import { FormEvent, useEffect, useState } from "react";
import { Plus, Save, Trash2, UserRound } from "lucide-react";
import {
  getPortfolioSettings,
  updatePortfolioSettings,
  type AboutTimelineItem,
} from "../../../api/services/adminSettings.service";
import { useQueryClient } from "@tanstack/react-query";

const DEFAULT_GREETING =
  "Hello, I'm Vijay vw, and I transform ideas into scalable, secure, and reliable infrastructure.";

const DEFAULT_PARAGRAPHS = [
  "I engineer secure infrastructure, automate complex systems, and build cloud-native platforms that are designed for resilience from day one. My work sits at the intersection of DevOps, Cloud Engineering, Cybersecurity, and Infrastructure Automation, where reliability is treated as a security feature rather than an afterthought.",
  "Instead of simply deploying applications, I focus on building production-ready ecosystems. Every server, container, pipeline, and Kubernetes cluster should be reproducible, observable, and resilient against failure. I believe modern infrastructure should be version-controlled, automatically provisioned, continuously validated, and secure by default.",
  "My engineering journey began with Linux system administration, where understanding operating systems and networking became the foundation for everything that followed. That curiosity gradually expanded into container technologies, Kubernetes orchestration, Infrastructure as Code, CI/CD automation, cloud architecture, and offensive security practices.",
  "Alongside AWS and DevOps, I continuously expand my expertise in Azure, GCP, cloud security, infrastructure automation, and modern engineering practices to build secure, resilient, and production-ready systems.",
  "Today I work extensively with AWS, Docker, Kubernetes, Terraform, GitHub Actions, Jenkins, Linux, and modern cloud-native tooling while continuously expanding my expertise in cloud security, container hardening, vulnerability assessment, identity management, and secure software delivery.",
  "Beyond building systems, I enjoy understanding how they fail. I actively explore penetration testing methodologies, Capture The Flag challenges, infrastructure hardening, and attack simulations because designing secure platforms begins with understanding how they can be compromised.",
  "For me, infrastructure is more than servers and deployments — it's an engineering discipline that combines automation, scalability, performance, observability, and security into one cohesive system. My long-term mission is to become a Cloud Security Engineer capable of designing highly available, globally distributed, self-healing infrastructure that remains secure throughout its entire lifecycle.",
];

const DEFAULT_SPECIALIZATIONS = [
  "Cloud Security",
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
  "Shell Scripting",
];

const DEFAULT_TIMELINE: AboutTimelineItem[] = [
  {
    year: "2026 - Present",
    title: "Building Secure Cloud-Native Platforms",
    organization: "DevOps & Cloud Engineering",
    description:
      "Designing and deploying cloud-native infrastructure using AWS, Kubernetes, Docker, Terraform, GitHub Actions, Jenkins, and Linux while focusing on automation, security, Infrastructure as Code, and production-ready deployments.",
    icon: "Code",
  },
  {
    year: "2022 - 2025",
    title: "Bachelor of Computer Applications (BCA)",
    organization: "Deogiri Institute Of Technology And Management Studies",
    description:
      "Focused on cloud computing, Linux, networking, and DevOps foundations.",
    icon: "Calendar",
  },
];

interface AboutForm {
  aboutGreeting: string;
  aboutParagraphs: string[];
  aboutQuote: string;
  aboutGoal: string;
  specializations: string[];
  timelineTitle: string;
  timelineSubtitle: string;
  timeline: AboutTimelineItem[];
}

const emptyTimelineItem = (): AboutTimelineItem => ({
  year: "",
  title: "",
  organization: "",
  description: "",
  icon: "Code",
});

export default function AboutCard() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState<AboutForm>({
    aboutGreeting: DEFAULT_GREETING,
    aboutParagraphs: DEFAULT_PARAGRAPHS,
    aboutQuote:
      "I don't just automate deployments.\nI engineer platforms that can be trusted.",
    aboutGoal:
      "My goal is to build infrastructure that is scalable by design, secure by default, and automated for the future.",
    specializations: DEFAULT_SPECIALIZATIONS,
    timelineTitle: "Career Timeline",
    timelineSubtitle: "My journey from learning to DevOps engineering",
    timeline: DEFAULT_TIMELINE,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getPortfolioSettings();

        setForm({
          aboutGreeting: settings.aboutGreeting ?? DEFAULT_GREETING,
          aboutParagraphs:
            settings.aboutParagraphs?.length
              ? settings.aboutParagraphs
              : DEFAULT_PARAGRAPHS,
          aboutQuote:
            settings.aboutQuote ??
            "I don't just automate deployments.\nI engineer platforms that can be trusted.",
          aboutGoal:
            settings.aboutGoal ??
            "My goal is to build infrastructure that is scalable by design, secure by default, and automated for the future.",
          specializations:
            settings.specializations?.length
              ? settings.specializations
              : DEFAULT_SPECIALIZATIONS,
          timelineTitle:
            settings.timelineTitle ?? "Career Timeline",
          timelineSubtitle:
            settings.timelineSubtitle ??
            "My journey from learning to DevOps engineering",
          timeline:
            settings.timeline?.length
              ? settings.timeline
              : DEFAULT_TIMELINE,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load About settings.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateParagraph(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      aboutParagraphs: prev.aboutParagraphs.map((item, i) =>
        i === index ? value : item
      ),
    }));
  }

  function addParagraph() {
    setForm((prev) => ({
      ...prev,
      aboutParagraphs: [...prev.aboutParagraphs, ""],
    }));
  }

  function removeParagraph(index: number) {
    setForm((prev) => ({
      ...prev,
      aboutParagraphs: prev.aboutParagraphs.filter((_, i) => i !== index),
    }));
  }

  function updateSpecializations(value: string) {
    setForm((prev) => ({
      ...prev,
      specializations: value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  }

  function updateTimeline(
    index: number,
    field: keyof AboutTimelineItem,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }

  function addTimelineItem() {
    setForm((prev) => ({
      ...prev,
      timeline: [...prev.timeline, emptyTimelineItem()],
    }));
  }

  function removeTimelineItem(index: number) {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      await updatePortfolioSettings({
        aboutGreeting: form.aboutGreeting.trim(),
        aboutParagraphs: form.aboutParagraphs
          .map((item) => item.trim())
          .filter(Boolean),
        aboutQuote: form.aboutQuote.trim(),
        aboutGoal: form.aboutGoal.trim(),
        specializations: form.specializations
          .map((item) => item.trim())
          .filter(Boolean),
        timelineTitle: form.timelineTitle.trim(),
        timelineSubtitle: form.timelineSubtitle.trim(),
        timeline: form.timeline.map((item) => ({
          year: item.year.trim(),
          title: item.title.trim(),
          organization: item.organization?.trim() ?? "",
          description: item.description.trim(),
          icon: item.icon?.trim() || "Code",
        })),
      });

      await queryClient.invalidateQueries({
        queryKey: ["public-settings"],
      });

      setMessage("About settings saved successfully.");
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save About settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        Loading About settings...
      </div>
    );
  }

  const specializationsText = form.specializations.join("\n");

  return (
    <form
      onSubmit={handleSave}
      className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-blue-600/20 p-2">
          <UserRound className="h-5 w-5 text-blue-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">About Settings</h2>
          <p className="text-sm text-zinc-400">
            Manage your About page content, specializations, and career
            timeline.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            About Greeting
          </label>
          <textarea
            value={form.aboutGreeting}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutGreeting: e.target.value,
              }))
            }
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">
              About Paragraphs
            </label>

            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-blue-500"
            >
              <Plus className="h-4 w-4" />
              Add Paragraph
            </button>
          </div>

          <div className="space-y-3">
            {form.aboutParagraphs.map((paragraph, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={paragraph}
                  onChange={(e) =>
                    updateParagraph(index, e.target.value)
                  }
                  rows={5}
                  placeholder={`Paragraph ${index + 1}`}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
                />

                <button
                  type="button"
                  onClick={() => removeParagraph(index)}
                  className="self-start rounded-lg border border-red-900/50 p-3 text-red-400 hover:bg-red-950/30"
                  title="Remove paragraph"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Quote
          </label>
          <textarea
            value={form.aboutQuote}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutQuote: e.target.value,
              }))
            }
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Closing Goal
          </label>
          <textarea
            value={form.aboutGoal}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                aboutGoal: e.target.value,
              }))
            }
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Specializations
          </label>
          <p className="mb-2 text-xs text-zinc-500">
            Enter one specialization per line.
          </p>
          <textarea
            value={specializationsText}
            onChange={(e) => updateSpecializations(e.target.value)}
            rows={10}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-zinc-300">
                Career Timeline
              </label>
              <p className="mt-1 text-xs text-zinc-500">
                Add, edit, or remove your career and education entries.
              </p>
            </div>

            <button
              type="button"
              onClick={addTimelineItem}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-200 hover:border-blue-500"
            >
              <Plus className="h-4 w-4" />
              Add Timeline
            </button>
          </div>

          <div className="space-y-5">
            {form.timeline.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-zinc-200">
                    Timeline Entry {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeTimelineItem(index)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-900/50 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={item.year}
                    onChange={(e) =>
                      updateTimeline(index, "year", e.target.value)
                    }
                    placeholder="Year / Period"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                  />

                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateTimeline(index, "title", e.target.value)
                    }
                    placeholder="Title"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                  />

                  <input
                    value={item.organization ?? ""}
                    onChange={(e) =>
                      updateTimeline(
                        index,
                        "organization",
                        e.target.value
                      )
                    }
                    placeholder="Organization / College"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                  />

                  <input
                    value={item.icon ?? ""}
                    onChange={(e) =>
                      updateTimeline(index, "icon", e.target.value)
                    }
                    placeholder="Icon (Code or Calendar)"
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                  />

                  <textarea
                    value={item.description}
                    onChange={(e) =>
                      updateTimeline(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    placeholder="Description"
                    rows={4}
                    className="md:col-span-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {message && (
          <div className="rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-5 w-5" />
          {saving ? "Saving..." : "Save About Settings"}
        </button>
      </div>
    </form>
  );
}
