export const fetchPosts = async (page = 1, limit = 20) => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase 환경 변수를 설정해주세요. (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
    );
  }

  const offset = (page - 1) * limit;
  const requestUrl = `${SUPABASE_URL}/rest/v1/posts?select=*&order=id.desc&limit=${limit}&offset=${offset}`;

  const response = await fetch(requestUrl, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "count=exact",
    },
  });

  if (!response.ok) {
    throw new Error("네트워크 응답이 올바르지 않습니다.");
  }

  const contentRange = response.headers.get("Content-Range");

  const totalCount = contentRange
    ? parseInt(contentRange.split("/")[1], 10)
    : 0;

  const data = await response.json();

  return {
    posts: data,
    totalCount,
  };
};
