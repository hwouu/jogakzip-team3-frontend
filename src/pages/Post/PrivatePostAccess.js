import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PrivatePostAccess.css";

const PrivatePostAccess = ({ postId }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { groupId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `http://15.165.136.170:5000/api/posts/${postId}/verify-password`,
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem(`post_${postId}_access`, "true");
        navigate(`/groups/${groupId}/post/${postId}`); // 비밀번호 검증 후 바로 게시물로 이동
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("틀린 비밀번호입니다.");
            break;
          case 404:
            setError("게시물을 찾을 수 없습니다.");
            break;
          default:
            setError("비밀번호 확인 중 오류가 발생했습니다.");
        }
      } else {
        setError("서버와의 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="private-post-container">
      <h2 className="private-post-title">비공개 게시물</h2>
      <p className="private-post-subtitle">
        이 게시물을 보려면 비밀번호를 입력해주세요.
      </p>
      <form onSubmit={handleSubmit} className="private-post-form">
        <label className="private-post-label" htmlFor="post-password">
          비밀번호 입력
        </label>
        <input
          id="post-password"
          type="password"
          placeholder="게시물 비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="private-post-input"
        />
        {error && <p className="private-post-error">{error}</p>}
        <button type="submit" className="private-post-submit-btn">
          확인
        </button>
      </form>
    </div>
  );
};

export default PrivatePostAccess;
