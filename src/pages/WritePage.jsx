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
  const onSubmit = async (data) => {
    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 폼 데이터를 JSON 문자열로 변환하여 body에 담아 전송
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("서버에서 게시물 생성에 실패했습니다.");
      }

      // 요청이 성공적으로 완료된 후, 목록 페이지로 이동
      navigate("/posts");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다...");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">새 게시물 작성</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label" htmlFor="title">
            <span className="label-text">제목</span>
          </label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            className="input input-bordered w-full"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="author">
            <span className="label-text">작성자</span>
          </label>
          <input
            id="author"
            type="text"
            placeholder="이름을 입력하세요"
            className="input input-bordered w-full"
            {...register("author")}
          />
          {errors.author && (
            <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>
          )}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="content">
            <span className="label-text">내용</span>
          </label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            className="textarea textarea-bordered h-48 w-full"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              제출 중...
            </>
          ) : (
            "제출하기"
          )}
        </button>
      </form>
    </div>
  );
}

export default WritePage;
