"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

// User 타입 정의
interface User {
  id: string; // 사용자 ID (UUID 형식)
  username: string; // 사용자 이름
  profile_picture: string; // 프로필 이미지 URL
  color_code: string; // 색상 코드
  color_desc: string; // 색상 설명
  job: string;
}

const Card: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [colorDesc, setColorDesc] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [showEditButton, setShowEditButton] = useState<string | null>(null); // 수정 버튼 상태 관리

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = (await supabase.from("users").select("*")) as {
      data: User[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any;
    };

    // 데이터가 null인 경우를 대비
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      setUsers(data || []); // 오류가 없으면 데이터 설정
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setUsername(user.username);
    setColorDesc(user.color_desc);
    setColorCode(user.color_code);
    setProfilePicture(null); // 이미지 초기화
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`; // 파일 이름 생성

    // 파일 업로드
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
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

    let imageUrl = selectedUser.profile_picture || "기본 이미지 URL"; // 기존 이미지 URL 사용 또는 기본 이미지 URL 설정

    // 새 이미지가 업로드되면 URL 가져오기
    if (profilePicture) {
      const uploadedImageUrl = await handleImageUpload(profilePicture);
      if (!uploadedImageUrl) {
        return; // 이미지 업로드 실패 시 종료
      }
      imageUrl = uploadedImageUrl; // 새 이미지 URL로 업데이트
    }

    // 사용자 정보를 업데이트
    const { error } = await supabase
      .from("users")
      .update({
        username,
        color_desc: colorDesc,
        color_code: colorCode,
        profile_picture: imageUrl // 새 URL 적용
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
                color_desc: colorDesc,
                color_code: colorCode,
                profile_picture: imageUrl // 새 이미지 URL 반영
              }
            : user
        )
      );
      setSelectedUser(null); // 수정 모드 종료
      // 상태 초기화
      setUsername("");
      setColorDesc("");
      setColorCode("");
      setProfilePicture(null);
    }
    alert("수정 완료!");
  };

  // 사용자 삭제 함수
  const handleDeleteUser = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
    } else {
      // 삭제 후 유저 리스트 업데이트
      setUsers(users.filter((user) => user.id !== id));
    }
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
              <li>
                지향색: <span>{user.color_desc}</span>{" "}
                <span>#{user.color_code}</span> <div className="color" />
              </li>
            </ul>
          </div>

          {showEditButton === user.id && ( // 조건부 렌더링
            <>
              <button
                className="edit_btn"
                onClick={() => {
                  const confirmEdit =
                    window.confirm("수정을 진행하시겠습니까?");
                  if (confirmEdit) {
                    handleEditClick(user); // 확인 시 수정 클릭 핸들러 호출
                  }
                }}
              >
                수정
              </button>
              <button
                className="delete_btn"
                onClick={() => handleDeleteUser(user.id)}
              >
                삭제
              </button>
            </>
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
              색 코드:
              <input
                type="text"
                value={colorCode}
                onChange={(e) => setColorCode(e.target.value)}
              />
            </label>

            <label>
              색 이름:
              <input
                type="text"
                value={colorDesc}
                onChange={(e) => setColorDesc(e.target.value)}
              />
            </label>

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
