"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavMain {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    description: string;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}

export function NavMain({ items }: NavMain) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <div
                key={item.title}
                className={cn(
                  "h-fit p-2 group rounded-md relative",
                  isActive ? "bg-green-500 text-white" : "hover:bg-green-100"
                )}
              >
                <Link href={item.url} className="flex items-center gap-1.5">
                  {item.icon && <item.icon className="w-5" />}
                  <div
                    className={cn("flex flex-col", isActive && "text-white")}
                  >
                    <span className="text-base font-medium">{item.title}</span>
                    <span className="text-xs">{item.description}</span>
                  </div>
                </Link>
                {isActive && (
                  <div className="size-1.5 bg-white absolute rounded-full right-1 top-3 animate-pulse" />
                )}
              </div>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
