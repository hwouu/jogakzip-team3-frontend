import React, { useState } from 'react';
import './CreateMemory.css'; // 스타일링 파일
import VectorLine from '../../components/VectorLine'; // 대문자 V 사용


function CreateMemory() {
  const [isPublic, setIsPublic] = useState(true);

  const handleToggle = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div className="create-memory-page">
      <h1>추억 올리기</h1>

      <div className="form-container">
        <div className="form-left">
          <label>닉네임</label>
          <input type="text" placeholder="닉네임을 입력해 주세요" />

          <label>제목</label>
          <input type="text" placeholder="제목을 입력해 주세요" />

          <label>이미지</label>
          <input type="file" />

          <label>본문</label>
          <textarea placeholder="본문 내용을 입력해 주세요" />
        </div>

        <VectorLine /> {/* 가운데 직선 벡터 추가 */}

        <div className="form-right">
          <label>태그</label>
          <input type="text" placeholder="태그를 입력해 주세요" />

          <label>장소</label>
          <input type="text" placeholder="장소를 입력해 주세요" />

          <label>추억의 순간</label>
          <input type="date" />

          <label>추억 공개 선택</label>
          <div className="toggle">
            <span>{isPublic ? '공개' : '비공개'}</span>
            <label className="switch">
              <input type="checkbox" checked={isPublic} onChange={handleToggle} />
              <span className="slider"></span>
            </label>
          </div>

          {!isPublic && (
            <>
              <label>비밀번호 생성</label>
              <input type="password" placeholder="추억 비밀번호를 생성해 주세요" />
            </>
          )}
        </div>
      </div>

      <button className="submit-btn">올리기</button>
    </div>
  );
}

export default CreateMemory;
