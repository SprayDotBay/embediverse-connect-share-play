
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { ProjectGallery } from "@/components/community/ProjectGallery";
import { Challenges } from "@/components/community/Challenges";
import { Leaderboard } from "@/components/community/Leaderboard";
import { EspUIDemo } from "@/components/community/EspUIDemo";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Community
          </h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search community..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Tabs defaultValue="feed">
          <TabsList>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="espui-demo">ESP UI Demo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="feed">
            <CommunityFeed searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectGallery searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="challenges">
            <Challenges searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Leaderboard searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="espui-demo">
            <EspUIDemo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
