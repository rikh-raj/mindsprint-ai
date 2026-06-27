"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-2xl border border-white/15 bg-black/95 p-0 text-white shadow-2xl backdrop-blur-xl",
        "open:animate-in open:fade-in-0"
      )}
      aria-labelledby="dialog-title"
    >
      <div className="border-b border-white/10 px-6 py-4">
        <h2 id="dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
      </div>
      <div className="px-6 py-4">{children}</div>
      <form method="dialog" className="border-t border-white/10 px-6 py-4">
        <button
          type="submit"
          className="w-full rounded-xl border border-white/20 bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Close
        </button>
      </form>
    </dialog>
  );
}
