
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface ProjectGalleryProps {
  searchTerm: string;
}

// Mock project data
const projectsData = [
  {
    id: 1,
    title: "ESP32 Weather Station",
    author: "IoTMaster",
    description: "A weather station using ESP32 that measures temperature, humidity, and pressure.",
    image: "https://placehold.co/600x400/172554/f8fafc?text=ESP32+Weather+Station",
    likes: 124,
    comments: 32,
    tags: ["ESP32", "IoT", "Weather"]
  },
  {
    id: 2,
    title: "Arduino Smart Garden",
    author: "GreenThumb",
    description: "Automated garden watering system with soil moisture sensors.",
    image: "https://placehold.co/600x400/1e40af/f8fafc?text=Smart+Garden",
    likes: 98,
    comments: 24,
    tags: ["Arduino", "Automation", "Garden"]
  },
  {
    id: 3,
    title: "LED Matrix Pixel Art Display",
    author: "PixelArtist",
    description: "Programmable LED matrix for displaying pixel art animations.",
    image: "https://placehold.co/600x400/0d9488/f8fafc?text=LED+Matrix",
    likes: 76,
    comments: 18,
    tags: ["LEDs", "Art", "Animation"]
  },
  {
    id: 4,
    title: "Voice-Controlled Home Assistant",
    author: "VoiceGuru",
    description: "ESP32-based voice recognition system for home automation.",
    image: "https://placehold.co/600x400/172554/f8fafc?text=Voice+Assistant",
    likes: 156,
    comments: 42,
    tags: ["ESP32", "Voice", "AI"]
  },
  {
    id: 5,
    title: "Bluetooth RC Car",
    author: "RacerX",
    description: "Arduino-powered RC car controlled via Bluetooth from a smartphone app.",
    image: "https://placehold.co/600x400/1e40af/f8fafc?text=RC+Car",
    likes: 111,
    comments: 29,
    tags: ["Arduino", "Bluetooth", "Motors"]
  },
  {
    id: 6,
    title: "Digital Clock with Temperature Display",
    author: "TimeLord",
    description: "ESP8266 digital clock with LED display and temperature sensor.",
    image: "https://placehold.co/600x400/0d9488/f8fafc?text=Digital+Clock",
    likes: 68,
    comments: 15,
    tags: ["ESP8266", "Time", "Display"]
  }
];

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ searchTerm }) => {
  // Filter projects based on search term
  const filteredProjects = projectsData.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProjects.map(project => (
        <Card key={project.id} className="overflow-hidden flex flex-col">
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <Code className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">By {project.author}</div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>{project.likes}</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{project.comments}</span>
              </button>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button size="sm">View</Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
