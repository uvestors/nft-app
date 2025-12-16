import { ReactNode } from "react";

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

export default RootLayout;
