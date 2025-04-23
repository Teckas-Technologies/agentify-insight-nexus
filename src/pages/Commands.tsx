
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedCommand } from "@/components/dashboard/SavedCommand";
import { PlayCircle } from "lucide-react";
import { savedCommandsData } from "@/data/commands";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const CommandsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Saved Commands</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>

        {/* Commands List */}
        <Card className="neumorphic border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">All Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedCommandsData.map((command) => (
                <SavedCommand
                  key={command.id}
                  title={command.title}
                  command={command.command}
                  icon={<PlayCircle className="h-4 w-4" />}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default CommandsPage;
