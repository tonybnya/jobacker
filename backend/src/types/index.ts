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
