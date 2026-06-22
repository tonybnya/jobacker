export type ApplicationStatus =
  | "applied"
  | "interviewing"
  | "offer"
  | "rejected"
  | "phone-screen"
  | "ghosted";

export type ApplicationType =
  | "on-site"
  | "part-time"
  | "remote"
  | "hybrid"
  | "internship"
  | "contract";

export type SpyStatus = "unseen" | "opened";

export type ImprovementTag = "ADD" | "REPHRASE" | "FORMAT";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  resume_pdf_url: string | null;
  resume_text: string | null;
  created_at: string;
  updated_at: string;
};
