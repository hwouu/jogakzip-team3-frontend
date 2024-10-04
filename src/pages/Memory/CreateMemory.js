import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CreateMemory.css";
import Modal from "../../components/Modal";
import VectorLine from "../../components/VectorLine";

function CreateMemory() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [groupPassword, setGroupPassword] = useState("");
  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    imageFile: null,
    tags: "",
    location: "",
    moment: "",
    postPassword: "",
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imageFile: e.target.files[0],
    }));
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/verify-password`, { password: groupPassword });
      if (response.status === 200) {
        setErrorMessage("");
        handleSubmit();
        setShowModal(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      } else {
        setErrorMessage("비밀번호 확인 중 오류가 발생했습니다.");
      }
    }
  };

  const handleSubmit = async () => {
    const memoryData = new FormData();
    memoryData.append("nickname", formData.nickname);
    memoryData.append("title", formData.title);
    memoryData.append("content", formData.content);
    memoryData.append("tags", formData.tags);
    memoryData.append("location", formData.location);
    memoryData.append("moment", formData.moment);
    memoryData.append("isPublic", isPublic);
    memoryData.append("postPassword", formData.postPassword);

    if (formData.imageFile) {
      memoryData.append("imageURL", formData.imageFile);
    }

    try {
      await axios.post(`/api/groups/${groupId}/posts`, memoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("추억이 성공적으로 등록되었습니다!");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      if (error.response) {
        alert(`추억 등록에 실패했습니다: ${error.response.data.message}`);
      } else {
        alert("추억 등록 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="create-memory-page-custom">
      <h1 className="create-memory-title">추억 올리기</h1>

      <div className="form-container-custom">
        <div className="form-left-custom">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임을 입력해 주세요"
            value={formData.nickname}
            onChange={handleChange}
          />

          <label>제목</label>
          <input
            type="text"
            name="title"
            placeholder="제목을 입력해 주세요"
            value={formData.title}
            onChange={handleChange}
          />

          <label>이미지</label>
          <input type="file" name="imageFile" onChange={handleFileChange} />
          
          <label>본문</label>
          <textarea
            name="content"
            placeholder="본문 내용을 입력해 주세요"
            value={formData.content}
            onChange={handleChange}
          />
        </div>

        <VectorLine />

        <div className="form-right-custom">
          <label>태그</label>
          <input
            type="text"
            name="tags"
            placeholder="태그를 입력해 주세요 (쉼표로 구분)"
            value={formData.tags}
            onChange={handleChange}
          />

          <label>장소</label>
          <input
            type="text"
            name="location"
            placeholder="장소를 입력해 주세요"
            value={formData.location}
            onChange={handleChange}
          />

          <label>추억의 순간</label>
          <input
            type="date"
            name="moment"
            value={formData.moment}
            onChange={handleChange}
          />

          <label>추억 공개 선택</label>
          <div className="toggle-custom">
            <span>{isPublic ? "공개" : "비공개"}</span>
            <label className="switch-custom">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={handleToggle}
              />
              <span className="slider-custom"></span>
            </label>
          </div>

          <label>비밀번호 생성</label>
          <input
            type="password"
            name="postPassword"
            placeholder="추억 비밀번호를 생성해 주세요"
            value={formData.postPassword}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="memory-submit-btn-custom" onClick={handleOpenModal}>
        올리기
      </button>

      <Modal showModal={showModal} handleClose={handleCloseModal}>
        <h2>추억 올리기</h2>
        <label>올리기 권한 인증</label>
        <input
          type="password"
          placeholder="그룹 비밀번호를 입력해 주세요"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message-custom">{errorMessage}</p>}
        <button
          className="modal-submit-btn-custom"
          onClick={handlePasswordSubmit}
        >
          제출하기
        </button>
      </Modal>
    </div>
  );
}

export default CreateMemory;