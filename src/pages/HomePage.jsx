import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)] p-4">
      {/* Hero Section */}
      <div className="hero rounded-lg bg-base-200 p-10 text-center mb-10 shadow-xl">
        <div className="hero-content flex-col">
          <h1 className="text-5xl font-bold">
            My Community에 오신 것을 환영합니다!
          </h1>
          <p className="py-6 max-w-md">
            이곳은 자유롭게 이야기를 나누고 정보를 공유하는 공간입니다. 지금
            바로 참여하여 새로운 소식을 확인해 보세요.
          </p>
          <Link to="/posts" className="btn btn-primary">
            게시판 보러가기
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-6">주요 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <h3 className="card-title">실시간 소통</h3>
              <p>다른 사용자들과 실시간으로 의견을 나누고 소통해 보세요.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <h3 className="card-title">정보 공유</h3>
              <p>다양한 주제에 대한 유용한 정보와 팁을 공유할 수 있습니다.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body items-center text-center">
              <h3 className="card-title">간편한 사용법</h3>
              <p>직관적인 UI로 누구나 쉽게 글을 작성하고 참여할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
