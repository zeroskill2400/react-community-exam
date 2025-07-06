import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import {
  updateUserProfile,
  updateUserPassword,
  updateUserEmail,
} from "../apis/userApi";

function ProfilePage() {
  const user = useUserStore((s) => s.user);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 프로필 정보 수정
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateUserProfile(user.id, { full_name: fullName });
      setMessage("프로필 정보가 수정되었습니다.");
    } catch (err) {
      setMessage("수정 실패: " + err.message);
    }
    setLoading(false);
  };

  // 이메일 변경
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateUserEmail(email);
      setMessage("이메일이 변경되었습니다. 인증 메일을 확인하세요.");
    } catch (err) {
      setMessage("이메일 변경 실패: " + err.message);
    }
    setLoading(false);
  };

  // 비밀번호 변경
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await updateUserPassword(password);
      setMessage("비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
    } catch (err) {
      setMessage("비밀번호 변경 실패: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">내 정보</h1>
      <div className="tabs mb-6">
        <button
          className={`tab tab-bordered ${tab === "profile" ? "tab-active" : ""}`}
          onClick={() => setTab("profile")}
        >
          프로필 정보
        </button>
        <button
          className={`tab tab-bordered ${tab === "email" ? "tab-active" : ""}`}
          onClick={() => setTab("email")}
        >
          이메일 변경
        </button>
        <button
          className={`tab tab-bordered ${tab === "password" ? "tab-active" : ""}`}
          onClick={() => setTab("password")}
        >
          비밀번호 변경
        </button>
      </div>

      {message && (
        <div className="alert alert-info mb-4 py-2 px-4">{message}</div>
      )}

      {tab === "profile" && (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">이름</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">이메일</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={user.email}
              disabled
            />
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "저장 중..." : "프로필 저장"}
          </button>
        </form>
      )}

      {tab === "email" && (
        <form onSubmit={handleEmailUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">새 이메일</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "변경 중..." : "이메일 변경"}
          </button>
        </form>
      )}

      {tab === "password" && (
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">새 비밀번호</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>
      )}

      <button
        className="btn btn-error mt-8 w-full"
        onClick={() => useUserStore.getState().clearUser()}
      >
        로그아웃
      </button>
    </div>
  );
}

export default ProfilePage;
