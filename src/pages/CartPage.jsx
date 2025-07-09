import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { useCartStore } from "../stores/cartStore";
import {
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../apis/cartApi";

function CartPage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const { 
    cartItems, 
    cartItemCount, 
    isLoading, 
    error,
    loadCartItems,
    updateCartItemQuantity: updateCartItemQuantityStore,
    removeFromCart: removeFromCartStore,
    clearCart: clearCartStore
  } = useCartStore();

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
  }, [user, navigate]);

  // 장바구니 데이터 로드
  useEffect(() => {
    if (!user) return;
    loadCartItems(user.id);
  }, [user, loadCartItems]);

  // 수량 변경
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItemQuantity(cartItemId, newQuantity);
      updateCartItemQuantityStore(cartItemId, newQuantity);
    } catch (err) {
      alert("수량 변경 중 오류가 발생했습니다.");
    }
  };

  // 장바구니에서 삭제
  const handleRemoveItem = async (cartItemId) => {
    if (!confirm("이 상품을 장바구니에서 삭제하시겠습니까?")) return;
    
    try {
      await removeFromCart(cartItemId);
      removeFromCartStore(cartItemId);
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 장바구니 전체 비우기
  const handleClearCart = async () => {
    if (!confirm("장바구니를 모두 비우시겠습니까?")) return;
    
    try {
      await clearCart(user.id);
      clearCartStore();
    } catch (err) {
      alert("장바구니 비우기 중 오류가 발생했습니다.");
    }
  };

  // 총 금액 계산
  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + (item.products.price * item.quantity);
  }, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <span className="loading loading-spinner loading-lg"></span>
        <span className="ml-2">장바구니를 불러오는 중...</span>
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

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2">장바구니</h1>
        <p className="text-gray-500">
          총 {cartItemCount}개 상품 • ₩{new Intl.NumberFormat("ko-KR").format(totalAmount)}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-gray-500 mb-6">상품을 추가해보세요!</p>
          <button 
            onClick={() => navigate("/products")}
            className="btn btn-primary"
          >
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 장바구니 아이템 목록 */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    {/* 상품 이미지 */}
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    {/* 상품 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {item.products.name}
                      </h3>
                      <p className="text-primary font-bold">
                        ₩{new Intl.NumberFormat("ko-KR").format(item.products.price)}
                      </p>
                      <p className="text-sm text-gray-500">
                        재고: {item.products.stock}개
                      </p>
                    </div>

                    {/* 수량 조절 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="btn btn-circle btn-sm"
                      >
                        -
                      </button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.products.stock}
                        className="btn btn-circle btn-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* 개별 금액 */}
                    <div className="text-right">
                      <p className="font-bold">
                        ₩{new Intl.NumberFormat("ko-KR").format(item.products.price * item.quantity)}
                      </p>
                    </div>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="btn btn-ghost btn-sm text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 장바구니 요약 */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">주문 요약</h3>
                <button
                  onClick={handleClearCart}
                  className="btn btn-outline btn-sm text-red-500"
                >
                  장바구니 비우기
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>상품 개수:</span>
                  <span>{cartItemCount}개</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>총 금액:</span>
                  <span className="text-primary">
                    ₩{new Intl.NumberFormat("ko-KR").format(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  onClick={() => navigate("/products")}
                  className="btn btn-outline"
                >
                  쇼핑 계속하기
                </button>
                <button
                  onClick={() => alert("주문 기능은 추후 구현 예정입니다.")}
                  className="btn btn-primary"
                >
                  주문하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
