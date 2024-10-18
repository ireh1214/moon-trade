"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemList = () => {
  const [shopData, setShopData] = useState([]); // API 데이터를 저장할 상태 변수 (배열로 초기화)
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 변수

  useEffect(() => {
    const fetchData = async () => {
      try {
        const channelRequests = Array.from({ length: 20 }, (_, index) => {
          const channel = index + 1; // 채널 번호
          return axios.get(
            `https://open.api.nexon.com/mabinogi/v1/npcshop/list?npc_name=%EC%83%81%EC%9D%B8%20%EB%88%84%EB%88%84&server_name=%EB%A5%98%ED%8A%B8&channel=${channel}`,
            {
              headers: {
                accept: "application/json",
                "x-nxopen-api-key":
                  "test_2991668b1d15fb2cb11f7c31fb1fb6f40517b750e1ad55a7b265330272c49d70efe8d04e6d233bd35cf2fabdeb93fb0d"
              }
            }
          );
        });

        // 모든 요청을 병렬로 실행
        const responses = await Promise.all(channelRequests);

        // 응답에서 주머니 관련 데이터만 필터링합니다.
        const allShopData = responses.flatMap((response) =>
          response.data.shop
            ? response.data.shop.filter((tab) => tab.tab_name === "주머니")
            : []
        );

        setShopData(allShopData); // 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching data:", error.response || error.message);
      }
    };

    fetchData();
  }, []);

  // 데이터가 아직 로드되지 않았을 때의 로딩 상태 처리
  if (shopData.length === 0) {
    return <div>Loading...</div>; // shopData가 비어있으면 로딩 메시지 표시
  }

  return (
    <div className="filter_wrap">
      <section>
        <h3>주머니</h3>
        <input
          type="text"
          className="color_search"
          placeholder="색상 코드로 검색해봐"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toUpperCase())} // 검색어 상태 업데이트
        />
        {shopData
          .flatMap((tab) =>
            tab.item.filter((item) => {
              const urlParams = new URLSearchParams(
                item.image_url.split("?")[1]
              );
              const itemColor = JSON.parse(
                decodeURIComponent(urlParams.get("item_color"))
              );

              return Object.values(itemColor).some((color) =>
                color.toUpperCase().includes(searchTerm)
              );
            })
          )
          .map((item, itemIndex) => {
            const urlParams = new URLSearchParams(item.image_url.split("?")[1]);
            const itemColor = JSON.parse(
              decodeURIComponent(urlParams.get("item_color"))
            );

            return (
              <ul className="item_list" key={itemIndex}>
                <li>
                  <p>{item.item_display_name}</p>
                  <img src={item.image_url} alt={item.item_display_name} />
                  <div>
                    <p>색상 정보:</p>
                    <ul className="color_list">
                      {Object.entries(itemColor).map(([key, color]) => {
                        const colorLabel = key.replace("color_", "색상");
                        return (
                          <li key={key} style={{ color }}>
                            {colorLabel}: {color}
                            <div
                              className="bg"
                              style={{ backgroundColor: color }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              </ul>
            );
          })}
      </section>
    </div>
  );
};

export default ItemList;
