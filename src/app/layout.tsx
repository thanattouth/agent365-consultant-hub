import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Agent365 Consultant Hub",
  description: "Microsoft-first consultant chatbot hub.",
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
