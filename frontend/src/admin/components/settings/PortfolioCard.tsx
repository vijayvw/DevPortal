import { useEffect, useState, ChangeEvent } from "react";
import { Globe } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  getPortfolioSettings,
  updatePortfolioSettings,
} from "../../../api/services/adminSettings.service";

interface PortfolioForm {
  portfolioTitle: string;
  tagline: string;
  shortDescription: string;
  yearsExperience: string;
  cloudPlatforms: string;
  technologies: string;
  email: string;
  phone: string;
  address: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
}

export default function PortfolioCard() {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<PortfolioForm>({
    portfolioTitle: "",
    tagline: "",
    shortDescription: "",
    yearsExperience: "",
    cloudPlatforms: "",
    technologies: "",
    email: "",
    phone: "",
    address: "",
    github: "",
    linkedin: "",
    twitter: "",
    resumeUrl: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updatePortfolioSettings(form);

      await queryClient.invalidateQueries({
        queryKey: ["public-settings"],
      });

      alert("Portfolio settings saved successfully!");
    } catch (err: any) {
      console.error(err);
      alert(
        err?.message ??
          "Failed to save portfolio settings."
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getPortfolioSettings();

        setForm({
          portfolioTitle:
            settings?.portfolioTitle ?? "",
          tagline:
            settings?.tagline ?? "",
          shortDescription:
            settings?.shortDescription ?? "",
          yearsExperience:
            settings?.yearsExperience ?? "",
          cloudPlatforms:
            settings?.cloudPlatforms ?? "",
          technologies:
            settings?.technologies ?? "",
          email:
            settings?.email ?? "",
          phone:
            settings?.phone ?? "",
          address:
            settings?.address ?? "",
          github:
            settings?.github ?? "",
          linkedin:
            settings?.linkedin ?? "",
          twitter:
            settings?.twitter ?? "",
          resumeUrl:
            settings?.resumeUrl ?? "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        Loading portfolio settings...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-green-600/20 p-2">
          <Globe className="h-5 w-5 text-green-400" />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Portfolio Settings
          </h2>

          <p className="text-sm text-zinc-400">
            Configure your public portfolio information.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <input
          name="portfolioTitle"
          value={form.portfolioTitle}
          onChange={handleChange}
          placeholder="Portfolio Title"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="tagline"
          value={form.tagline}
          onChange={handleChange}
          placeholder="Tagline"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <textarea
          name="shortDescription"
          value={form.shortDescription}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              shortDescription: e.target.value,
            }))
          }
          placeholder="Short Description"
          rows={4}
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white md:col-span-2"
        />

        <input
          name="yearsExperience"
          value={form.yearsExperience}
          onChange={handleChange}
          placeholder="Years Experience (e.g. 1+)"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="cloudPlatforms"
          value={form.cloudPlatforms}
          onChange={handleChange}
          placeholder="Cloud Platforms (e.g. 2)"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="Technologies (e.g. 20+)"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          value="Projects Completed — automatic"
          disabled
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-500"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address / Location"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white md:col-span-2"
        />

        <input
          name="github"
          type="url"
          value={form.github}
          onChange={handleChange}
          placeholder="GitHub URL"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="linkedin"
          type="url"
          value={form.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn URL"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="twitter"
          type="url"
          value={form.twitter}
          onChange={handleChange}
          placeholder="X / Twitter URL"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <input
          name="resumeUrl"
          type="url"
          value={form.resumeUrl}
          onChange={handleChange}
          placeholder="Resume URL"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-6 rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
        >
          {saving
            ? "Saving..."
            : "Save Portfolio Settings"}
        </button>

      </div>
    </div>
  );
}
