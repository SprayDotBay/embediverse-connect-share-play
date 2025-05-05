
import React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Code, 
  Database, 
  Settings, 
  Users, 
  FileCode, 
  MonitorIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

// Sidebar items configuration
const mainMenuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Devices",
    path: "/devices",
    icon: MonitorIcon,
  },
  {
    title: "Projects",
    path: "/projects",
    icon: FileCode,
  },
  {
    title: "Code Editor",
    path: "/editor",
    icon: Code,
  },
  {
    title: "Data Visualization",
    path: "/data",
    icon: Database,
  },
  {
    title: "Community",
    path: "/community",
    icon: Users,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <div className="h-16 flex items-center px-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
            <div className="w-4 h-4 border-2 border-current rounded-sm"></div>
          </div>
          <h1 className="text-lg font-bold">Embediverse</h1>
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t flex items-center justify-between">
        <Button variant="outline" size="sm">
          Need Help?
        </Button>
        <ThemeToggle />
      </div>
    </Sidebar>
  );
}
