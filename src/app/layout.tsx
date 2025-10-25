import type { Metadata } from "next";
import "./Layout.css";
import { GameProvider } from "@/components/GameProvider";

export const metadata: Metadata = {
  title: "Tap Loop Game",
  description: "Find the smallest loop taping every cells",
  manifest: "manifest.json",
  icons: "logo.svg",
  robots: "robots.txt",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          <div className="layout">
            <main className="main">
              <h1>Tap Loop Game</h1>
              <p>Find the smallest loop taping every cells</p>
              {children}
            </main>
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
