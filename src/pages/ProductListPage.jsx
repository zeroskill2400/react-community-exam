import { useEffect, useState } from "react";
import { getProducts } from "../apis/productApi";
import useCartStore from "../stores/cartStore";
import { useUserStore } from "../stores/userStore";
import { useLocation, useNavigate } from "react-router-dom";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (product) => {
    if (user) {
      addToCart(product);
      alert(`${product.name}을(를) 장바구니에 담았습니다.`);
    } else {
      alert("로그인이 필요합니다.");
      // 로그인 페이지로 이동하면서, 현재 위치와 담으려던 상품 정보를 state로 전달합니다.
      navigate("/login", { state: { from: location, productToAdd: product } });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // You can add error handling UI here
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">상품 목록</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={product.image_url}
                alt={product.name}
                className="h-56 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description}</p>
              <div className="card-actions justify-end items-center mt-2">
                <span className="text-lg font-semibold">
                  {product.price.toLocaleString()}원
                </span>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  장바구니에 담기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListPage;
