import React, { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

interface Comment {
  id: number;
  nickname: string;
  text: string;
  created_at: string;
  user_id: string | null;
}

const Comments: React.FC<{ userId: string | null }> = ({ userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const handleAddComment = async () => {
    if (!nickname || !text) return;

    const { error } = await supabase
      .from("comments")
      .insert([{ nickname, text, user_id: userId }]);

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNickname("");
      setText("");
      fetchComments(); // 새 댓글 추가 후 댓글 목록 갱신
    }
  };

  const handleEditComment = async (id: number) => {
    if (editPassword !== password) {
      setError("비밀번호가 틀립니다.");
      return;
    }

    const { error } = await supabase
      .from("comments")
      .update({ text })
      .eq("id", id);

    if (error) {
      console.error("Error editing comment:", error);
    } else {
      setEditId(null); // 수정 모드 종료
      setPassword(""); // 비밀번호 초기화
      fetchComments(); // 댓글 목록 갱신
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (editPassword !== password) {
      setError("비밀번호가 틀립니다.");
      return;
    }

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      fetchComments(); // 댓글 목록 갱신
    }
  };

  return (
    <div>
      <h2>댓글</h2>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>
            {comment.nickname}: {comment.text}
          </p>
          <button
            onClick={() => {
              setEditId(comment.id);
              setText(comment.text);
            }}
          >
            수정
          </button>
          <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
        </div>
      ))}

      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <textarea
        placeholder="댓글 입력"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleAddComment}>댓글 추가</button>

      {editId !== null && (
        <div>
          <input
            type="password"
            placeholder="비밀번호 입력"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
          />
          <button onClick={() => handleEditComment(editId)}>수정 완료</button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Comments;
