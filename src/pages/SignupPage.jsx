import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      console.error("회원가입 실패", error);
      return;
    }

    // 이메일 인증이 필요한 경우 data.session 이 null 로 옵니다.
    if (!data.session) {
      setSuccess(
        "가입이 완료되었습니다! 이메일을 확인하여 인증을 마무리해 주세요."
      );
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setSuccess("가입 및 로그인 완료!");
      useUserStore.getState().setUser(data.user);
      setTimeout(() => navigate("/"), 1500);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>
          <div className="form-control">
            <label className="label" htmlFor="email">
              <span className="label-text">이메일</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text">비밀번호</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text">비밀번호 확인</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input input-bordered"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                "가입하기"
              )}
            </button>
          </div>
          <p className="text-center text-sm mt-2">
            이미 계정이 있으신가요?{" "}
            <Link className="link link-hover" to="/login">
              로그인
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
