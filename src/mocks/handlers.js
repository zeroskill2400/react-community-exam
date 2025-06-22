// src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import { posts } from "./data"; // 데이터 파일에서 posts를 가져옵니다.

// 2. API 요청을 처리할 핸들러를 정의합니다.
export const handlers = [
  // /posts 경로로 GET 요청이 오면...
  http.get("/posts", () => {
    // ...import 해온 posts 배열을 JSON 형태로 반환합니다.
    return HttpResponse.json(posts);
  }),
];
