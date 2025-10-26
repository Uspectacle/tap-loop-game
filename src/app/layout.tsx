import { GameProvider } from "@/components/GameProvider";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./Layout.css";

export const metadata: Metadata = {
  title: "Tap Loop Game",
  description: "Find the smallest loop taping every block",
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
        <div className="layout">
          <main className="main">
            <h1>Tap Loop Game</h1>
            <p className="description">
              Find the smallest loop taping every block.{" "}
              <a
                href="https://github.com/Uspectacle/tap-loop-game"
                target="_blank"
                rel="noopener noreferrer"
                className="github-link"
              >
                Learn more on <FontAwesomeIcon icon={faGithub} /> Github
              </a>
            </p>
            <Suspense fallback={<p>Loading...</p>}>
              <GameProvider>{children}</GameProvider>
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}
