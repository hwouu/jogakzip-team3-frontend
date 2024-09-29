import React, { useState } from "react";
import "./CreateMemory.css";
import Modal from "../../components/Modal"; // 모달 컴포넌트 임포트
import VectorLine from "../../components/VectorLine"; // 직선 벡터 임포트

function CreateMemory() {
  const [isPublic, setIsPublic] = useState(true);
  const [showModal, setShowModal] = useState(false); // 모달 표시 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [groupPassword, setGroupPassword] = useState(""); // 그룹 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggle = () => {
    setIsPublic(!isPublic);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  const handlePasswordSubmit = () => {
    if (password === groupPassword) {
      setErrorMessage("");
      setShowModal(false); // 비밀번호가 일치할 경우 모달을 닫음
    } else {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    }
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
            <span>{isPublic ? "공개" : "비공개"}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleToggle}
              />
              <span className="slider"></span>
            </label>
          </div>

          {!isPublic && (
            <>
              <label>비밀번호 생성</label>
              <input
                type="password"
                placeholder="추억 비밀번호를 생성해 주세요"
              />
            </>
          )}
        </div>
      </div>

      <button className="memory-submit-btn" onClick={handleOpenModal}>
        올리기
      </button>

      {/* 비밀번호 입력을 위한 모달 */}
      <Modal showModal={showModal} handleClose={handleCloseModal}>
        <h2>추억 올리기</h2>
        <label>올리기 권한 인증</label>
        <input
          type="password"
          placeholder="그룹 비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="modal-submit-btn" onClick={handlePasswordSubmit}>
          제출하기
        </button>
      </Modal>
    </div>
  );
}

export default CreateMemory;
