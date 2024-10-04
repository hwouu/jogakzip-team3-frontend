import React, { useState } from "react";
import axios from "axios";

import "./PrivateMemoryAccess.css";

const PrivateMemoryAccess = ({ postId, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/verify-password`, { postPassword: password });
      if (response.data.valid) {
        onSuccess(); // 비밀번호가 맞으면 성공 콜백 호출
      } else {
        setError("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      setError("비밀번호 확인에 실패했습니다.");
    }
  };

  return (
    <div>
      <h2>비공개 추억</h2>
      <input
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>제출</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default PrivateMemoryAccess;
