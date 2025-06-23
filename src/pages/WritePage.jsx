import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// 1. Zod로 유효성 검사 스키마 정의
const postSchema = z.object({
  title: z.string().min(3, "제목은 3글자 이상이어야 합니다."),
  author: z.string().nonempty("작성자 이름을 입력해주세요."),
  content: z.string().min(10, "내용은 10글자 이상이어야 합니다."),
});

function WritePage() {
  const navigate = useNavigate();

  // 2. useForm 훅으로 폼 상태 및 함수 가져오기
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  // 3. 폼 제출 시 실행될 함수 정의 (유효성 검사 통과 후)
  const onSubmit = (data) => {
    console.log("제출된 데이터:", data);
    // 현재는 콘솔에만 출력합니다.
    // 성공적으로 처리 후 목록 페이지로 이동합니다.
    navigate("/posts");
  };

  return (
    <div>
      <h1>새 게시물 작성 (기능만)</h1>

      {/* 4. handleSubmit으로 onSubmit 함수를 감싸서 form에 연결 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            {...register("title")} // 'title' 필드로 등록
            className="border border-black"
          />
          {errors.title && (
            <p style={{ color: "red" }}>{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="author">작성자</label>
          <input
            id="author"
            type="text"
            {...register("author")} // 'author' 필드로 등록
            className="border border-black"
          />
          {errors.author && (
            <p style={{ color: "red" }}>{errors.author.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            {...register("content")} // 'content' 필드로 등록
            className="border border-black"
          />
          {errors.content && (
            <p style={{ color: "red" }}>{errors.content.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-black"
        >
          {isSubmitting ? "제출 중..." : "제출하기"}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
