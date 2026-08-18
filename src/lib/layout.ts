/** Shared shell chrome height — sidebar logo block and top bar must match. */
export const SHELL_HEADER_HEIGHT =
  "h-14" as const;

export const shellHeaderClass = `${SHELL_HEADER_HEIGHT} flex shrink-0 items-center border-border/60 border-b`;

/** Horizontal padding aligned with main page content. */
export const pageContentPadding = "px-4 md:px-6 lg:px-8";