import type { Metadata } from "next";
import "./scss/common.scss";

export const metadata: Metadata = {
  title: "물교 계산기",
  description: "우리 모두 부자가 되자"
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
