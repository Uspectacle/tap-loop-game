"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const target = search ? `/play?${search}` : "/play";
    router.replace(target);
  }, [router, searchParams]);

  return <p>Redirecting to the game...</p>;
}
