import MainHeader from "@/components/main-header";
import { AppSidebar } from "@/components/main/app-sidebar";
// import { ModeToggle } from "@/components/mode-toggle";
import ProtectedRoute from "@/components/protected-route";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <MainHeader />
            <main className="flex-1 overflow-y-auto"> {children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    </div>
  );
}
