import { useState } from "react";
import {
  insertProductsFromAPI,
  fetchProductsByCategoryFromAPI,
} from "../apis/productApi";

function ProductSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInsertAllProducts = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await insertProductsFromAPI();
      setMessage("✅ 모든 상품이 성공적으로 추가되었습니다!");
    } catch (error) {
      setMessage(`❌ 오류 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertByCategory = async (category) => {
    setIsLoading(true);
    setMessage("");

    try {
      const products = await fetchProductsByCategoryFromAPI(category);

      const { error } = await supabase.from("products").insert(products);

      if (error) throw error;

      setMessage(
        `✅ ${category} 카테고리의 ${products.length}개 상품이 추가되었습니다!`
      );
    } catch (error) {
      setMessage(`❌ 오류 발생: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "men's clothing",
    "women's clothing",
    "jewelery",
    "electronics",
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">상품 데이터 설정</h1>

      <div className="space-y-6">
        {/* 전체 상품 추가 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">전체 상품 추가</h2>
            <p className="text-gray-600">
              FakeStore API에서 모든 상품 데이터를 가져와서 데이터베이스에
              추가합니다.
            </p>
            <div className="card-actions justify-end">
              <button
                onClick={handleInsertAllProducts}
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    추가 중...
                  </>
                ) : (
                  "전체 상품 추가"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 카테고리별 추가 */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">카테고리별 상품 추가</h2>
            <p className="text-gray-600">특정 카테고리의 상품만 추가합니다.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleInsertByCategory(category)}
                  disabled={isLoading}
                  className="btn btn-outline btn-sm"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 메시지 표시 */}
        {message && (
          <div
            className={`alert ${
              message.includes("✅") ? "alert-success" : "alert-error"
            }`}
          >
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductSetupPage;
