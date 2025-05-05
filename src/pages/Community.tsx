
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ThumbsUp, MessageCircle, Award, Code, Share2 } from "lucide-react";
import { ProjectGallery } from "@/components/community/ProjectGallery";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { Leaderboard } from "@/components/community/Leaderboard";
import { Challenges } from "@/components/community/Challenges";

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search community..." 
                className="pl-8 w-[250px]" 
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button>Share Project</Button>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="gallery">Project Gallery</TabsTrigger>
            <TabsTrigger value="feed">Community Feed</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <ProjectGallery searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="feed">
            <CommunityFeed searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <Leaderboard searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="challenges">
            <Challenges searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
