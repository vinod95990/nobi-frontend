"use client";

import { useRouter } from "next/navigation";
import AuthService from "../services/auth";
import { useEffect } from "react";

export default function AccessAuthPage({ children }) {
  const router = useRouter();
  useEffect(() => {
    async function me() {
      const { data, error } = await AuthService.me();
      if (error) {
        return;
      }

      if (data) {
        router.push("/");
      }
    }

    me();
  }, []);

  return children;
}
