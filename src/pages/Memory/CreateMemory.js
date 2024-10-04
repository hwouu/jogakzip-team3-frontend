import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CreateMemory.css";
import Modal from "../../components/Modal";
import VectorLine from "../../components/VectorLine";

// 파일 상단에 baseURL을 정의합니다.
const baseURL = "http://localhost:5000"; // 또는 실제 API 서버의 주소

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

  // handlePasswordSubmit 함수를 수정합니다.
  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/groups/${groupId}/verify-password`, { password: groupPassword });
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
        console.error("Error details:", error);
      }
    }
  };

  // handleSubmit 함수도 수정합니다.
  const handleSubmit = async () => {
    const memoryData = new FormData();
    memoryData.append("nickname", formData.nickname);
    memoryData.append("title", formData.title);
    memoryData.append("content", formData.content);
    memoryData.append("isPublic", isPublic.toString());
    memoryData.append("postPassword", formData.postPassword);
    
    if (formData.imageFile) {
      memoryData.append("imageUrl", formData.imageFile);
    }
    
    if (formData.location) {
      memoryData.append("location", formData.location);
    }
    
    if (formData.moment) {
      memoryData.append("moment", formData.moment);
    }

    if (formData.tags) {
      memoryData.append("tags", JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));
    }

    console.log("Sending data to server:");
    for (let [key, value] of memoryData.entries()) {
      console.log(key, typeof value, value);
    }

    try {
      const response = await axios.post(`${baseURL}/api/groups/${groupId}/posts`, memoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);
      alert("추억이 성공적으로 등록되었습니다!");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error("Error details:", error);
      let errorMessage = "추억 등록에 실패했습니다: ";

      if (error.response) {
        console.error("Server error response:", error.response.data);
        console.error("Server error status:", error.response.status);
        
        if (error.response.data.errors) {
          // Handle validation errors
          const validationErrors = error.response.data.errors;
          errorMessage += Object.keys(validationErrors)
            .map(key => `${key}: ${validationErrors[key].join(', ')}`)
            .join('; ');
        } else if (error.response.data.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += '서버에서 오류가 발생했습니다.';
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        errorMessage += "서버로부터 응답을 받지 못했습니다.";
      } else {
        console.error("Error setting up request:", error.message);
        errorMessage += "요청 설정 중 오류가 발생했습니다.";
      }

      alert(errorMessage);
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