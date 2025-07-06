import { supabase } from "../libs/supabase";

/**
 * 특정 게시글의 댓글 목록을 가져옵니다.
 * @param {number} postId - 게시글 ID
 * @returns {Promise<Array>} 댓글 목록
 */
export const fetchComments = async (postId) => {
  try {
    // 먼저 댓글 데이터만 가져오기
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsError) throw commentsError;

    if (!comments || comments.length === 0) {
      return [];
    }

    // 사용자 정보를 별도로 가져오기 (auth.users 사용)
    const userIds = [...new Set(comments.map(comment => comment.user_id))];
    const { data: users, error: usersError } = await supabase
      .from("auth.users")
      .select("id, email")
      .in("id", userIds);

    if (usersError) {
      console.warn("사용자 정보 조회 실패, 기본값 사용:", usersError);
      // 사용자 정보 조회 실패 시 기본값 사용
      return comments.map(comment => ({
        ...comment,
        users: { email: "익명" }
      }));
    }

    // 댓글과 사용자 정보 결합
    return comments.map(comment => ({
      ...comment,
      users: users?.find(user => user.id === comment.user_id) || { email: "익명" }
    }));

  } catch (error) {
    console.error("댓글 조회 중 오류:", error);
    throw new Error(error.message);
  }
};

/**
 * 새로운 댓글을 작성합니다.
 * @param {Object} commentData - 댓글 데이터
 * @param {number} commentData.post_id - 게시글 ID
 * @param {string} commentData.user_id - 사용자 ID
 * @param {string} commentData.content - 댓글 내용
 * @returns {Promise<Object>} 생성된 댓글 정보
 */
export const createComment = async (commentData) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert([commentData])
      .select("id, content, created_at, user_id")
      .single();

    if (error) throw error;

    // 사용자 정보 가져오기 (auth.users 사용)
    const { data: user, error: userError } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", data.user_id)
      .single();

    return {
      ...data,
      users: userError ? { email: "익명" } : (user || { email: "익명" })
    };

  } catch (error) {
    console.error("댓글 작성 중 오류:", error);
    throw new Error(error.message);
  }
};

/**
 * 댓글을 수정합니다.
 * @param {number} commentId - 댓글 ID
 * @param {string} content - 수정할 댓글 내용
 * @returns {Promise<Object>} 수정된 댓글 정보
 */
export const updateComment = async (commentId, content) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .update({ content })
      .eq("id", commentId)
      .select("id, content, created_at, user_id")
      .single();

    if (error) throw error;

    // 사용자 정보 가져오기
    const { data: user } = await supabase
      .from("auth.users")
      .select("email")
      .eq("id", data.user_id)
      .single();

    return {
      ...data,
      users: user || { email: "익명" }
    };

  } catch (error) {
    console.error("댓글 수정 중 오류:", error);
    throw new Error(error.message);
  }
};

/**
 * 댓글을 삭제합니다.
 * @param {number} commentId - 댓글 ID
 * @returns {Promise<void>}
 */
export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * 사용자가 작성한 댓글인지 확인합니다.
 * @param {number} commentId - 댓글 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<boolean>} 작성자 여부
 */
export const isCommentAuthor = async (commentId, userId) => {
  const { data, error } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", commentId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.user_id === userId;
};
