import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "@/lib/api-client";
import type { Application } from "@/types";

export interface ApplicationsFilters {
  search: string;
  status: string;
  type: string;
  sort: string;
  page: number;
}

interface UseApplicationsReturn {
  applications: Application[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  filters: ApplicationsFilters;
  setFilters: (f: Partial<ApplicationsFilters>) => void;
  createApplication: (data: Partial<Application>) => Promise<Application | null>;
  updateApplication: (id: string, data: Partial<Application>) => Promise<Application | null>;
  deleteApplication: (id: string) => Promise<boolean>;
}

export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [filters, setFiltersState] = useState<ApplicationsFilters>({
    search: "",
    status: "all",
    type: "all",
    sort: "newest",
    page: 1,
  });
  const [version, setVersion] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const setFilters = useCallback((f: Partial<ApplicationsFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...f, page: f.page ?? (f.search !== undefined || f.status !== undefined || f.type !== undefined || f.sort !== undefined ? 1 : prev.page) }));
  }, []);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const isInitial = applications.length === 0;
    if (isInitial) setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    params.set("page", String(filters.page));

    apiFetch<Application[]>(`/applications?${params.toString()}`)
      .then((res) => {
        if (controller.signal.aborted) return;
        if (res.success && Array.isArray(res.data)) {
          setApplications(res.data);
          setTotal("total" in res && typeof (res as Record<string, unknown>).total === "number" ? (res as Record<string, unknown>).total as number : res.data.length);
          setPage(filters.page);
        } else {
          console.error("[useApplications] fetch failed:", res.error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [filters, version]);

  const createApplication = useCallback(async (data: Partial<Application>) => {
    const res = await apiFetch<Application>("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.success && res.data) {
      setApplications((prev) => [res.data!, ...prev]);
      setTotal((t) => t + 1);
      setVersion((v) => v + 1);
      return res.data;
    }
    console.error("[useApplications] create failed:", res.error);
    return null;
  }, []);

  const updateApplication = useCallback(async (id: string, data: Partial<Application>) => {
    const res = await apiFetch<Application>(`/applications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    if (res.success && res.data) {
      setVersion((v) => v + 1);
      return res.data;
    }
    return null;
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    const res = await apiFetch(`/applications/${id}`, { method: "DELETE" });
    if (res.success) {
      setVersion((v) => v + 1);
      return true;
    }
    return false;
  }, []);

  return {
    applications,
    total,
    page,
    pageSize,
    loading,
    filters,
    setFilters,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}
