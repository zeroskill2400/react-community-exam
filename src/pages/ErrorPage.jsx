import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">404</h1>
          <p className="py-6">
            죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
          </p>
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
