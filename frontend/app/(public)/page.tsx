"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const response = await api.post("/api/auth/sync-user", {
        id: user.id,
        email: user.email,
        name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name,
      });

      const role = response.data.role;

      if (role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    };

    syncUser();
  }, [router]);

  return <div>Loading...</div>;
}