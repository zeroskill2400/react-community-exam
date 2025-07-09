import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { supabase } from "../libs/supabase";

// 1. Zod로 유효성 검사 스키마 정의
const postSchema = z.object({
  title: z.string().min(3, "제목은 3글자 이상이어야 합니다."),
  content: z.string().min(10, "내용은 10글자 이상이어야 합니다."),
});

function WritePage() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);

  // 로그인하지 않은 사용자는 접근 불가
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(postSchema),
  });

  // Supabase로 게시물 작성
  const onSubmit = async (data) => {
    try {
      const { error } = await supabase.from("posts").insert([
        {
          title: data.title,
          content: data.content,
          user_id: user.id,
        },
      ]);
      if (error) throw error;
      navigate("/posts");
    } catch (error) {
      console.error("게시물 작성 중 에러 발생:", error);
      alert("게시물 작성 중 오류가 발생했습니다.");
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
