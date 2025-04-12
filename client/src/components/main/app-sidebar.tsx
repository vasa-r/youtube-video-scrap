"use client";

import * as React from "react";
import { Film, History, User2, Video } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

const data = {
  navMain: [
    {
      title: "New Video",
      description: "Upload new video to be processed",
      url: "/dashboard/create",
      icon: Video,
    },
    {
      title: "My Videos",
      description: "Your uploaded videos",
      url: "/dashboard/videos",
      icon: Film,
    },
    {
      title: "History",
      description: "Your video processing history",
      url: "/dashboard/history",
      icon: History,
    },
    {
      title: "Profile",
      description: "Manage your account settings",
      url: "/profile",
      icon: User2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      {...props}
      className="h-screen overflow-hidden"
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
