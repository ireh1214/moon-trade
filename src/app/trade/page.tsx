// Calculator.tsx
"use client";
import React, { useState, useEffect } from "react";
import items from "../items";
import ItemGroup from "../ItemGroup";
import Head from "next/head";
import Swal from "sweetalert2";

const Calculator: React.FC = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  );
  const [regionalPriceAdjustments, setRegionalPriceAdjustments] = useState<{
    [key: string]: number;
  }>(items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {}));

  const [bonusValues, setBonusValues] = useState<string[]>([""]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );
  const [increaseTotal, setIncreaseTotal] = useState<boolean>(false);
  const [isRounded, setIsRounded] = useState(false);
  const [savedTotals, setSavedTotals] = useState<number[]>([]);
  const [petSetPercentage, setPetSetPercentage] = useState<number>(0);
  const [nickname, setNickname] = useState<string | null>(null); // 닉네임 상태 추가

  useEffect(() => {
    const userNickname = prompt("당신의 닉네임은 무엇인가요?");
    if (userNickname) {
      setNickname(userNickname); // 입력받은 닉네임 상태에 저장
    }
  }, []);

  const calculateDaysUntilNextWednesday = () => {
    const today = new Date();
    const nextWednesday = new Date();
    nextWednesday.setDate(
      today.getDate() + ((3 + 7 - today.getDay()) % 7 || 7)
    ); // 다음 수요일 날짜 계산
    const timeDiff = nextWednesday.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)); // 남은 일수 계산
  };

  const isTodayWednesday = () => {
    const today = new Date();
    return today.getDay() === 3; // 3은 수요일
  };
  //핸들링 함수 --

  const handlePetSetPercentageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPetSetPercentage(Number(e.target.value));
  };

  const handleQuantityChange = (name: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [name]: quantity }));
  };
  const handleMaxChange = (
    itemName: string,
    maxQuantity: number,
    isChecked: boolean
  ) => {
    setQuantities((prev) =>
      isChecked
        ? { ...prev, [itemName]: maxQuantity }
        : { ...prev, [itemName]: 0 }
    );
  };
  const handleRegionalPriceChange = (itemName: string, value: string) => {
    setRegionalPriceAdjustments((prev) => ({
      ...prev,
      [itemName]: Number(value)
    }));
  };
  const handleBonusChange = (index: number, value: string) => {
    if (Number(value) >= 1000000000) {
      alert("얼마나 많이 입력하려고 그러세요!!");
    }
    const newBonusValues = [...bonusValues];
    newBonusValues[index] = value;
    setBonusValues(newBonusValues);
  };
  const addBonusField = () => {
    setBonusValues((prev) => [...prev, ""]);
  };
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCertificate(e.target.value);
  };
  const handleIncreaseTotal = () => {
    setIncreaseTotal((prev) => !prev);
  };
  const handleRoundToggle = () => {
    setIsRounded((prev) => !prev); // 상태를 반전시켜 소수점 표시 여부를 토글
  };
  const handleSaveTotal = () => {
    // 리스트 항목이 20개를 초과하는 경우 알림 표시
    if (savedTotals.length >= 20) {
      alert("항목이 너무 많아져요!");
      return; // 더 이상 저장하지 않음
    }

    // 총 가격이 0일 경우 확인 대화상자 표시
    if (displayTotal === 0) {
      const confirmSave = confirm("값이 0인데요? 진짜로요?");
      if (!confirmSave) return; // 사용자가 취소할 경우 저장하지 않음
    }

    setSavedTotals((prev) => [...prev, displayTotal]); // 현재 총 가격을 저장
    // 초기화
    setQuantities(
      items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
    );
    setRegionalPriceAdjustments(
      items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
    );
    setBonusValues([""]); // 보너스 값 초기화
    setSelectedCertificate(null); // 선택된 보증서 초기화
    setIncreaseTotal(false); // 전체 금액 증가 초기화

    // 모든 체크박스 해제
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
  };
  const handleClearTotals = () => {
    const confirmClear = confirm("모든 항목을 진짜 지울까요 주인님!?");
    if (confirmClear) {
      setSavedTotals([]); // 모든 항목 초기화
    }
  };

  const handleDeleteTotal = (total: number) => {
    setSavedTotals((prev) => prev.filter((item) => item !== total)); // 선택한 총 가격 삭제
  };

  //계산식 함수 --
  const calculateTotal = () => {
    // 기본 가격 계산
    const baseTotal = items.reduce(
      (total, item) =>
        total +
        quantities[item.name] *
          (item.price + (regionalPriceAdjustments[item.name] || 0)),
      0
    );

    // 보너스 값 합산
    const totalBonus = bonusValues.reduce(
      (total, bonus) => total + (bonus ? Number(bonus) : 0),
      0
    );

    const totalWithBonus = baseTotal + totalBonus;

    // 보증서 선택에 따른 금액 조정
    let finalTotal = totalWithBonus;

    const certificateAdjustments: { [key: string]: number } = {
      A: 0, // 추가 없음
      B: 0.45, // 45% 증가
      C: 0.6, // 60% 증가
      D: 0.75, // 75% 증가
      E: 1.5 // 150% 증가
    };

    if (selectedCertificate && selectedCertificate !== "A") {
      finalTotal +=
        totalWithBonus * certificateAdjustments[selectedCertificate];
    }

    if (increaseTotal) {
      finalTotal *= 1.15;
    }

    // PetSet 퍼센테이지 추가 반영
    if (petSetPercentage > 0) {
      finalTotal += finalTotal * (petSetPercentage / 100);
    }

    return finalTotal;
  };

  const displayTotal = isRounded
    ? Math.floor(calculateTotal()) // 소수점 제거
    : calculateTotal();

  const getItemsByType = (type: string) =>
    items.filter((item) => item.type === type);

  // 모달 --

  const alertHandler = () => {
    Swal.fire({
      html: `
        <div class ="img"></div>
        <a href="https://x.com/Luniclemabi" autofocus> 문의사항은 여기로 부탁드립니다!</a>
        <br /><br />
        © 본 페이지는 리액트로 구성되어 있고, 2024년 10월에 만들어졌습니다.
      `,
      imageAlt: "이미지",
      confirmButtonText: "그래요!"
    });
  };

  return (
    <>
      <Head>
        <title>물물 교역 계산기</title>
      </Head>
      <div
        className={`trade_wrap ${
          nickname === "디아스"
            ? "dias"
            : nickname === "파미콘"
            ? "famicon"
            : nickname === "힐데베르"
            ? "hildeber"
            : ""
        }`}
      >
        <div className="top_content">
          <h1>
            {" "}
            마비노기 물물교역 계산기
            <span onClick={alertHandler}>/ @LT루니클</span>
          </h1>
          {nickname && (
            <p className="nickname">
              <span>{nickname}</span>님이시군요! 어서오세요!
            </p>
          )}
          <div className="alarm">
            {["디아스", "파미콘", "힐데베르"].includes(nickname || "") && (
              <>
                {isTodayWednesday() ? (
                  <>
                    [길드원인증]
                    <br />
                    오늘은 물물교환 당일입니다!
                    <br />몇 시에 할 지 정하셨어요?
                  </>
                ) : (
                  <>
                    오늘은{" "}
                    {new Intl.DateTimeFormat("ko-KR", {
                      weekday: "long"
                    }).format(new Date())}
                    입니다. 문페어 물물교환 날까지{" "}
                    {calculateDaysUntilNextWednesday()}일 남았습니다.
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="section_wrap">
          <ItemGroup
            title="카루 숲 물품"
            items={getItemsByType("K")}
            quantities={quantities}
            regionalPrices={regionalPriceAdjustments}
            onQuantityChange={handleQuantityChange}
            onMaxChange={handleMaxChange}
            onRegionalPriceChange={handleRegionalPriceChange}
          />
          <ItemGroup
            title="오아시스 물품"
            items={getItemsByType("O")}
            quantities={quantities}
            regionalPrices={regionalPriceAdjustments}
            onQuantityChange={handleQuantityChange}
            onMaxChange={handleMaxChange}
            onRegionalPriceChange={handleRegionalPriceChange}
          />
          <ItemGroup
            title="칼리다 물품"
            items={getItemsByType("C")}
            quantities={quantities}
            regionalPrices={regionalPriceAdjustments}
            onQuantityChange={handleQuantityChange}
            onMaxChange={handleMaxChange}
            onRegionalPriceChange={handleRegionalPriceChange}
          />
          <ItemGroup
            title="페라 물품"
            items={getItemsByType("P")}
            quantities={quantities}
            regionalPrices={regionalPriceAdjustments}
            onQuantityChange={handleQuantityChange}
            onMaxChange={handleMaxChange}
            onRegionalPriceChange={handleRegionalPriceChange}
          />
        </div>

        <div className="bottom">
          <div className="input_box">
            <p>펫 놀이세트 몇퍼?:</p>
            <input
              type="number"
              value={petSetPercentage}
              onChange={handlePetSetPercentageChange}
              placeholder="0"
            />

            <p>추가 더하기(직접입력):</p>
            {bonusValues.map((bonus, index) => (
              <div key={index}>
                <input
                  type="number"
                  value={bonus}
                  placeholder="직접입력(덧셈)"
                  onChange={(e) => handleBonusChange(index, e.target.value)}
                  min="0"
                />
              </div>
            ))}
            <button onClick={addBonusField}>Input 추가</button>
          </div>

          <div className="option_box">
            <label>
              <input
                type="radio"
                value="A"
                checked={selectedCertificate === "A"}
                onChange={handleCertificateChange}
              />
              보증서가 없어요ㅜ
            </label>
            <label>
              <input
                type="radio"
                value="B"
                checked={selectedCertificate === "B"}
                onChange={handleCertificateChange}
              />
              오고보 (45%)
            </label>
            <label>
              <input
                type="radio"
                value="C"
                checked={selectedCertificate === "C"}
                onChange={handleCertificateChange}
              />
              고고보 (60%)
            </label>
            <label>
              <input
                type="radio"
                value="D"
                checked={selectedCertificate === "D"}
                onChange={handleCertificateChange}
              />
              임고보 (75%)
            </label>
            <label>
              <input
                type="radio"
                value="E"
                checked={selectedCertificate === "E"}
                onChange={handleCertificateChange}
              />
              임특보 (150%)
            </label>
            <label>
              <input
                type="checkbox"
                checked={increaseTotal}
                onChange={handleIncreaseTotal}
              />
              교역마 1랭(15%)
            </label>
          </div>

          <div className="total">
            총 가격: <br />
            <b>{displayTotal.toLocaleString()}</b>
            <ul className="total_list">
              {savedTotals.map((total, index) => (
                <li key={index}>
                  {total.toLocaleString()}{" "}
                  <input type="text" className="m_name" placeholder="메모" />
                  <span onClick={() => handleDeleteTotal(total)}>x</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="total_option">
            <button onClick={handleSaveTotal}>값 저장하기</button>
            <button onClick={handleRoundToggle}>
              {isRounded ? "소수점 추가!" : "소수점 뺄까?"}
            </button>
            <button onClick={handleClearTotals}>몽땅 삭제</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calculator;
