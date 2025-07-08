import { Link } from "react-router-dom";
import useCartStore from "../stores/cartStore";
import { useUserStore } from "../stores/userStore";

function Header() {
  const user = useUserStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          My Community
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/posts">게시판</Link>
          </li>
          <li>
            <Link to="/products">상품 목록</Link>
          </li>
          <li>
            <Link to="/cart" className="flex items-center">
              장바구니
              {totalItems > 0 && (
                <div className="badge badge-primary ml-2">{totalItems}</div>
              )}
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </>
          )}
          {user && (
            <li>
              <Link to="/profile">내 정보</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
