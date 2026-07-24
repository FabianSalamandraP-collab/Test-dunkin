"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { createClient } from "@/utils/supabase/client";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="quizSecondary"
      size="quizPill"
      className="bg-white/80 h-11 gap-2 border-[#E8D8CC] text-[#5A463C]"
      onClick={async () => {
        const supabase = createClient();

        if (!supabase) {
          router.push("/admin/login");
          return;
        }

        setIsLoading(true);
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      disabled={isLoading}
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Saliendo..." : "Salir"}
    </Button>
  );
}
