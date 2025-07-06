import { supabase } from "../libs/supabase";

/**
 * 사용자 프로필 정보 업데이트
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  if (error) throw error;
  return data;
};

/**
 * 사용자 비밀번호 변경
 */
export const updateUserPassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
  return data;
};

/**
 * 사용자 이메일 변경
 */
export const updateUserEmail = async (newEmail) => {
  const { data, error } = await supabase.auth.updateUser({
    email: newEmail,
  });
  if (error) throw error;
  return data;
};

/**
 * 사용자 계정 삭제
 */
export const deleteUserAccount = async () => {
  const { error } = await supabase.auth.admin.deleteUser(
    (
      await supabase.auth.getUser()
    ).data.user.id
  );

  if (error) throw error;
};

/**
 * 사용자 프로필 정보 조회
 */
export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * 사용자 주문 내역 조회 (향후 주문 시스템 구현 시 사용)
 */
export const fetchUserOrders = async (userId) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id, total_amount, status, created_at,
      order_items (
        quantity,
        products (
          name, price, image_url
        )
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};
