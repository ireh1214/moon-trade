"use client";
import React, { useState } from "react";
import supabase from "../supabase/supabaseClient";


// User 타입 정의
interface User {
  id: string; // 사용자 ID (UUID 형식)
  username: string; // 사용자 이름
  profile_picture: string; // 프로필 이미지 URL
  color_code: string; // 색상 코드
  color_desc: string; // 색상 설명
}

const AddUserForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [colorCode, setColorCode] = useState<string>("");
  const [colorDesc, setColorDesc] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error.message);
      setErrorMessage("Error uploading image: " + error.message);
      return null;
    }

    // 업로드된 파일의 퍼블릭 URL 가져오기
    const { data: urlData } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    // URL이 제대로 가져와졌는지 확인
    if (!urlData || !urlData.publicUrl) {
      console.error("Error fetching public URL: urlData is undefined or empty");
      setErrorMessage(
        "Error fetching public URL: urlData is undefined or empty"
      );
      return null;
    }

    return urlData.publicUrl; // publicURL을 리턴
  };

  const handleAddUser = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (profilePicture) {
      const imageUrl = await handleImageUpload(profilePicture);
      if (!imageUrl) {
        setErrorMessage("Image upload failed.");
        setIsLoading(false);
        return;
      }

      // 새 사용자 데이터
      const newUser: User = {
        id: uuidv4(), // UUID를 사용하여 새로운 ID 생성
        username,
        profile_picture: imageUrl,
        color_code: colorCode,
        color_desc: colorDesc
      };

      // 사용자 추가
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase.from("users").insert([newUser]); // 타입 지정 없이 사용

      if (error) {
        setErrorMessage("Error adding user: " + error.message);
        console.error(error);
      } else {
        setSuccessMessage("User added successfully!");
        setUsername("");
        setColorCode("");
        setColorDesc("");
        setProfilePicture(null);
      }
    } else {
      setErrorMessage("Please upload a profile picture.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h2>Add Favorite Color with Profile Picture</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddUser();
        }}
      >
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Favorite Color Code (e.g., #ff0000):
          <input
            type="text"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Color Description:
          <input
            type="text"
            value={colorDesc}
            onChange={(e) => setColorDesc(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Profile Picture:
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProfilePicture(e.target.files ? e.target.files[0] : null)
            }
            required
          />
        </label>
        <br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "로딩 중..." : "Add Color"}
        </button>
      </form>
    </div>
  );
};

export default AddUserForm;
function uuidv4(): string {
  throw new Error("Function not implemented.");
}

