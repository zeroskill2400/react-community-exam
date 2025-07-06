import { supabase } from "../libs/supabase";

export const fetchPosts = async (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;

  const { data, count, error } = await supabase
    .from("posts")
    .select(
      `
      id, title, content, created_at,
      users(email)
    `
    )
    .order("id", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  return {
    posts: data ?? [],
    totalCount: count ?? 0,
  };
};

export const postPosts = async (newPost) => {
  const { title, content, userId } = newPost;
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
