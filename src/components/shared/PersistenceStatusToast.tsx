"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { usePersistenceStatusStore } from "@/stores/persistence-status-store";

const AUTO_DISMISS_MS = 6000;

/**
 * Surfaces persistence read/write failures (GV-011). Mounted once in
 * AppLayout so any feature store can report a failed API call without each
 * feature needing its own error UI.
 */
export function PersistenceStatusToast() {
  const message = usePersistenceStatusStore((s) => s.message);
  const clear = usePersistenceStatusStore((s) => s.clear);

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(clear, AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [message, clear]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex max-w-md items-start gap-3 rounded-control border border-danger-muted bg-surface px-4 py-3 shadow-lg"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <p className="text-caption text-foreground-secondary">{message}</p>
            <button
              type="button"
              onClick={clear}
              aria-label="Dismiss"
              className="ml-1 shrink-0 rounded-control p-1 text-foreground-muted transition-colors duration-fast hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
