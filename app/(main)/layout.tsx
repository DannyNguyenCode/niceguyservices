import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import SkipLink from "@/components/SkipLink";

export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <Navigation />
      <main id="content-container" className="min-w-0 overflow-x-clip" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
