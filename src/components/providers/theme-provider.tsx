/**
 * ThemeProvider — wraps the app with next-themes for dark/light mode support.
 *
 * This is a client component that provides theme context to all children.
 * Used in the root layout to enable system-wide theming.
 */

'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
