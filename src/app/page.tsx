import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/sign-in");
}
