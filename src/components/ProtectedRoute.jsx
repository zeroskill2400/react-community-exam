import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function ProtectedRoute({ children }) {
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // 사용자가 로그인하지 않았으면 로그인 페이지로 리디렉션합니다.
    // 사용자가 원래 가려던 페이지 위치를 state에 저장하여 로그인 후 돌아올 수 있게 합니다.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
