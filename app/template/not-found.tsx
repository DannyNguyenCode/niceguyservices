export default function TemplateNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#070708] px-6 text-center text-zinc-100">
      <h1 className="text-2xl font-bold text-white">Template not found</h1>
      <p className="mt-3 max-w-md text-zinc-400">
        That experience template does not exist or was removed.
      </p>
    </div>
  );
}
