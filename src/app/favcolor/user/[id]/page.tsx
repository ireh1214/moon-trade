/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import supabase from "../../../supabase/supabaseClient";
import Comments from "@/app/components/Comments";

// Color 및 Concept 타입 정의
interface Color {
  color_code: string;
  color_desc: string;
}

interface User {
  id: string; // 사용자 ID (UUID 형식)
  username: string; // 사용자 이름
  profile_picture: string; // 프로필 이미지 URL
  colors: Color[]; // 색상 배열
  job: string;
  concept: string;
}

const UserDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const [user, setUser] = useState<User | null>(null);
  const [newConcepts, setNewConcepts] = useState("");
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태

  useEffect(() => {
    fetchUser(params.id);
  }, [params.id]);

  const fetchUser = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
    } else {
      //  필드를 빈 문자열로 초기화
      setUser({ ...data, concept: data.concept || "" });
      setNewConcepts(data.concept || ""); // 기존 설정을 textarea에 표시
    }
  };

  const handleUpdateConcepts = async () => {
    if (!user) return;

    const updatedConcepts = newConcepts.trim();

    const { error } = await supabase
      .from("users")
      .update({ concept: updatedConcepts })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating concept:", error);
    } else {
      setUser((prev) => prev && { ...prev, concept: updatedConcepts });
      setNewConcepts(""); // 입력 필드 초기화
    }
  };

  return (
    <div className="user_detail_wrap">
      <section>
        {user && (
          <>
            <div className="frame">
              <div className="profile">
                <h5>
                  <span> {user.username}</span> | {user.job}
                </h5>
                <div
                  className="img_box"
                  style={{ backgroundImage: `url(${user.profile_picture})` }}
                  aria-label={user.username} // 접근성을 위한 label 추가
                ></div>
              </div>
              <div className="concept">
                <p>밀레시안 설정 🖊️</p>

                <div
                  className="value"
                  dangerouslySetInnerHTML={{
                    __html: user.concept.replace(/\n/g, "<br/>")
                  }}
                />
                <button type="button" onClick={() => setIsEditing(!isEditing)}>
                  {/* 수정 모드 토글 */}
                  {isEditing ? "취소" : "수정하기"}
                </button>
              </div>
            </div>
            {isEditing && ( // 수정 모드일 때만 edit_value 렌더링
              <div className="edit_value">
                <textarea
                  value={newConcepts}
                  onChange={(e) => setNewConcepts(e.target.value)}
                  placeholder="설정을 입력해보세여! (줄바꿈으로 구분)"
                />
                <button onClick={handleUpdateConcepts}>수정완료</button>
              </div>
            )}
            <Comments userId={user ? user.id : null} />
          </>
        )}
      </section>
    </div>
  );
};

export default UserDetail;
