
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Swap, Bridge, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Agent = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
};

const agents: Agent[] = [
  {
    id: "swap",
    name: "Swap Assistant",
    description: "Execute token swaps across any DEX",
    icon: Swap
  },
  {
    id: "bridge",
    name: "Bridge Assistant",
    description: "Bridge tokens between networks",
    icon: Bridge
  },
  {
    id: "lend",
    name: "Lend & Borrow Assistant",
    description: "Manage lending positions",
    icon: Layers
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
    <Command className="rounded-lg border-0">
      <CommandInput 
        placeholder="Search agents..." 
        value={search}
        onValueChange={setSearch}
        className="border-b border-white/10"
      />
      <CommandList>
        <CommandEmpty>No agents found.</CommandEmpty>
        <CommandGroup>
          {agents.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => onSelectAgent(agent.id)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer",
                selectedAgent === agent.id && "border border-primary/50 bg-primary/5"
              )}
            >
              <div className="mt-1">
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
