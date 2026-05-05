import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <div className="fixed top-0 left-0 right-0 z-[60]">
      <AnnouncementBar />
    </div>
    <div className="h-9" />
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default Layout;
