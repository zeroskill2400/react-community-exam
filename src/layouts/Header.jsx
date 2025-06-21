function Header() {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost text-xl">
          My Community
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a href="/">홈</a>
          </li>
          <li>
            <a href="/posts">게시판</a>
          </li>
          <li>
            <a href="/login">로그인</a>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
