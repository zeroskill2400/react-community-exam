import { useState } from "react";
import { supabase } from "../libs/supabase";
import { useUserStore } from "../stores/userStore";
import { useLocation, useNavigate } from "react-router-dom";
import useCartStore from "../stores/cartStore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useCartStore((state) => state.addToCart);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      useUserStore.getState().setUser(data.user);

      // --- 리디렉션 로직 ---
      const productToAdd = location.state?.productToAdd;
      if (productToAdd) {
        // 담으려던 상품이 있으면 장바구니에 추가하고
        addToCart(productToAdd);
        // 장바구니 페이지로 이동합니다.
        navigate("/cart", { replace: true });
      } else {
        // 그렇지 않으면, 원래 가려던 곳이나 메인 페이지로 이동합니다.
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      setError(error.message);
      console.error("로그인 실패", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <form className="card-body" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
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
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{"로그인 실패"}</p>
          )}
          <div className="form-control mt-6">
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner" />
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
