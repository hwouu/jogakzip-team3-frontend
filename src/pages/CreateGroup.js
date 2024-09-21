import React, { useState } from "react";
import "./CreateGroup.css"; // CSS 파일을 불러옵니다.

const CreateGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");

  const handleGroupImageChange = (event) => {
    setGroupImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 그룹 생성 API 호출 (axios 사용 가능)
    console.log({
      groupName,
      groupDescription,
      groupImage,
      isPublic,
      password,
    });
  };

  return (
    <div className="create-group-container">
      <h1>그룹 만들기</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupName">그룹명</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="그룹명을 입력해 주세요"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="groupImage">대표 이미지</label>
          <input
            type="file"
            id="groupImage"
            onChange={handleGroupImageChange}
            placeholder="파일을 선택해 주세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="groupDescription">그룹 소개</label>
          <textarea
            id="groupDescription"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            placeholder="그룹 소개를 입력해 주세요"
          />
        </div>

        <div className="form-group">
          <label htmlFor="isPublic">그룹 공개 선택</label>
          <div className="switch">
            <label>
              공개
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호 생성</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 생성해 주세요"
          />
        </div>

        <button type="submit" className="submit-button">
          만들기
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
