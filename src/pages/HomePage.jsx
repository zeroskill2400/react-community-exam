import { Link } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function HomePage() {
  const user = useUserStore((s) => s.user);

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* 히어로 섹션 */}
      <div className="hero min-h-[60vh] bg-gradient-to-r from-primary to-secondary text-primary-content rounded-lg mb-12">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">My Community</h1>
            <p className="py-6 text-lg">
              커뮤니티와 쇼핑을 한 곳에서! 다양한 이야기를 나누고 좋은 상품을
              만나보세요.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/posts" className="btn btn-primary">
                게시판 보기
              </Link>
              <Link to="/products" className="btn btn-outline btn-primary">
                쇼핑하기
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 기능 소개 섹션 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* 게시판 카드 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="card-title justify-center">자유 게시판</h2>
            <p className="text-gray-600">
              다양한 주제로 이야기를 나누고 정보를 공유하세요.
            </p>
            <div className="card-actions justify-center">
              <Link to="/posts" className="btn btn-primary">
                게시판 가기
              </Link>
            </div>
          </div>
        </div>

        {/* 쇼핑 카드 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="card-title justify-center">상품 쇼핑</h2>
            <p className="text-gray-600">
              다양한 상품을 둘러보고 장바구니에 담아보세요.
            </p>
            <div className="card-actions justify-center">
              <Link to="/products" className="btn btn-primary">
                쇼핑하기
              </Link>
            </div>
          </div>
        </div>

        {/* 커뮤니티 카드 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center">
            <div className="text-4xl mb-4">👥</div>
            <h2 className="card-title justify-center">커뮤니티</h2>
            <p className="text-gray-600">
              회원들과 소통하고 정보를 공유하는 공간입니다.
            </p>
            <div className="card-actions justify-center">
              {user ? (
                <Link to="/profile" className="btn btn-primary">
                  내 정보
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 상품 섹션 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">최근 상품</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 더미 상품 카드들 */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card bg-base-100 shadow-lg">
              <figure className="px-4 pt-4">
                <img
                  src={`https://picsum.photos/300/200?random=${i}`}
                  alt={`상품 ${i}`}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">상품 {i}</h3>
                <p className="text-primary font-bold">₩{i * 10000}</p>
                <div className="card-actions justify-end">
                  <Link to="/products" className="btn btn-primary btn-sm">
                    보러가기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">지금 시작해보세요!</h2>
        <p className="text-gray-600 mb-6">
          커뮤니티에 가입하고 다양한 혜택을 누려보세요.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link to="/products" className="btn btn-primary btn-lg">
              쇼핑 시작하기
            </Link>
          ) : (
            <>
              <Link to="/signup" className="btn btn-primary btn-lg">
                회원가입
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
