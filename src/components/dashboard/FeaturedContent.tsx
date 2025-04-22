
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TipCard } from "./TipCard";
import { Lightbulb } from "lucide-react";

export const FeaturedContent = () => {
  const tipsData = [
    {
      id: 1,
      title: "Quick Commands",
      description: "Use the command palette (Cmd/Ctrl + K) to quickly access any feature",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Chain Management",
      description: "Switch between networks seamlessly using the chain selector",
      icon: <Lightbulb className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Transaction History",
      description: "View and track all your cross-chain transactions in one place",
      icon: <Lightbulb className="h-5 w-5" />,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
