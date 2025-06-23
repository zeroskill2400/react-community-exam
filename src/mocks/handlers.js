// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { posts as allPosts } from "./data"; // 100개의 게시물 데이터

// 2. API 요청을 처리할 핸들러를 정의합니다.
export const handlers = [
  // /posts 경로로 GET 요청이 오면...
  http.get("/posts", ({ request }) => {
    // 1. 요청 URL에서 page와 limit 파라미터를 가져옵니다.
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("_page") || "1", 10);
    const limit = parseInt(url.searchParams.get("_limit") || "20", 10);

    // 2. 데이터를 역순으로 정렬합니다. (최신글이 위로)
    const reversedPosts = [...allPosts].reverse();

    // 3. 파라미터에 맞게 정렬된 데이터에서 일부를 잘라냅니다.
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = reversedPosts.slice(startIndex, endIndex);

    // 4. 잘라낸 데이터와 함께, 전체 아이템 개수를 헤더에 담아 응답합니다.
    return HttpResponse.json(paginatedPosts, {
      headers: {
        "X-Total-Count": allPosts.length.toString(),
      },
    });
  }),
  // 게시물 생성 핸들러
  http.post("/posts", async ({ request }) => {
    const { title, author, content } = await request.json();
    const newPost = {
      id: allPosts.length + 1,
      title,
      author,
      content,
      // 새 게시물 생성 시 현재 날짜를 'YYYY-MM-DD' 형식으로 추가
      createdAt: new Date().toISOString().split("T")[0],
    };

    allPosts.push(newPost);

    // 성공 응답으로 생성된 게시물 데이터를 반환 (201: Created)
    return HttpResponse.json(newPost, { status: 201 });
  }),
];
