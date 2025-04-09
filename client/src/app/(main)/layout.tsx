import MainHeader from "@/components/main-header";
import { AppSidebar } from "@/components/main/app-sidebar";
// import { ModeToggle } from "@/components/mode-toggle";
// import ProtectedRoute from "@/components/protected-route/protected-route";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    // <ProtectedRoute>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <MainHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
    // </ProtectedRoute>
  );
}
