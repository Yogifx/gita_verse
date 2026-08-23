import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {children}
    </div>
  );
}
