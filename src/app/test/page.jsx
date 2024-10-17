"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
  const [shopData, setShopData] = useState(null); // API 데이터를 저장할 상태 변수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://open.api.nexon.com/mabinogi/v1/npcshop/list?npc_name=%EC%83%81%EC%9D%B8%20%EB%A9%94%EB%A3%A8&server_name=%EB%A5%98%ED%8A%B8&channel=37",
          {
            headers: {
              accept: "application/json",
              "x-nxopen-api-key":
                "test_2991668b1d15fb2cb11f7c31fb1fb6f40517b750e1ad55a7b265330272c49d70efe8d04e6d233bd35cf2fabdeb93fb0d"
            }
          }
        ); // API 요청 시 헤더 추가
        setShopData(response.data); // 응답 데이터를 상태에 저장
        console.log(response.data); // 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // 데이터가 아직 로드되지 않았을 때의 로딩 상태 처리
  if (!shopData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Shop Tabs: {shopData.shop_tab_count}</h1>
      {shopData.shop.map((tab, index) => (
        <div key={index}>
          <h2>{tab.tab_name}</h2>
          {tab.item.map((item, itemIndex) => (
            <div key={itemIndex}>
              <h3>{item.item_display_name}</h3>
              <img src={item.image_url} alt={item.item_display_name} />
              <div>
                {item.price.map((price, priceIndex) => (
                  <div key={priceIndex}>
                    <p>
                      {price.price_type}: {price.price_value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
