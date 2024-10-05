import React, { useState } from "react";
import axios from "axios";
import "./PrivateMemoryAccess.css";

const PrivateMemoryAccess = ({ groupId, postId, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(`/api/groups/${groupId}/posts/${postId}/verify-password`, { PPassword: password });
      if (response.status === 200) {
        onSuccess();
      } else {
        setError("비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="private-memory-container">
      <h2 className="private-memory-title">비공개 추억</h2>
      <p className="private-memory-subtitle">
        이 추억을 보려면 비밀번호를 입력해주세요.
      </p>
      <form onSubmit={handleSubmit} className="private-memory-form">
        <label className="private-memory-label" htmlFor="memory-password">
          비밀번호 입력
        </label>
        <input
          id="memory-password"
          type="password"
          placeholder="추억 비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="private-memory-input"
        />
        {error && <p className="private-memory-error">{error}</p>}
        <button type="submit" className="private-memory-submit-btn">
          확인
        </button>
      </form>
    </div>
  );
};

export default PrivateMemoryAccess;
