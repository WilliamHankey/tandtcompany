import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import SEO from "./SEO";
import { OrganizationSchema } from "./JsonLd";
import { getPageMeta } from "@/lib/seo";

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const meta = getPageMeta(location.pathname);

  return (
    <>
      <SEO title={meta.title} description={meta.description} />
      <OrganizationSchema />
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-[60]">
          <AnnouncementBar />
        </div>
        <div className="h-9" />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
