import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // 헤더 임포트
import GroupList from "./pages/Group/GroupList"; // 그룹 리스트 페이지 임포트
import CreateGroup from "./pages/Group/CreateGroup"; // 그룹 생성 페이지 임포트
import GroupDetail from "./pages/Group/GroupDetail"; // 그룹 상세 페이지 임포트
import CreateMemory from "./pages/Memory/CreateMemory"; // 게시글 작성 페이지 임포트
import MemoryDetail from "./pages/Memory/MemoryDetail"; // 추억 상세 페이지 임포트
import PrivateGroupAccess from "./pages/Group/PrivateGroupAccess"; // 비공개 그룹 비밀번호 페이지 임포트

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
        <Route path="/groups/:groupId/create-memory" element={<CreateMemory />} /> {/* 특정 그룹에 대한 게시글 작성 페이지 */}
        <Route path="/groups/:groupId/memory/:memoryId" element={<MemoryDetail />} /> {/* 특정 그룹 내 추억 상세 페이지 */}
        <Route path="/groups/:groupId/private-access" element={<PrivateGroupAccess />} /> {/* 비공개 그룹 접근 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;
