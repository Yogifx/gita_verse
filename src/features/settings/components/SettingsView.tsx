import { ProfileSettingsCard } from "@/features/settings/components/ProfileSettingsCard";
import { WorkspacePreferencesCard } from "@/features/settings/components/WorkspacePreferencesCard";
import { AppearanceLinkCard } from "@/features/settings/components/AppearanceLinkCard";

export function SettingsView() {
  return (
    <div className="flex flex-col gap-5">
      <ProfileSettingsCard />
      <WorkspacePreferencesCard />
      <AppearanceLinkCard />
    </div>
  );
}
