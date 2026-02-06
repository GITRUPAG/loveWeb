import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Two Roses",
  description: "Share your love story",
  //charset: "UTF-8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Everything inside the body now has access to Auth */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}