"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // uuidv4 가져오기
import supabase from "../supabase/supabaseClient";

// User 타입 정의
interface Color {
  color_code: string; // 색상 코드
  color_desc: string; // 색상 설명
}

interface User {
  id: string; // 사용자 ID (UUID 형식)
  username: string; // 사용자 이름
  profile_picture: string; // 프로필 이미지 URL
  colors: Color[]; // 색상 배열
  job: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState<string>("");
  const [userJob, setUserJob] = useState<string>("");
  const [colorCodes, setColorCodes] = useState<string[]>([""]); // 초기값으로 빈 문자열을 가진 배열 설정
  const [colorDescs, setColorDescs] = useState<string[]>([""]); // 초기값으로 빈 문자열을 가진 배열 설정
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      return null;
    }

    return urlData.publicUrl; // publicURL을 리턴
  };

  const handleAddUser = async () => {
    if (profilePicture) {
      const imageUrl = await handleImageUpload(profilePicture);
      if (!imageUrl) {
        return;
      }

      const newUser: User = {
        id: uuidv4(), // uuidv4 사용하여 UUID 생성
        username,
        profile_picture: imageUrl,
        colors: colorCodes.map((code, index) => ({
          color_code: code,
          color_desc: colorDescs[index]
        })), // 색상 정보를 배열로 설정
        job: userJob
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.from("users").insert([newUser]);

      if (error) {
        console.error(error);
      } else {
        alert("성공! 이제 새로고침을 한번 해주세요.");
        setUsername("");
        setColorCodes([]);
        setColorDescs([]);
        setUserJob("");
        setProfilePicture(null);
        setIsOpen(false);
      }
    }
  };

  const handleAddColor = () => {
    setColorCodes([...colorCodes, ""]); // 빈 문자열로 새 색상 코드 추가
    setColorDescs([...colorDescs, ""]); // 빈 문자열로 새 색상 설명 추가
  };

  return isOpen ? (
    <>
      <div className="add_modal">
        <h5>문페어 프로필 등록하기</h5>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
        >
          <label>
            닉네임:
            <input
              type="text"
              value={username}
              placeholder="인게임 닉네임 입력!"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label>
            직업:
            <input
              type="text"
              value={userJob}
              placeholder="'다크메이지' 같이 띄어쓰기 없이 입력"
              onChange={(e) => setUserJob(e.target.value)}
              required
            />
          </label>
          {colorCodes.map((_, index) => (
            <div key={index}>
              <label>
                색 코드:
                <input
                  type="text"
                  value={colorCodes[index]}
                  placeholder="#빼고 ffffff 요렇게"
                  onChange={(e) => {
                    const newColorCodes = [...colorCodes];
                    newColorCodes[index] = e.target.value; // 현재 색상 코드 업데이트
                    setColorCodes(newColorCodes);
                  }}
                  required
                />
              </label>
              <label>
                색 명칭:
                <input
                  type="text"
                  value={colorDescs[index]}
                  placeholder="리블, 리화, 다크초코..."
                  onChange={(e) => {
                    const newColorDescs = [...colorDescs];
                    newColorDescs[index] = e.target.value; // 현재 색상 설명 업데이트
                    setColorDescs(newColorDescs);
                  }}
                  required
                />
              </label>
            </div>
          ))}

          <label>
            프로필 사진:
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePicture(e.target.files ? e.target.files[0] : null)
              }
              required
            />
          </label>
          <div className="btn_group">
            <button type="button" onClick={handleAddColor}>
              지향색 추가
            </button>
            <button type="submit">다 됐어요</button>
          </div>
        </form>
      </div>
      <div className="modal_bg" onClick={() => setIsOpen(false)}></div>
    </>
  ) : null;
};

export default AddUserModal;
