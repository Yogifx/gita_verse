"use client";

import { useShellStore } from "@/stores/shell-store";
import { THEME_OPTIONS } from "@/constants/theme";
import { SectionCard } from "@/components/shared/SectionCard";
import { ThemeOptionCard } from "@/features/theme/components/ThemeOptionCard";
import { ThemeLivePreview } from "@/features/theme/components/ThemeLivePreview";
import { ThemeTokenReference } from "@/features/theme/components/ThemeTokenReference";

export function ThemeManagerView() {
  const theme = useShellStore((s) => s.theme);
  const setTheme = useShellStore((s) => s.setTheme);

  return (
    <div className="flex flex-col gap-5">
      <SectionCard
        title="Appearance"
        description="Choose how GitaVerse looks. Dark is the default studio experience; Light is available in early preview."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {THEME_OPTIONS.map((option) => (
            <ThemeOptionCard
              key={option.id}
              option={option}
              active={theme === option.id}
              onSelect={setTheme}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Live Preview"
        description="These are real GitaVerse components, rendered live under the theme you selected above."
      >
        <ThemeLivePreview />
      </SectionCard>

      <SectionCard
        title="Design Tokens"
        description="The semantic color tokens currently in effect. See docs/18_DESIGN_TOKENS.md for the full reference."
      >
        <ThemeTokenReference />
      </SectionCard>
    </div>
  );
}
