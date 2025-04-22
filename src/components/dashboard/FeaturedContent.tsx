
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChainBadge } from "./ChainBadge";
import { TrendingUp, ArrowRight, Globe } from "lucide-react";

export const FeaturedContent = () => {
  // Sample trending chains data
  const trendingChains = [
    { name: "Base", count: 52, trend: "+18%" },
    { name: "Optimism", count: 37, trend: "+12%" },
    { name: "Arbitrum", count: 58, trend: "+8%" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Trending Chains Card */}
      <Card className="neumorphic border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Chains
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingChains.map((chain) => (
              <div key={chain.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ChainBadge name={chain.name} count={chain.count} />
                </div>
                <span className="text-sm font-medium text-success">{chain.trend}</span>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
              View All Chain Analytics
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Network Status Card */}
      <Card className="neumorphic border-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Network status items */}
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium">Ethereum</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                <span className="text-xs">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium">Arbitrum</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                <span className="text-xs">Healthy</span>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border/30">
              <span className="text-sm font-medium">Optimism</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-warning"></span>
                <span className="text-xs">Congested</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Polygon</span>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                <span className="text-xs">Healthy</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
              View Network Details
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
