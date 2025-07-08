import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

// 1. 모듈을 통째로 모킹합니다.
// 이렇게 하면 supabase와 그 안의 모든 함수가 자동으로 가짜 함수(vi.fn())로 대체됩니다.
vi.mock("../../src/libs/supabase");

// navigate 가짜 함수를 모킹 스코프 외부에 선언
const navigateMock = vi.fn();

// react-router-dom의 useNavigate도 모킹합니다.
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // useNavigate가 항상 위에서 선언된 navigateMock을 반환하도록 수정
    useNavigate: () => navigateMock,
  };
});

// 모킹 후에 테스트 대상과 모킹된 모듈을 가져옵니다.
import { supabase } from "../../src/libs/supabase";
import LoginPage from "../../src/pages/LoginPage";
import { useUserStore } from "../../src/stores/userStore";

describe("LoginPage 통합 테스트", () => {
  // 각 테스트가 실행되기 전에 모든 모의(mock) 상태를 초기화합니다.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("올바른 자격 증명을 입력하면 setUser가 호출되고 홈으로 이동해야 합니다.", async () => {
    const testUser = { id: "1", email: "test@test.com" };
    const setUserSpy = vi.spyOn(useUserStore.getState(), "setUser");

    // 이 테스트 케이스에 한해 signInWithPassword가 어떤 값을 반환할지 설정합니다.
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: testUser },
      error: null,
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // 사용자 입력 시뮬레이션
    await userEvent.type(screen.getByLabelText(/이메일/i), testUser.email);
    await userEvent.type(screen.getByLabelText(/비밀번호/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /로그인/i }));

    // 비동기 작업이 완료되고 DOM이 업데이트될 때까지 기다립니다.
    await waitFor(() => {
      // signInWithPassword가 올바른 인자와 함께 한 번 호출되었는지 확인
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: testUser.email,
        password: "password123",
      });

      // userStore의 setUser가 올바른 유저 정보와 함께 호출되었는지 확인
      expect(setUserSpy).toHaveBeenCalledWith(testUser);
      // navigate가 '/' 경로로 호출되었는지 확인
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("잘못된 자격 증명을 입력하면 에러 메시지가 표시되어야 합니다.", async () => {
    const errorMessage = "Invalid login credentials";
    // 이번에는 로그인 실패 시나리오를 설정합니다.
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });
    const setUserSpy = vi.spyOn(useUserStore.getState(), "setUser");

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/이메일/i), "wrong@test.com");
    await userEvent.type(screen.getByLabelText(/비밀번호/i), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /로그인/i }));

    await waitFor(() => {
      // "로그인 실패" 텍스트가 화면에 표시되는지 확인
      expect(screen.getByText("로그인 실패")).toBeInTheDocument();
    });

    // setUser나 navigate는 호출되지 않았는지 확인
    expect(setUserSpy).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
