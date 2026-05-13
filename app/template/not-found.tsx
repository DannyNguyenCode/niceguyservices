import Link from "next/link";

export default function TemplateNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#070708] px-6 text-center text-zinc-100">
      <h1 className="text-2xl font-bold text-white">Template not found</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        That experience template does not exist or was removed.
      </p>
      <Link
        href="/template"
        className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition-opacity hover:opacity-90"
      >
        Back to template gallery
      </Link>
      <Link href="/" className="mt-4 text-sm text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline">
        Nice Guy Web Design home
      </Link>
    </div>
  );
}
