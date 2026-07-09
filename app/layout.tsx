import type { Metadata } from "next/dist/types";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLP Admin",
  description: "Administration dashboard for the Lecture Learning Platform",
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = savedTheme || preferredTheme;
  } catch {
    document.documentElement.dataset.theme = 'light';
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
