
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipCard } from "./TipCard";
import { 
  Command, 
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

export const FeaturedContent = () => {
  const tipsData = [
    {
      id: 1,
      title: "Smart Command Palette",
      description: "Use Cmd/Ctrl + K to quickly access any feature or navigate between pages",
      icon: <Command className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Performance Tracking",
      description: "Monitor your cross-chain activity and gas optimization in real-time",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Custom Dashboard",
      description: "Customize your view and pin frequently used commands for quick access",
      icon: <LayoutDashboard className="h-5 w-5" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6">
      {tipsData.map((tip) => (
        <TipCard
          key={tip.id}
          title={tip.title}
          description={tip.description}
          icon={tip.icon}
        />
      ))}
    </div>
  );
};
