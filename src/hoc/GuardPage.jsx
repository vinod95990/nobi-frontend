"use client";

import { useRouter } from "next/navigation";

export default function GuardPage({ children }) {
  const router = useRouter();
  if (!isAuthenticated) {
    router.push("/guard-gate");
    return <h1 className="text-white">Not allowed</h1>;
  }

  return children;
}
