import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Your Name | Product Recommendations",
  description:
    "Curated product recommendations from Instagram, YouTube & Shorts reviews. Tech, beauty, home & fashion picks I actually use.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Your Name | Product Recommendations",
    description: "Curated product recommendations I actually use and trust.",
    type: "website",
  },
};

// Runs before React hydrates so there is no dark/light flash on load.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
