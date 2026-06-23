import { useState } from "react";
import { PlusSignIcon, ListViewIcon, GridViewIcon } from "hugeicons-react";
import { useApplications } from "@/hooks/useApplications";
import { ApplicationFilters } from "@/components/applications/ApplicationFilters";
import { ApplicationsTable } from "@/components/applications/ApplicationsTable";
import { PipelineView } from "@/components/applications/PipelineView";
import { ApplicationModal } from "@/components/applications/ApplicationModal";
import type { Application, ApplicationStatus } from "@/types";

export function ApplicationsPage() {
  const {
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
  } = useApplications();

  const [view, setView] = useState<"table" | "pipeline">("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [editApp, setEditApp] = useState<Partial<Application> | null>(null);

  const handleSave = async (data: Partial<Application>) => {
    if (editApp?.id) {
      return updateApplication(editApp.id, data);
    }
    return createApplication(data);
  };

  const handleEdit = (app: Application) => {
    setEditApp(app);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this application?")) {
      await deleteApplication(id);
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    await updateApplication(id, { status });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-text">Applications</h1>
          <p className="mt-1 text-xs text-text-muted">
            Track and manage your job applications
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditApp(null);
            setModalOpen(true);
          }}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber px-4 py-2 text-xs font-medium text-primary transition-opacity hover:opacity-90"
        >
          <PlusSignIcon className="h-3.5 w-3.5" />
          Log Application
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <ApplicationFilters filters={filters} onChange={setFilters} />
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-0.5">
          <button
            type="button"
            onClick={() => setView("table")}
            className={`flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              view === "table" ? "bg-amber text-primary" : "text-text-muted hover:text-text"
            }`}
          >
            <ListViewIcon className="h-3.5 w-3.5" />
            Table
          </button>
          <button
            type="button"
            onClick={() => setView("pipeline")}
            className={`flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
              view === "pipeline" ? "bg-amber text-primary" : "text-text-muted hover:text-text"
            }`}
          >
            <GridViewIcon className="h-3.5 w-3.5" />
            Pipeline
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <svg className="h-5 w-5 animate-spin text-text-muted" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : view === "table" ? (
        <ApplicationsTable
          applications={applications}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          pageSize={pageSize}
          total={total}
        />
      ) : (
        <PipelineView
          applications={applications}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      )}

      <ApplicationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditApp(null);
        }}
        onSave={handleSave}
        application={editApp}
      />
    </div>
  );
}
