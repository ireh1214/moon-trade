"use client";
import React, { useState } from "react";
import items from "./items"; // items.ts에서 아이템 가져오기

const Calculator: React.FC = () => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  );

  // 지역별 가격 조정 상태 관리
  const [regionalPriceAdjustments, setRegionalPriceAdjustments] = useState<{
    [key: string]: number;
  }>(items.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {}));

  const [bonusValues, setBonusValues] = useState<string[]>([""]); // 여러 개의 보너스 값을 관리하는 배열

  // 보증서 상태 (하나만 선택되도록 변경)
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(
    null
  );

  const calculateTotal = () => {
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

    // 선택된 보증서에 따라 총 가격 조정
    const totalWithBonus = baseTotal + totalBonus;

    if (selectedCertificate === "A") {
      return totalWithBonus * 1; // 100%
    }
    if (selectedCertificate === "B") {
      return totalWithBonus * 1.5; // 150%
    }
    if (selectedCertificate === "C") {
      return totalWithBonus * 2; // 200%
    }

    return totalWithBonus; // 기본값
  };

  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCertificate(e.target.value); // 선택된 보증서 저장
  };

  const handleMaxChange = (
    itemName: string,
    maxQuantity: number,
    isChecked: boolean
  ) => {
    if (isChecked) {
      setQuantities((prev) => ({ ...prev, [itemName]: maxQuantity })); // 최대값으로 설정
    } else {
      setQuantities((prev) => ({ ...prev, [itemName]: 0 })); // 0으로 설정
    }
  };

  // 보너스 값 추가/제거 핸들러
  const handleBonusChange = (index: number, value: string) => {
    if (Number(value) >= 1000000000) {
      alert("얼마나 많이 입력하려고 그러세요!!");
    }

    const newBonusValues = [...bonusValues];
    newBonusValues[index] = value;
    setBonusValues(newBonusValues);
  };

  const addBonusField = () => {
    setBonusValues((prev) => [...prev, ""]); // 새로운 보너스 필드 추가
  };

  const handleRegionalPriceChange = (itemName: string, value: string) => {
    setRegionalPriceAdjustments((prev) => ({
      ...prev,
      [itemName]: Number(value)
    }));
  };

  const kTypeItems = items.filter((item) => item.type === "K");
  const OTypeItems = items.filter((item) => item.type === "O");
  const CTypeItems = items.filter((item) => item.type === "C");
  const PTypeItems = items.filter((item) => item.type === "P");

  return (
    <div className="wrap">
      <h1>교역품 계산기를 만들어보자</h1>
      <div className="section_wrap">
        <section className="k_forest_cont">
          <h3>카루 숲 물품</h3>
          {kTypeItems.map((item) => (
            <div key={item.name}>
              <label>{item.name} : </label>
              <select
                value={quantities[item.name]}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [item.name]: Number(e.target.value)
                  })
                }
              >
                {[...Array(item.maxQuantity + 1).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              {/* 최대 체크박스 추가 */}
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMaxChange(
                      item.name,
                      item.maxQuantity,
                      e.target.checked
                    )
                  }
                />
                최대
              </label>
              <input
                type="number"
                value={regionalPriceAdjustments[item.name] || ""}
                onChange={(e) =>
                  handleRegionalPriceChange(item.name, e.target.value)
                }
                placeholder="마을별 시세"
              />
            </div>
          ))}
        </section>
        <section className="oasis_cont">
          <h3>오아시스 물품</h3>
          {OTypeItems.map((item) => (
            <div key={item.name}>
              <label>{item.name} : </label>
              <select
                value={quantities[item.name]}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [item.name]: Number(e.target.value)
                  })
                }
              >
                {[...Array(item.maxQuantity + 1).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              {/* 최대 체크박스 추가 */}
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMaxChange(
                      item.name,
                      item.maxQuantity,
                      e.target.checked
                    )
                  }
                />
                최대
              </label>

              <input
                type="number"
                value={regionalPriceAdjustments[item.name] || ""}
                onChange={(e) =>
                  handleRegionalPriceChange(item.name, e.target.value)
                }
                placeholder="마을별 시세"
              />
            </div>
          ))}
        </section>
        <section className="kalida_cont">
          <h3>칼리다 물품</h3>
          {CTypeItems.map((item) => (
            <div key={item.name}>
              <label>{item.name} : </label>
              <select
                value={quantities[item.name]}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [item.name]: Number(e.target.value)
                  })
                }
              >
                {[...Array(item.maxQuantity + 1).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              {/* 최대 체크박스 추가 */}
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMaxChange(
                      item.name,
                      item.maxQuantity,
                      e.target.checked
                    )
                  }
                />
                최대
              </label>
              <input
                type="number"
                value={regionalPriceAdjustments[item.name] || ""}
                onChange={(e) =>
                  handleRegionalPriceChange(item.name, e.target.value)
                }
                placeholder="마을별 시세"
              />
            </div>
          ))}
        </section>
        <section className="pera_cont">
          <h3>페라 물품</h3>
          {PTypeItems.map((item) => (
            <div key={item.name}>
              <label>{item.name} : </label>
              <select
                value={quantities[item.name]}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [item.name]: Number(e.target.value)
                  })
                }
              >
                {[...Array(item.maxQuantity + 1).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>

              {/* 최대 체크박스 추가 */}
              <label>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleMaxChange(
                      item.name,
                      item.maxQuantity,
                      e.target.checked
                    )
                  }
                />
                최대
              </label>
              <input
                type="number"
                value={regionalPriceAdjustments[item.name] || ""}
                onChange={(e) =>
                  handleRegionalPriceChange(item.name, e.target.value)
                }
                placeholder="마을별 시세"
              />
            </div>
          ))}
        </section>
      </div>

      <div className="bottom">
        <div className="input_box">
          <p>더 더할거 있나여?(직접입력):</p>
          {bonusValues.map((bonus, index) => (
            <div key={index}>
              <input
                type="number"
                value={bonus}
                onChange={(e) => handleBonusChange(index, e.target.value)}
                min="0"
              />
            </div>
          ))}
          <button onClick={addBonusField}>Input 추가</button>
        </div>
        <div className="radio_box">
          <label>
            <input
              type="radio"
              value="A"
              checked={selectedCertificate === "A"}
              onChange={handleCertificateChange}
            />
            없어요 ㅜㅜ
          </label>
          <label>
            <input
              type="radio"
              value="B"
              checked={selectedCertificate === "B"}
              onChange={handleCertificateChange}
            />
            임고보 (150%)
          </label>
          <label>
            <input
              type="radio"
              value="C"
              checked={selectedCertificate === "C"}
              onChange={handleCertificateChange}
            />
            특임보 (200%)
          </label>
        </div>

        <div className="total">
          총 가격: <br /> <b>{calculateTotal().toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
