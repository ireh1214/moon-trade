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
          </li>{" "}
          <li>
            <Link href="/pocket">주머니 찾기(현재 안됨)</Link>
          </li>
          <li>
            <Link href="/schedule">길드 일정표</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

