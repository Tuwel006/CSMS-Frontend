// src/components/layout/Layout.tsx
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LayoutProvider, useLayout } from "./LayoutContext";
import type { ReactNode } from "react";
import { colors } from "../../constants/theme";

const Content = ({ children }: { children: ReactNode }) => {
  const { collapsed } = useLayout();

  return (
    <main
      className={`${colors.bg} min-h-screen pt-16 transition-all duration-300 pl-16`}
      style={{ marginLeft: collapsed ? "4rem" : "16rem" }}
    >
      <div className="p-6">{children}</div>
    </main>
  );
};

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <LayoutProvider>
    <Header />
    <Sidebar />
    <Content>{children}</Content>
  </LayoutProvider>
);

export default AdminLayout;
