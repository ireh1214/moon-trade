import type { Metadata } from "next";
import "./scss/common.scss";

export const metadata: Metadata = {
  title: "계산기이이이이",
  description: "계산기ㅣㅣㅣㅣ"
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
