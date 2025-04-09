"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const MainHeader = () => {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <header className="flex border-b border-border h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
      )}
    </>
  );
};

export default MainHeader;
