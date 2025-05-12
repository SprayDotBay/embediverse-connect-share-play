
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { ProjectGallery } from "@/components/community/ProjectGallery";
import { Challenges } from "@/components/community/Challenges";
import { Leaderboard } from "@/components/community/Leaderboard";
import { EspUIDemo } from "@/components/community/EspUIDemo";

const Community = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Community
          </h1>
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
            <CommunityFeed />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectGallery />
          </TabsContent>
          
          <TabsContent value="challenges">
            <Challenges />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Leaderboard />
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
