import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./PrivateGroupAccess.css"; // CSS 파일 임포트

const PrivateGroupAccess = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { groupId } = useParams();

  // 비밀번호 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupId) {
      setError("그룹 ID가 유효하지 않습니다.");
      return;
    }
    try {
      // JSON 형식으로 비밀번호 전송
      const response = await axios.post(
        `http://15.165.136.170:5000/api/groups/${groupId}/verify-password`,
        { password }, // JSON 형식으로 요청 본문 전송
        {
          headers: {
            "Content-Type": "application/json", // 헤더에 JSON 타입 명시
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem(`group_${groupId}_access`, "true");
        navigate(`/groups/${groupId}`);
      } else {
        setError("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setError("비밀번호 확인에 실패했습니다.");
    }
  };

  return (
    <div className="private-group-container">
      <h2 className="private-group-title">비공개 그룹</h2>
      <p className="private-group-subtitle">
        비공개 그룹에 접근하기 위해 비밀번호 확인이 필요합니다.
      </p>
      <form onSubmit={handleSubmit} className="private-group-form">
        <label className="private-group-label" htmlFor="group-password">
          비밀번호 입력
        </label>
        <input
          id="group-password"
          type="password"
          placeholder="그룹 비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="private-group-input"
        />
        {error && <p className="private-group-error">{error}</p>}
        <button type="submit" className="private-group-submit-btn">
          제출하기
        </button>
      </form>
    </div>
  );
};

export default PrivateGroupAccess;
