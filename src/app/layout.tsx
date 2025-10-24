import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tap Loop Game",
  description: "Find the smallest loop taping every cells",
  manifest: "manifest.json",
  icons: "logo.svg",
  robots: "robots.txt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
