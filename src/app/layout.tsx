import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://surprise-with-code-d23k2r3ux-gitrupags-projects.vercel.app"),

  title: {
    default: "Surprise With Code 💖",
    template: "%s | Surprise With Code",
  },

  description: "Someone made this for you 💌 Tap to reveal your surprise.",

  openGraph: {
    title: "Surprise With Code 💖",
    description: "Someone made this for you 💌 Tap to reveal your surprise.",
    url: "https://surprise-with-code-d23k2r3ux-gitrupags-projects.vercel.app",
    siteName: "Surprise With Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Romantic surprise waiting",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Surprise With Code 💖",
    description: "Someone made this for you 💌 Tap to reveal your surprise.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
