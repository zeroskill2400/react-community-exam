import { supabase } from "../libs/supabase";

/**
 * 장바구니에 상품 추가
 */
export const addToCart = async ({ user_id, product_id, quantity }) => {
  // 이미 담긴 상품이면 수량 증가, 아니면 새로 추가
  const { data: existing, error: fetchError } = await supabase
    .from("cart_items")
    .select(`
      id, quantity, created_at,
      products (
        id, name, price, image_url, stock
      )
    `)
    .eq("user_id", user_id)
    .eq("product_id", product_id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  if (existing) {
    // 이미 있으면 수량만 증가
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select(`
        id, quantity, created_at,
        products (
          id, name, price, image_url, stock
        )
      `)
      .single();
    if (error) throw error;
    return data;
  } else {
    // 없으면 새로 추가
    const { data, error } = await supabase
      .from("cart_items")
      .insert([{ user_id, product_id, quantity }])
      .select(`
        id, quantity, created_at,
        products (
          id, name, price, image_url, stock
        )
      `)
      .single();
    if (error) throw error;
    return data;
  }
};

/**
 * 사용자의 장바구니 목록 조회
 */
export const fetchCartItems = async (userId) => {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id, quantity, created_at,
      products (
        id, name, price, image_url, stock
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * 장바구니 아이템 수량 변경
 */
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * 장바구니 아이템 삭제
 */
export const removeFromCart = async (cartItemId) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;
};

/**
 * 장바구니 전체 비우기
 */
export const clearCart = async (userId) => {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (error) throw error;
};
