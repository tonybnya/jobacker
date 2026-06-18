export function Footer() {
  return (
    <footer className="border-t border-border bg-bg py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <span className="font-mono text-[10px] tracking-wider text-text-dim">
          &copy; {new Date().getFullYear()} Jobacker. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
