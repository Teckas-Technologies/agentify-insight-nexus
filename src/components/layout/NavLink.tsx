
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={cn(
        "text-sm font-medium transition-colors flex items-center gap-1.5",
        isActive 
          ? "text-white" 
          : "text-muted-foreground hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
};

export default NavLink;
