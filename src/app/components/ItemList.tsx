"use client";
import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

// User 타입 정의
interface User {
  id: number;
  username: string;
  profile_picture: string;
  color_code: string;
  color_desc: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from<User>("users").select("*");

    if (error) console.error("Error fetching users:", error);
    else setUsers(data || []);
  };

  return (
    <div>
      <h2>User List</h2>
      {users.map((user) => (
        <div key={user.id}>
          <img
            src={user.profile_picture}
            alt=" "
            style={{ width: 50, height: 50 }}
          />
          <p>
            {user.username} 지향색 #{user.color_code} ({user.color_desc})
          </p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
