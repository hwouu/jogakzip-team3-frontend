import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from "react-router-dom";
import Header from "./components/Header"; // 헤더 임포트
import GroupList from "./pages/Group/GroupList"; // 그룹 리스트 페이지 임포트
import CreateGroup from "./pages/Group/CreateGroup"; // 그룹 생성 페이지 임포트
import GroupDetail from "./pages/Group/GroupDetail"; // 그룹 상세 페이지 임포트
import CreatePost from "./pages/Post/CreatePost"; // CreateMemory 대신 CreatePost 임포트
import PostDetail from "./pages/Post/PostDetail"; // 추억 상세 페이지 임포트
import PrivateGroupAccess from "./pages/Group/PrivateGroupAccess"; // 비공개 그룹 비밀번호 페이지 임포트
import PrivatePostAccess from "./pages/Post/PrivatePostAccess"; // 추가

function PrivateGroupAccessWrapper() {
  const { groupId } = useParams();
  return <PrivateGroupAccess groupId={groupId} />;
}

function App() {
  return (
    <Router>
      {/* 모든 페이지 상단에 공통적으로 표시될 헤더 */}
      <Header />

      {/* 페이지 라우팅 */}
      <Routes>
        <Route path="/" element={<GroupList />} /> {/* 기본 페이지를 GroupList로 설정 */}
        <Route path="/groups" element={<GroupList />} /> {/* 그룹 목록 페이지 */}
        <Route path="/create-group" element={<CreateGroup />} /> {/* 그룹 생성 페이지 */}
        <Route path="/groups/:groupId" element={<GroupDetail />} /> {/* 그룹 상세 페이지 */}
        <Route path="/groups/:groupId/create-post" element={<CreatePost />} /> {/* CreateMemory를 CreatePost로 변경 */}
        <Route path="/groups/:groupId/post/:postId" element={<PostDetail />} /> {/* 특정 그룹 내 추억 상세 페이지 */}
        <Route path="/groups/:groupId/private-access" element={<PrivateGroupAccessWrapper />} /> {/* 비공개 그룹 접근 페이지 */}
        {/* 비공개 게시물 접근 라우트 추가 */}
        <Route path="/groups/:groupId/post/:postId/private-access" element={<PrivatePostAccess />} />
      </Routes>
    </Router>
  );
}

export default App;
