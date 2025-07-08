import { useState, useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { supabase } from "../libs/supabase";

function ProfilePage() {
  const user = useUserStore((state) => state.user);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setNickname(data.nickname || "");
        }
      } catch (error) {
        setError("프로필 정보를 가져오는 데 실패했습니다.");
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!user) {
      setError("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ nickname })
        .eq("id", user.id);

      if (error) {
        throw error;
      }
      setSuccess("프로필이 성공적으로 업데이트되었습니다!");
    } catch (error) {
      setError("프로필 업데이트에 실패했습니다.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p>프로필을 보려면 먼저 로그인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">프로필 정보</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p className="mb-4">
            <strong>이메일:</strong> {user.email}
          </p>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-control">
              <label className="label" htmlFor="nickname">
                <span className="label-text">닉네임</span>
              </label>
              <input
                id="nickname"
                type="text"
                className="input input-bordered"
                placeholder="사용할 닉네임을 입력하세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {success && (
              <p className="text-green-500 text-sm mt-2">{success}</p>
            )}
            <div className="form-control mt-6">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="loading loading-spinner" />
                ) : (
                  "프로필 업데이트"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
