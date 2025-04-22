
export interface AgentData {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
  tags: string[];
  gradient: string;
  supportedChains: string[];
  sampleCommands: string[];
  securityNotes: string;
  permissions: string[];
}

export interface AgentCategory {
  id: string;
  name: string;
}
