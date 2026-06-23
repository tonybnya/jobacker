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

export type User = {
  id: string;
  email: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  resume_pdf_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string | null;
  type: ApplicationType;
  job_url: string | null;
  status: ApplicationStatus;
  date_applied: string;
  spy_status: SpyStatus;
  follow_up_count: number;
  notes: string | null;
  job_description: string | null;
  latest_score_id: string | null;
  created_at: string;
  updated_at: string;
};

export type SkillsMatch = {
  skill: string;
  match_percent: number;
};

export type MissingKeyword = {
  keyword: string;
  suggestion: string;
};

export type Improvement = {
  tag: ImprovementTag;
  text: string;
};

export type ResumeScore = {
  id: string;
  application_id: string;
  user_id: string;
  overall_score: number;
  keyword_score: number;
  ats_score: number;
  impact_score: number;
  readability_score: number;
  skills_match: SkillsMatch[];
  pros: string[];
  cons: string[];
  missing_keywords: MissingKeyword[];
  improvements: Improvement[];
  sample_resume_text: string | null;
  tailored_resume_pdf_url: string | null;
  cover_letter: string | null;
  resume_text_used: string | null;
  created_at: string;
};

export type DashboardStats = {
  totalApplications: number;
  avgResumeScore: number | null;
  interviewsLanded: number;
  offersReceived: number;
};

export type ActivityItem = {
  id: string;
  type: "score" | "application" | "cover_letter" | "tailored_resume";
  description: string;
  timestamp: string;
  color: string;
};

export type AnalyticsData = {
  applicationsOverTime: Array<{ date: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  pipelineFunnel: Array<{ status: string; count: number }>;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
