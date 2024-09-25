import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 그룹 ID를 URL 파라미터로 가져오기
import './GroupDetail.css'; // 스타일링 적용

const GroupDetail = () => {
  const { id } = useParams(); // URL에서 groupId 가져오기
  const [groupData, setGroupData] = useState(null);  // 그룹 데이터를 저장할 상태
  const [isProtected, setIsProtected] = useState(false); // 비공개 그룹 보호 여부
  const [inputPassword, setInputPassword] = useState(''); // 비밀번호 입력 상태

  // 그룹 데이터를 API에서 가져오는 함수 (예시)
  useEffect(() => {
    // 여기에 실제 API 호출 로직을 추가 (백엔드 API와 연동)
    // 예시 목업 데이터를 사용
    const mockGroupDataList = [
      {
        id: 1,
        title: '에델바이스',
        description: '서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.',
        badges: [
          { id: 1, name: '7월 순수 추억 획득' },
          { id: 2, name: '그룹 공감 1만 이상 받기' },
          { id: 3, name: '게시글 공감 1만 이상 받기' },
        ],
        memories: 120,
        likes: 1500,
        dDay: 265,
        isPublic: true,
        imgSrc: 'edelweiss-public.png',
        password: null, // 공개 그룹은 비밀번호가 없음
      },
      {
        id: 2,
        title: '안개꽃',
        description: '작은 순간을 함께 기억하는 꽃같은 우리들',
        badges: [
          { id: 1, name: '그룹 공감 1만 이상 받기' },
          { id: 2, name: '7월 순수 추억 획득' },
        ],
        memories: 80,
        likes: 900,
        dDay: 180,
        isPublic: false,
        imgSrc: null, // 비공개 그룹은 이미지를 출력하지 않음
        password: 'secret123', // 비공개 그룹 비밀번호
      },
    ];

    // 실제 API 요청 대신 목업 데이터를 필터링하여 사용
    const selectedGroup = mockGroupDataList.find(group => group.id === parseInt(id));

    if (selectedGroup) {
      setGroupData(selectedGroup);
      setIsProtected(!selectedGroup.isPublic); // 비공개 그룹일 경우 보호 설정
    } else {
      console.error("그룹 데이터를 찾을 수 없습니다.");
    }
  }, [id]);

  const handlePasswordSubmit = () => {
    if (inputPassword === groupData.password) {
      setIsProtected(false);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLike = () => {
    // 공감 보내기 기능 (추후 백엔드 API 호출)
    alert('공감을 보냈습니다!');
  };

  // 로딩 상태 처리
  if (!groupData) {
    return <div>로딩 중...</div>;
  }

  // 비공개 그룹의 경우 비밀번호 검증 화면 표시
  if (isProtected) {
    return (
      <div className="group-detail-container protected">
        <h2 className="protected-title">비공개 추억</h2>
        <p>비공개 추억에 접근하기 위해 권한 확인이 필요합니다.</p>
        <input
          type="password"
          placeholder="추억 비밀번호를 입력해 주세요"
          className="password-input"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button className="submit-btn" onClick={handlePasswordSubmit}>제출하기</button>
      </div>
    );
  }

  return (
    <div className="group-detail-container">
      <div className="group-header">
        {groupData.imgSrc && <img src={groupData.imgSrc} alt={groupData.title} className="group-img" />}
        <div className="group-info">
          <h1>{groupData.title}</h1>
          <p>{groupData.description}</p>
          <span>{groupData.isPublic ? '공개' : '비공개'}</span>
          <span>D+{groupData.dDay}</span>
          <div className="group-stats">
            <span>추억 {groupData.memories}</span>
            <span>그룹 공감 {groupData.likes}</span>
          </div>
        </div>
      </div>

      {/* 획득 배지 */}
      <div className="badges">
        <h3>획득 배지</h3>
        <ul>
          {groupData.badges.map((badge) => (
            <li key={badge.id}>{badge.name}</li>
          ))}
        </ul>
      </div>

      {/* 공감 보내기 */}
      <button className="like-btn" onClick={handleLike}>공감 보내기</button>

      {/* 추억 목록 */}
      <div className="memories-list">
        <h3>추억 목록</h3>
        <div className="memories-cards">
          {Array(12).fill().map((_, idx) => (
            <div key={idx} className="memory-card">
              {groupData.imgSrc && <img src={groupData.imgSrc} alt={`추억 ${idx + 1}`} className="memory-img" />}
              <p>{groupData.title}의 추억을 소중한 추억으로 장식하다 {idx + 1}</p>
              <span>공감 120</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;