"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { PostgrestError } from "@supabase/postgrest-js";

// User 타입 정의
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
}

const Card: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [userJob, setUserJob] = useState<string>("");
  const [colorCodes, setColorCodes] = useState<string[]>([]); // 색상 코드 배열
  const [colorDescs, setColorDescs] = useState<string[]>([]); // 색상 설명 배열

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showEditButton, setShowEditButton] = useState<string | null>(null); // 수정 버튼 상태 관리

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const {
      data,
      error
    }: { data: User[] | null; error: PostgrestError | null } = await supabase
      .from("users")
      .select("*");

    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []); // 오류가 없으면 데이터 설정
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setUserJob(user.job);
    setProfilePicture(null); // 이미지 초기화

    // 모든 색상 정보를 가져옵니다.
    if (user.colors.length > 0) {
      const codes = user.colors.map((color) => color.color_code);
      const descs = user.colors.map((color) => color.color_desc);

      setColorCodes(codes); // 색상 코드 배열 설정
      setColorDescs(descs); // 색상 설명 배열 설정
    } else {
      // 색상이 없을 경우 초기화
      setColorCodes([]);
      setColorDescs([]);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`; // 파일 이름 생성

    // 파일 업로드
    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error);
      return null; // 업로드 실패 시 null 반환
    }

    // 업로드된 파일의 퍼블릭 URL 가져오기
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      console.error("Error fetching public URL: urlData is undefined or empty");
      return null; // URL 가져오기 실패 시 null 반환
    }

    return urlData.publicUrl; // 퍼블릭 URL 반환
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return; // 선택된 사용자가 없을 경우 종료

    let imageUrl = selectedUser.profile_picture || ""; // 기존 이미지 URL 사용

    // 새 이미지가 업로드되면 URL 가져오기
    if (profilePicture) {
      const uploadedImageUrl = await handleImageUpload(profilePicture);
      if (!uploadedImageUrl) {
        return; // 이미지 업로드 실패 시 종료
      }
      imageUrl = uploadedImageUrl; // 새 이미지 URL로 업데이트
    }

    // 색상 정보를 배열로 업데이트
    const updatedColors = colorCodes.map((code, index) => ({
      color_code: code,
      color_desc: colorDescs[index] || "" // 설명이 없으면 빈 문자열
    }));

    // 사용자 정보를 업데이트
    const { error } = await supabase
      .from("users")
      .update({
        username,
        colors: updatedColors, // 색상 배열 업데이트
        profile_picture: imageUrl, // 새 URL 적용
        job: userJob
      })
      .eq("id", selectedUser.id); // 수정할 사용자 ID

    if (error) {
      console.error("Error updating user:", error);
    } else {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                username,
                colors: updatedColors, // 새 색상 배열 반영
                profile_picture: imageUrl, // 새 이미지 URL 반영
                job: userJob
              }
            : user
        )
      );
      setSelectedUser(null); // 수정 모드 종료
      // 상태 초기화
      setUsername("");
      setColorCodes([]); // 색상 코드 초기화
      setColorDescs([]); // 색상 설명 초기화
      setProfilePicture(null);
      setUserJob("");
    }
    alert("수정 완료!");
  };

  return (
    <section className="card_wrap">
      {users.map((user) => (
        <div
          className={`card_container ${
            user.job === "엘레멘탈나이트"
              ? "job_e"
              : user.job === "다크메이지"
              ? "job_d"
              : user.job === "알케믹스팅어"
              ? "job_a"
              : user.job === "세인트바드"
              ? "job_s"
              : ""
          }`}
          key={user.id}
          onMouseEnter={() => setShowEditButton(user.id)}
          onMouseLeave={() => setShowEditButton(null)}
        >
          <div>
            <img
              src={user.profile_picture}
              className="profile_img"
              alt={user.username}
            />
            <div className="profile_txt">
              <p>{user.username}</p>
              <p>{user.job}</p>
            </div>
            <ul className="color_content">
              <li> 지향색: </li>
              {Array.isArray(user.colors) && user.colors.length > 0 ? (
                user.colors.map((color, index) => (
                  <li key={index}>
                    <span>{color.color_desc}</span>{" "}
                    <span>#{color.color_code}</span>{" "}
                    <div
                      className="color"
                      style={{ backgroundColor: `#${color.color_code}` }}
                    />
                  </li>
                ))
              ) : (
                <li>색상이 없습니다.</li> // 색상이 없을 경우 표시할 메시지
              )}
            </ul>
          </div>

          {showEditButton === user.id && ( // 조건부 렌더링
            <button
              className="edit_btn"
              onClick={() => {
                const confirmEdit = window.confirm("수정을 진행하시겠습니까?");
                if (confirmEdit) {
                  handleEditClick(user); // 확인 시 수정 클릭 핸들러 호출
                }
              }}
            >
              수정
            </button>
          )}
        </div>
      ))}
      {selectedUser && (
        <>
          <div className="update_modal">
            <h5>
              정보를 수정할까? <br />
              <p>* 수정하지 않으시려면 아무것도 바꾸지 말고 완료를 누르세요!</p>
            </h5>

            <label>
              닉네임:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              직업:
              <input
                type="text"
                value={userJob}
                onChange={(e) => setUserJob(e.target.value)}
              />
            </label>

            {colorCodes.map((code, index) => (
              <div key={index}>
                <label>
                  색 코드:
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      const newCodes = [...colorCodes];
                      newCodes[index] = e.target.value; // 수정된 코드로 업데이트
                      setColorCodes(newCodes); // 상태 업데이트
                    }}
                  />
                </label>
                <label>
                  색 이름:
                  <input
                    type="text"
                    value={colorDescs[index] || ""}
                    onChange={(e) => {
                      const newDescs = [...colorDescs];
                      newDescs[index] = e.target.value; // 수정된 설명으로 업데이트
                      setColorDescs(newDescs); // 상태 업데이트
                    }}
                  />
                </label>
              </div>
            ))}

            <label>
              프로필 사진:
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setProfilePicture(file); // 파일 상태 업데이트
                }}
              />
            </label>
            <button onClick={handleUpdateUser}>수정 완료</button>
          </div>
          <div className="modal_bg"></div>
        </>
      )}
    </section>
  );
};

export default Card;
