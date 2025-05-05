
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface CommunityFeedProps {
  searchTerm: string;
}

// Mock feed data
const feedData = [
  {
    id: 1,
    author: {
      name: "John Maker",
      username: "johnmaker",
      avatar: "https://placehold.co/300/172554/f8fafc?text=JM"
    },
    content: "Just finished my new ESP32 project! This IoT weather station monitors temperature, humidity, and air quality in real-time. Data is displayed on an OLED screen and sent to a custom web dashboard. Check it out!",
    image: "https://placehold.co/600x400/172554/f8fafc?text=Weather+Station",
    likes: 42,
    comments: 8,
    time: "2 hours ago",
    tags: ["ESP32", "IoT", "Weather"]
  },
  {
    id: 2,
    author: {
      name: "Sarah Tech",
      username: "sarahtech",
      avatar: "https://placehold.co/300/1e40af/f8fafc?text=ST"
    },
    content: "Need help with my Arduino RGB LED matrix project. I'm trying to implement a smooth color transition effect but getting flickering. Anyone experienced with PWM and FastLED library?",
    image: null,
    likes: 15,
    comments: 23,
    time: "5 hours ago",
    tags: ["Arduino", "LEDs", "Help"]
  },
  {
    id: 3,
    author: {
      name: "Maker Community",
      username: "makercommunity",
      avatar: "https://placehold.co/300/0d9488/f8fafc?text=MC"
    },
    content: "We're excited to announce our monthly robotics challenge! Build a line-following robot using Arduino or ESP32. Submit your project by the end of the month for a chance to win an electronics kit!",
    image: "https://placehold.co/600x400/0d9488/f8fafc?text=Robotics+Challenge",
    likes: 87,
    comments: 34,
    time: "1 day ago",
    tags: ["Challenge", "Robotics", "Contest"]
  },
  {
    id: 4,
    author: {
      name: "Alex Engineer",
      username: "alexengineer",
      avatar: "https://placehold.co/300/172554/f8fafc?text=AE"
    },
    content: "Just released a new Arduino library for simplifying GPIO management on ESP32 boards. It includes pin state monitoring, automatic debouncing, and event callbacks. Feel free to try it out and provide feedback!",
    image: null,
    likes: 56,
    comments: 12,
    time: "2 days ago",
    tags: ["Library", "ESP32", "Arduino"]
  }
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ searchTerm }) => {
  // Filter feed posts based on search term
  const filteredPosts = feedData.filter(post => 
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {filteredPosts.map(post => (
        <Card key={post.id}>
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="font-medium">{post.author.name}</div>
              <div className="text-sm text-muted-foreground">@{post.author.username} · {post.time}</div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line mb-4">{post.content}</p>
            {post.image && (
              <div className="rounded-md overflow-hidden mb-3">
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
            </div>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
