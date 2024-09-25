import React, { useState } from 'react';
import './CreateGroup.css'; // CreateGroup.css 파일을 적용

function CreateGroup() {
  const [isPublic, setIsPublic] = useState(true);

  const handleToggle = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div className="create-group-page">
      {/* 상단 로고 아이콘 추가 */}
      <div className="header">
        <img src="jogakzip1.svg" alt="조각집 로고" className="icon" />
        <h2>그룹 만들기</h2>
      </div>

      <form className="create-group-form">
        <label>그룹명</label>
        <input type="text" placeholder="그룹명을 입력하세요" />

        <label>대표 이미지</label>
        <input type="file" />

        <label>그룹 소개</label>
        <textarea placeholder="그룹을 소개해 주세요" />

        <label>그룹 공개 선택</label>
        {/* 토글 버튼 */}
        <div className="toggle">
          <span>{isPublic ? '공개' : '비공개'}</span>
          <label className="switch">
            <input type="checkbox" checked={isPublic} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
        </div>

        <label>비밀번호 생성</label>
        <input type="password" placeholder="그룹 비밀번호를 생성해 주세요" />

        <button type="submit">만들기</button>
      </form>
    </div>
  );
}

export default CreateGroup;