import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchProducts,
  fetchProductsByCategory,
  searchProducts,
} from "../apis/productApi";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const itemsPerPage = 12;

  // 카테고리 목록
  const categories = [
    { value: "all", label: "전체" },
    { value: "men's clothing", label: "남성 의류" },
    { value: "women's clothing", label: "여성 의류" },
    { value: "jewelery", label: "쥬얼리" },
    { value: "electronics", label: "전자제품" },
  ];

  // 상품 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let result;

        if (searchTerm) {
          // 검색
          const searchResults = await searchProducts(searchTerm);
          result = {
            products: searchResults,
            totalCount: searchResults.length,
          };
        } else if (selectedCategory !== "all") {
          // 카테고리별 필터링
          const categoryProducts = await fetchProductsByCategory(
            selectedCategory
          );
          result = {
            products: categoryProducts,
            totalCount: categoryProducts.length,
          };
        } else {
          // 전체 상품 (페이지네이션)
          result = await fetchProducts(currentPage, itemsPerPage);
        }

        // 정렬 적용
        let sortedProducts = [...result.products];
        switch (sortBy) {
          case "price-low":
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case "name":
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "newest":
          default:
            // 이미 최신순으로 정렬됨
            break;
        }

        setProducts(sortedProducts);
        setTotalPages(Math.ceil(result.totalCount / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory, searchTerm, sortBy]);

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
          <span className="ml-2">상품을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="alert alert-error">
          <span>에러: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">상품 목록</h1>
        <p className="text-gray-500">다양한 상품들을 둘러보세요.</p>
      </div>

      {/* 필터 및 검색 */}
      <div className="mb-6 space-y-4">
        {/* 검색 */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="상품명을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered flex-1"
          />
          <button type="submit" className="btn btn-primary">
            검색
          </button>
        </form>

        {/* 필터 및 정렬 */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">카테고리:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-bordered select-sm"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">정렬:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered select-sm"
            >
              <option value="newest">최신순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="name">이름순</option>
            </select>
          </div>

          {/* 결과 개수 */}
          <span className="text-sm text-gray-500">
            총 {products.length}개 상품
          </span>
        </div>
      </div>

      {/* 상품 목록 */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
            >
              <figure className="px-4 pt-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="rounded-xl h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg">
                  <Link
                    to={`/products/${product.id}`}
                    className="hover:text-primary"
                  >
                    {product.name.length > 50
                      ? product.name.substring(0, 50) + "..."
                      : product.name}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description.length > 100
                    ? product.description.substring(0, 100) + "..."
                    : product.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-primary">
                    ₩{formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-gray-500">
                    재고: {product.stock}개
                  </span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn btn-primary btn-sm"
                  >
                    상세보기
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 (전체 상품일 때만) */}
      {selectedCategory === "all" && !searchTerm && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`join-item btn ${
                  currentPage === page ? "btn-active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListPage;
