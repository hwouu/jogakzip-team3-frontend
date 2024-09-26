import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅 사용
import './CreateGroup.css'; // CreateGroup.css 파일을 적용
import axios from 'axios'; // Axios를 사용하여 API 호출

function CreateGroup() {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 생성
  const [groupName, setGroupName] = useState('');
  const [groupIntro, setGroupIntro] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 토글 버튼 처리
  const handleToggle = () => {
    setIsPublic(!isPublic);
    setPassword(''); // 공개로 전환 시 비밀번호 필드 초기화
  };

  // 그룹 이미지 업로드 핸들러
  const handleImageChange = (e) => {
    setGroupImage(e.target.files[0]);
  };

  // 그룹 생성 API 호출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // FormData를 사용하여 이미지 파일과 데이터를 전송
      const formData = new FormData();
      formData.append('name', groupName);
      formData.append('introduction', groupIntro);
      formData.append('isPublic', isPublic);
      if (!isPublic) {
        formData.append('password', password); // 비공개일 경우에만 비밀번호 포함
      }
      if (groupImage) {
        formData.append('imageURL', groupImage);
      }

      // API 호출
      const response = await axios.post('http://localhost:5000/api/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        alert('그룹이 성공적으로 생성되었습니다.');
        // 그룹 생성 성공 시 그룹 리스트 페이지로 이동
        navigate('/groups');
      }
    } catch (error) {
      setErrorMessage('그룹 생성 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      {/* 상단 로고 아이콘 추가 */}
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
        {/* 토글 버튼 */}
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
            <input
              type="password"
              placeholder="그룹 비밀번호를 생성해 주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isPublic} // 비공개 그룹일 때만 필수 입력
            />
          </>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? '만드는 중...' : '만들기'}
        </button>
      </form>
    </div>
  );
}

export default CreateGroup;