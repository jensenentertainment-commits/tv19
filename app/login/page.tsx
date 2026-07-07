// app/login/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      redirect("/login?error=1");
    }

    redirect("/admin");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-black">TV19 admin</h1>

      <form action={login} className="mt-8 space-y-4">
        <input
          name="email"
          type="email"
          placeholder="E-post"
          required
          className="w-full border p-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Passord"
          required
          className="w-full border p-3"
        />

        <button className="w-full bg-black px-4 py-3 font-black text-white">
          Logg inn
        </button>
      </form>
    </main>
  );
}