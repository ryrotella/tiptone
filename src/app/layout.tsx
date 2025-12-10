import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIPTONE - Universal Tip Color System",
  description: "A community-driven, open-source organization providing a universal tip color language. The Tiptone Matching System (TMS) is a standardized database of tip colors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
