"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PanelRightClose } from "lucide-react";
import { useShellStore } from "@/stores/shell-store";

export function PropertiesPanel() {
  const propertiesOpen = useShellStore((s) => s.propertiesOpen);
  const toggleProperties = useShellStore((s) => s.toggleProperties);

  return (
    <AnimatePresence initial={false}>
      {propertiesOpen ? (
        <motion.aside
          key="properties-panel"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="hidden shrink-0 overflow-hidden border-l border-border bg-surface md:block"
          aria-label="Properties Panel"
        >
          <div className="flex h-full w-[280px] flex-col">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <h2 className="text-caption font-medium text-foreground">
                Properties Panel
              </h2>
              <button
                type="button"
                onClick={toggleProperties}
                className="rounded-control p-2 text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground"
                aria-label="Collapse properties panel"
              >
                <PanelRightClose className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center p-4">
              <p className="text-center text-caption text-foreground-muted">
                Reserved for document and selection properties.
              </p>
            </div>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
