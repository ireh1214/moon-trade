import type { Metadata } from "next";
import "./scss/common.scss";

export const metadata: Metadata = {
  title: "MOONPAIR",
  description: ""
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
