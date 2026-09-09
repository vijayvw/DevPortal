import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface AboutTimelineItem {
  year: string;
  title: string;
  organization?: string;
  description: string;
  icon?: string;
}

export interface PortfolioSettings {
  id: string;
  portfolioTitle: string | null;
  tagline: string | null;
  shortDescription: string | null;
  yearsExperience: string | null;
  cloudPlatforms: string | null;
  technologies: string | null;
  aboutGreeting: string | null;
  aboutParagraphs: string[];
  aboutQuote: string | null;
  aboutGoal: string | null;
  specializations: string[];
  timeline: AboutTimelineItem[];
  timelineTitle: string | null;
  timelineSubtitle: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePortfolioRequest {
  portfolioTitle?: string;
  tagline?: string;
  shortDescription?: string;
  yearsExperience?: string;
  cloudPlatforms?: string;
  technologies?: string;
  aboutGreeting?: string;
  aboutParagraphs?: string[];
  aboutQuote?: string;
  aboutGoal?: string;
  specializations?: string[];
  timeline?: AboutTimelineItem[];
  timelineTitle?: string;
  timelineSubtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  resumeUrl?: string;
}

export async function getPortfolioSettings() {
  const response = await apiClient.get<
    ApiEnvelope<PortfolioSettings>
  >("/admin/settings");

  return response.data.data;
}

export async function updatePortfolioSettings(
  data: UpdatePortfolioRequest
) {
  const response = await apiClient.patch<
    ApiEnvelope<PortfolioSettings>
  >(
    "/admin/settings",
    data
  );

  return response.data.data;
}
