"use client";

import { supabase } from "@/lib/supabase";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
      <button
        onClick={handleGoogleLogin}
        className="border px-4 py-2 rounded"
      >
        Continue with Google
      </button>

      <button
        onClick={handleGithubLogin}
        className="border px-4 py-2 rounded"
      >
        Continue with GitHub
      </button>
    </div>
  );
};

export default LoginPage;