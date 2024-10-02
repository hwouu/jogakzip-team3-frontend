import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";
import axios from "axios";

function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [groupIntro, setGroupIntro] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState(""); // 항상 비밀번호를 받기 위해 유지
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleToggle = () => {
    setIsPublic(!isPublic);
  };

  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // 그룹 데이터를 생성
      const groupData = {
        name: groupName,
        password: password, // 공개 여부와 상관없이 비밀번호를 포함
        imageURL: null, // 이미지를 별도로 처리
        isPublic: isPublic,
        introduction: groupIntro,
      };

      console.log("Sending group data:", JSON.stringify(groupData, null, 2));

      let response;

      if (groupImage) {
        // 이미지가 있을 경우 FormData를 사용하여 전송
        const formData = new FormData();
        Object.keys(groupData).forEach((key) =>
          formData.append(key, groupData[key])
        );
        formData.append("imageURL", groupImage);

        console.log("Sending FormData with image");
        // FormData 내용 로깅
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        response = await axios.post(
          "http://localhost:5000/api/groups",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // 이미지가 없을 경우 JSON 형식으로 전송
        console.log("Sending JSON data without image");

        response = await axios.post(
          "http://localhost:5000/api/groups",
          groupData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Server response:", response.data);

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        alert("그룹이 성공적으로 생성되었습니다.");
        navigate("/groups");
      }

    } catch (error) {
      console.error("Error creating group:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
        console.error("Server error status:", error.response.status);
        console.error("Server error headers:", error.response.headers);
        setErrorMessage(
          error.response.data.message || "그룹 생성 중 오류가 발생했습니다."
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("서버로부터 응답을 받지 못했습니다.");
      } else {
        console.error("Error setting up request:", error.message);
        setErrorMessage("요청 설정 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      <div className="header">
        <h2>그룹 만들기</h2>
      </div>

      <form className="create-group-form" onSubmit={handleSubmit}>
        <label>그룹명</label>
        <input
          type="text"
          placeholder="그룹명을 입력하세요"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />

        <label>대표 이미지</label>
        <input type="file" onChange={handleImageChange} />

        <label>그룹 소개</label>
        <textarea
          placeholder="그룹을 소개해 주세요"
          value={groupIntro}
          onChange={(e) => setGroupIntro(e.target.value)}
        />

        <label>그룹 공개 선택</label>
        <div className="toggle">
          <span>{isPublic ? "공개" : "비공개"}</span>
          <label className="switch">
            <input type="checkbox" checked={isPublic} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
        </div>

        {/* 공개 여부와 상관없이 항상 비밀번호를 입력받음 */}
        <label>비밀번호 생성</label>
        <input
          type="password"
          placeholder="그룹 비밀번호를 생성해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "만드는 중..." : "만들기"}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;
