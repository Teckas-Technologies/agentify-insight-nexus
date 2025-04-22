
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ArrowLeftRight, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Agent = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
};

const agents: Agent[] = [
  {
    id: "swap",
    name: "Swap Assistant",
    description: "Execute token swaps across any DEX",
    icon: ArrowLeftRight,
    gradient: "from-violet-500/20 via-fuchsia-500/20 to-violet-500/20"
  },
  {
    id: "bridge",
    name: "Bridge Assistant",
    description: "Bridge tokens between networks",
    icon: Layers,
    gradient: "from-cyan-500/20 via-blue-500/20 to-cyan-500/20"
  },
  {
    id: "lend",
    name: "Lend & Borrow Assistant",
    description: "Manage lending positions",
    icon: Zap,
    gradient: "from-amber-500/20 via-orange-500/20 to-amber-500/20"
  }
];

export const AgentSelector = ({
  selectedAgent,
  onSelectAgent
}: {
  selectedAgent: string;
  onSelectAgent: (id: string) => void;
}) => {
  const [search, setSearch] = useState("");

  return (
    <Command className="rounded-xl border-0 bg-background/50 backdrop-blur-xl">
      <CommandInput 
        placeholder="Search agents..." 
        value={search}
        onValueChange={setSearch}
        className="border-b border-white/10 bg-background/50"
      />
      <CommandList>
        <CommandEmpty>No agents found.</CommandEmpty>
        <CommandGroup>
          {agents.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => onSelectAgent(agent.id)}
              className={cn(
                "group flex items-start gap-4 p-4 cursor-pointer transition-all duration-300",
                "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                selectedAgent === agent.id && "bg-gradient-to-r border border-primary/20",
                agent.gradient
              )}
            >
              <div className="mt-1 p-3 rounded-xl bg-white/5 ring-1 ring-white/10 
                            transition-all duration-300 group-hover:ring-primary/20 
                            group-hover:bg-white/10">
                <agent.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-medium text-gradient">{agent.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{agent.description}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AgentSelector;
