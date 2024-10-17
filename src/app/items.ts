export interface Item {
  name: string;
  price: number;
  maxQuantity: number;
  type: string;
}

const items: Item[] = [
  // 카루 숲
  { name: "우드 테이블", price: 3818, maxQuantity: 25, type: "K" },
  { name: "목공예품", price: 6121, maxQuantity: 15, type: "K" },
  { name: "스톤 홀스 조각상", price: 12345, maxQuantity: 10, type: "K" },
  { name: "카루 표고 버섯", price: 29588, maxQuantity: 8, type: "K" },
  { name: "조개 껍질 화석", price: 127728, maxQuantity: 3, type: "K" },
  // 오아시스
  { name: "고운 모래", price: 3818, maxQuantity: 25, type: "O" },
  { name: "프리즌 고스트의 날개", price: 6121, maxQuantity: 15, type: "O" },
  { name: "오아시스 그림", price: 12345, maxQuantity: 10, type: "O" },
  { name: "선인장 꽃", price: 29588, maxQuantity: 8, type: "O" },
  { name: "거대 송곳니 화석", price: 127728, maxQuantity: 3, type: "O" },
  // 칼리다
  { name: "맥반석 계란", price: 3818, maxQuantity: 25, type: "C" },
  { name: "칼리다 연어", price: 6121, maxQuantity: 15, type: "C" },
  { name: "온천 입욕제", price: 12345, maxQuantity: 10, type: "C" },
  { name: "대형 캠핑 텐트", price: 29588, maxQuantity: 8, type: "C" },
  { name: "핑크 솔트", price: 127728, maxQuantity: 3, type: "C" },
  // 페라
  { name: "화산 머드팩", price: 3818, maxQuantity: 25, type: "P" },
  { name: "마그마 스톤", price: 6121, maxQuantity: 15, type: "P" },
  { name: "익시온의 뿔", price: 12345, maxQuantity: 10, type: "P" },
  { name: "화산 도마뱀의 알", price: 29588, maxQuantity: 8, type: "P" },
  { name: "라스파 흑표범의 가죽", price: 127728, maxQuantity: 3, type: "P" }
  // 스카하
];

export default items;
