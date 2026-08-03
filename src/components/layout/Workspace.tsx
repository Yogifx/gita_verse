"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getRouteByPathname } from "@/constants/navigation";

type WorkspaceProps = {
  children: ReactNode;
};

export function Workspace({ children }: WorkspaceProps) {
  const pathname = usePathname();
  const route = getRouteByPathname(pathname);
  const title = route?.title ?? "Workspace";

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <div className="border-b border-border px-4 py-4 md:px-6">
        <h1 className="font-display text-h2 text-foreground">{title}</h1>
        {route?.description ? (
          <p className="mt-1 max-w-2xl text-caption text-foreground-secondary">
            {route.description}
          </p>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto p-4 md:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            className="h-full min-h-[16rem]"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
