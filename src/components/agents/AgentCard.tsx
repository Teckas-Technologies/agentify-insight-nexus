
import { useState } from "react";
import { ArrowRight, ShieldCheck, Key, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { AgentData } from "@/types/agent";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Dynamic icon component
const DynamicIcon = ({ name }: { name: string }) => {
  // This is a simple implementation that works for our specific icons
  // In a real app, you might want to use a more robust solution
  const icons = {
    ArrowLeftRight: () => (
      <div className="p-3 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-violet-400"
        >
          <path d="M18 8L22 12L18 16" />
          <path d="M6 12H22" />
          <path d="M6 16L2 12L6 8" />
          <path d="M2 12H18" />
        </svg>
      </div>
    ),
    Layers: () => (
      <div className="p-3 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-cyan-400"
        >
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 12.5-8.58 3.9a2 2 0 0 1-1.66 0L2.6 12.5" />
          <path d="m22 17.5-8.58 3.9a2 2 0 0 1-1.66 0L2.6 17.5" />
        </svg>
      </div>
    ),
    Zap: () => (
      <div className="p-3 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-amber-400"
        >
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    ),
    Star: () => (
      <div className="p-3 rounded-xl bg-green-500/10 ring-1 ring-green-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-green-400"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
    ),
    LineChart: () => (
      <div className="p-3 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-purple-400"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </div>
    ),
    Image: () => (
      <div className="p-3 rounded-xl bg-pink-500/10 ring-1 ring-pink-500/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-pink-400"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    ),
  };

  const IconComponent = icons[name as keyof typeof icons];
  return IconComponent ? <IconComponent /> : <div className="w-12 h-12 bg-muted rounded-full" />;
};

interface AgentCardProps {
  agent: AgentData;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleLaunchAgent = () => {
    navigate(`/playground?agent=${agent.id}`);
  };

  return (
    <div 
      className={cn(
        "group rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5",
        "neumorphic-sm border-none bg-gradient-to-br from-background/90 to-background",
        agent.gradient
      )}
    >
      <div className="flex gap-4 items-start mb-4">
        <DynamicIcon name={agent.icon} />
        <div>
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{agent.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 mb-4">
        {agent.tags.map(tag => (
          <Badge 
            key={tag} 
            variant="outline" 
            className="bg-white/5 text-xs border-white/10 hover:bg-white/10 transition-colors"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <Accordion type="single" collapsible className="border-t border-white/5 pt-4">
        <AccordionItem value="details" className="border-b-0">
          <AccordionTrigger 
            onClick={() => setExpanded(!expanded)}
            className="py-2 hover:no-underline"
          >
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-white transition-colors">
              <Info className="h-4 w-4" /> More details
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-white/90">Supported Chains</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.supportedChains.map(chain => (
                    <Badge 
                      key={chain} 
                      className="bg-secondary text-white/90 hover:bg-secondary/80"
                    >
                      {chain}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-white/90">Sample Commands</h4>
                <ul className="space-y-2">
                  {agent.sampleCommands.map((command, idx) => (
                    <li key={idx} className="text-muted-foreground bg-black/20 px-3 py-2 rounded-md font-mono text-xs">
                      {command}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1.5 text-white/90">
                  <ShieldCheck className="h-4 w-4 text-green-400" /> 
                  Security Notes
                </h4>
                <p className="text-muted-foreground text-sm">
                  {agent.securityNotes}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-1.5 text-white/90">
                  <Key className="h-4 w-4 text-amber-400" /> 
                  Required Permissions
                </h4>
                <ul className="space-y-1">
                  {agent.permissions.map((permission, idx) => (
                    <li key={idx} className="text-muted-foreground text-sm flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        onClick={handleLaunchAgent}
        className="w-full mt-4 bg-primary/10 hover:bg-primary/20 text-white border border-primary/20 hover:border-primary/30"
      >
        Launch Agent
        <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default AgentCard;
