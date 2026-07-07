import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/logout";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sections = [
    { label: "Forside", href: "/" },
    { label: "Norge", href: "/kategori/norge" },
    { label: "Verden", href: "/kategori/verden" },
    { label: "Økonomi", href: "/kategori/okonomi" },
    { label: "Sport", href: "/kategori/sport" },
    { label: "Kultur", href: "/kategori/kultur" },
    { label: "Samfunn", href: "/kategori/samfunn" },
    { label: "Teknologi", href: "/kategori/teknologi" },
    { label: "Vitenskap", href: "/kategori/vitenskap" },
    { label: "Bekymret", href: "/kategori/bekymret" },
    { label: "Nyhetsarkiv", href: "/nyhetsarkiv" },
  ];

  return (
    <header className="bg-white">
      <div className="bg-[#184f7a] text-white">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-4">
          <Link href="/" className="no-underline">
            <div className="text-6xl font-black leading-none tracking-[-0.08em]">
              <span className="text-white">TV</span>
              <span className="text-[#C62828]">19</span>
            </div>
          </Link>

          <div className="hidden text-xl font-black uppercase tracking-[0.12em] md:block">
            Sist med det første
          </div>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link
                  href="/admin"
                  className="border border-white/30 px-4 py-2 text-sm font-black text-white no-underline transition-all duration-200 hover:bg-white hover:text-[#184f7a]"
                >
                  Admin
                </Link>

                <form action={logout}>
                  <button
                    type="submit"
                    className="border border-white/30 bg-transparent px-4 py-2 text-sm font-black text-white transition-all duration-200 hover:bg-white hover:text-[#184f7a]"
                  >
                    Logg ut
                  </button>
                </form>
              </>
            )}

            <Link
              href="/pluss"
              className="border border-white/20 bg-black px-4 py-2 text-sm font-black text-white no-underline transition-all duration-200 hover:bg-[#C62828]"
            >
              TV 19+
            </Link>
          </div>
        </div>
      </div>

      <nav className="border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-4 py-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="whitespace-nowrap px-3 py-2 text-sm font-black no-underline hover:bg-[rgb(var(--brand))] hover:text-white"
            >
              {section.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}