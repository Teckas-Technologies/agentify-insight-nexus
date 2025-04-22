
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
    gradient: "from-violet-500/10 to-fuchsia-500/10"
  },
  {
    id: "bridge",
    name: "Bridge Assistant",
    description: "Bridge tokens between networks",
    icon: Layers,
    gradient: "from-cyan-500/10 to-blue-500/10"
  },
  {
    id: "lend",
    name: "Lend & Borrow Assistant",
    description: "Manage lending positions",
    icon: Zap,
    gradient: "from-amber-500/10 to-orange-500/10"
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
    <Command className="rounded-lg border-0 bg-transparent">
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
                "flex items-start gap-3 p-4 cursor-pointer transition-all duration-200 hover:bg-primary/5",
                selectedAgent === agent.id && "bg-gradient-to-r border border-primary/20",
                agent.gradient
              )}
            >
              <div className="mt-1 p-2 rounded-lg bg-white/5 ring-1 ring-white/10">
                <agent.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.description}</p>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default AgentSelector;
