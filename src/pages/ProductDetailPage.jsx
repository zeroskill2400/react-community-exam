import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById } from "../apis/productApi";
import { addToCart } from "../apis/cartApi";
import { useUserStore } from "../stores/userStore";
import { useCartStore } from "../stores/cartStore";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const { addToCart: addToCartStore, refreshCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Math.min(Number(e.target.value), product?.stock || 1));
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setCartMessage("로그인 후 장바구니를 이용할 수 있습니다.");
      return;
    }

    setIsAddingToCart(true);
    setCartMessage("");

    try {
      const newCartItem = await addToCart({
        user_id: user.id,
        product_id: product.id,
        quantity,
      });

      // 장바구니 상태 업데이트
      addToCartStore(newCartItem);
      
      setCartMessage("장바구니에 추가되었습니다!");
      
      // 3초 후 메시지 제거
      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    } catch (err) {
      setCartMessage("장바구니 추가 중 오류: " + err.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">상품 정보를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        에러: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-8 text-center">
        상품을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <button onClick={() => navigate("/products")} className="btn btn-ghost mb-4">
        ← 목록으로 돌아가기
      </button>
      <div className="flex flex-col md:flex-row gap-8 bg-base-100 shadow-lg rounded-lg p-6">
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="rounded-xl max-h-96 object-contain"
            style={{ maxWidth: 400, width: "100%" }}
          />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-gray-500 mb-4">{product.category}</div>
            <div className="text-xl font-bold text-primary mb-4">
              ₩{new Intl.NumberFormat("ko-KR").format(product.price)}
            </div>
            <div className="mb-4">
              <span className="font-semibold">재고:</span> {product.stock}개
            </div>
            <div className="prose max-w-none mb-6">
              <p>{product.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <label className="font-semibold">수량:</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              className="input input-bordered w-20"
              disabled={product.stock === 0}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  추가 중...
                </>
              ) : product.stock === 0 ? (
                "품절"
              ) : (
                "장바구니에 추가"
              )}
            </button>
          </div>
          {cartMessage && (
            <div className={`mt-4 text-sm ${cartMessage.includes('오류') ? 'text-red-600' : 'text-green-600'}`}>
              {cartMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
