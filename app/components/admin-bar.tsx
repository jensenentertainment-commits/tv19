import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/ny", label: "Ny artikkel" },
  { href: "/admin/artikler", label: "Artikler" },
  { href: "/admin/annonser", label: "Annonser" },
  { href: "/admin/kategorier", label: "Kategorier" },
  { href: "/admin/tfb", label: "TFB" },
  { href: "/admin/tips", label: "Tips" }
];

export default function AdminBar() {
  return (
    <div className="border-b-4 border-black bg-[rgb(var(--brand))] text-white">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3 px-4 py-3">
        <div className="mr-4 font-black tracking-tight">
          TV<span className="text-[rgb(var(--accent))]">19</span> Admin//Redaksjonssystem
        </div>

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-white/10 px-3 py-2 text-sm font-black text-white no-underline hover:bg-white hover:text-black"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}