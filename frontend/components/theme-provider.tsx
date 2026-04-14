"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Suppress the React 19 false positive warning from next-themes's script injection
// Doing this OUTSIDE the component prevents crashing React 19's render-phase console patching.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag while rendering React component")) {
      return; // Filter out this specific warning
    }
    orig.apply(console, args);
  };
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}