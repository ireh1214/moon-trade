import Link from "next/link";

export default function Page() {
  return (
    <div className="main_wrap">
      <h1>MOONPAIR</h1>
      <nav>
        <ul>
          <li>
            <Link href="/favcolor">길드원 지향색 목록</Link>
          </li>
          <li>
            <Link href="/trade">물물 교역 계산기</Link>
          </li>
          <li>
            <Link href="/pocket">주머니 찾아보기</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
