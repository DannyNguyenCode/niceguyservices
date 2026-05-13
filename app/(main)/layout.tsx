import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function MainSiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main id="content-container">{children}</main>
      <Footer />
    </>
  );
}
