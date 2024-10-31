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
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [writeComment, setWriteComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("user_id", userId) // 현재 페이지의 userId로 필터링
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const handleAddOrEditComment = async () => {
    if (!nickname || !text) return;

    if (editId === null) {
      const { error } = await supabase
        .from("comments")
        .insert([{ nickname, text, user_id: userId }]); // userId 추가

      if (error) {
        console.error("Error adding comment:", error);
      } else {
        setNickname("");
        setText("");
        fetchComments();
      }
      alert("덧글 쓰기가 완료되었어요!");
    } else {
      const { error } = await supabase
        .from("comments")
        .update({ nickname, text })
        .eq("id", editId);

      if (error) {
        console.error("Error editing comment:", error);
      } else {
        setEditId(null);
        setNickname("");
        setText("");
        fetchComments();
      }
      alert("덧글 수정이 완료되었습니다!");
    }
  };

  const handleEditClick = (comment: Comment) => {
    setEditId(comment.id);
    setNickname(comment.nickname);
    setText(comment.text);
    setWriteComment(true);
  };

  const handleCancelEdit = () => {
    setEditId(null); // 수정 모드 해제
    setNickname(""); // 닉네임 초기화
    setText(""); // 텍스트 초기화
    setError(""); // 에러 메시지 초기화
  };

  const handleDeleteComment = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠어요?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("comments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      fetchComments();
    }
  };

  return (
    <div className="comment_wrap">
      {comments.map((comment) => (
        <div key={comment.id} className="content">
          <ul>
            <li className="name">
              <span>{comment.nickname}</span>
              <div className="btn_box">
                <button onClick={() => handleEditClick(comment)}>수정</button>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              </div>
            </li>
            <li>{comment.text}</li>
          </ul>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setWriteComment(!writeComment)}
        className="write"
      >
        덧글쓰자
      </button>

      {writeComment && (
        <div className="write_value">
          <div>
            <label>닉네임</label>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <textarea
            placeholder="댓글 입력"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={handleAddOrEditComment}>
            {editId === null ? "댓글 추가" : "수정 완료"}
          </button>
          {editId !== null && (
            <button type="button" className="cancel" onClick={handleCancelEdit}>
              취소
            </button>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Comments;
