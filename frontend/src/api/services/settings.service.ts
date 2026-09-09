import { apiClient } from "../client";
import type { ApiEnvelope } from "../types";

export interface PublicSettings {
  portfolioTitle: string | null;
  tagline: string | null;
  shortDescription: string | null;
  yearsExperience: string | null;
  cloudPlatforms: string | null;
  technologies: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resumeUrl: string | null;

  // About page
  aboutGreeting: string | null;
  aboutParagraphs: string[];
  aboutQuote: string | null;
  aboutGoal: string | null;
  specializations: string[];
  timeline: AboutTimelineItem[];
  timelineTitle: string | null;
  timelineSubtitle: string | null;
}

export interface AboutTimelineItem {
  year: string;
  title: string;
  organization?: string;
  description: string;
  icon?: string;
}

export async function getPublicSettings(): Promise<PublicSettings | null> {
  const response = await apiClient.get<ApiEnvelope<PublicSettings | null>>(
    "/settings"
  );

  return response.data.data;
}
