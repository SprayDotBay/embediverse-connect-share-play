
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Settings,
  ArrowUp,
  ArrowDown,
  Calendar,
  User,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for projects
const projectsData = [
  {
    id: 1,
    title: "Temperature Monitor",
    description: "Arduino-based temperature and humidity monitor with web dashboard",
    author: "maker42",
    likes: 237,
    views: 1243,
    lastUpdated: "2 days ago",
    tags: ["Arduino", "IoT", "Sensors"],
    thumbnail: "temperature-monitor.jpg",
    difficulty: "Beginner",
    platform: "Arduino",
    progress: 100
  },
  {
    id: 2,
    title: "Smart Garden System",
    description: "Automated plant watering system with soil moisture monitoring",
    author: "plant_lover",
    likes: 186,
    views: 876,
    lastUpdated: "1 week ago",
    tags: ["ESP32", "IoT", "Automation"],
    thumbnail: "smart-garden.jpg",
    difficulty: "Intermediate",
    platform: "ESP32",
    progress: 75
  },
  {
    id: 3,
    title: "Home Security Camera",
    description: "Raspberry Pi-based security camera with motion detection",
    author: "secure_dev",
    likes: 312,
    views: 2154,
    lastUpdated: "3 days ago",
    tags: ["Raspberry Pi", "Camera", "Security"],
    thumbnail: "security-camera.jpg",
    difficulty: "Advanced",
    platform: "Raspberry Pi",
    progress: 60
  },
  {
    id: 4,
    title: "LED Matrix Display",
    description: "Customizable LED matrix display for scrolling text and patterns",
    author: "blinky_bits",
    likes: 98,
    views: 523,
    lastUpdated: "2 weeks ago",
    tags: ["Arduino", "LEDs", "Display"],
    thumbnail: "led-matrix.jpg",
    difficulty: "Intermediate",
    platform: "Arduino",
    progress: 90
  },
  {
    id: 5,
    title: "Voice-Controlled Robot",
    description: "ESP32-based robot that responds to voice commands",
    author: "robo_wizard",
    likes: 275,
    views: 1832,
    lastUpdated: "5 days ago",
    tags: ["ESP32", "Robotics", "Voice Control"],
    thumbnail: "voice-robot.jpg",
    difficulty: "Advanced",
    platform: "ESP32",
    progress: 40
  },
  {
    id: 6,
    title: "Weather Station",
    description: "Complete weather monitoring station with multiple sensors",
    author: "storm_chaser",
    likes: 421,
    views: 3245,
    lastUpdated: "1 day ago",
    tags: ["Raspberry Pi", "Sensors", "Weather"],
    thumbnail: "weather-station.jpg",
    difficulty: "Intermediate",
    platform: "Raspberry Pi",
    progress: 85
  }
];

const myProjects = projectsData.slice(0, 3);
const communityProjects = projectsData.slice(3);

const Projects = () => {
  const [sortBy, setSortBy] = React.useState("popular");
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search projects..." 
                className="pl-8 w-[250px]" 
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-projects" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="learning-tracks">Learning Tracks</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex gap-1">
                    {sortBy === "popular" && "Popular"}
                    {sortBy === "newest" && "Newest"}
                    {sortBy === "most-liked" && "Most Liked"}
                    {sortBy === "alphabetical" && "A-Z"}
                    {sortBy === "recent" && "Recently Updated"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("popular")}>
                    <ArrowDown className="mr-2 h-4 w-4" /> Popular
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    <Calendar className="mr-2 h-4 w-4" /> Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("most-liked")}>
                    <ArrowUp className="mr-2 h-4 w-4" /> Most Liked
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                    <Star className="mr-2 h-4 w-4" /> Alphabetical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("recent")}>
                    <Calendar className="mr-2 h-4 w-4" /> Recently Updated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="my-projects">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {communityProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="learning-tracks">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Getting Started with Arduino</CardTitle>
                      <CardDescription>Basic Arduino programming and circuit building</CardDescription>
                    </div>
                    <span className="bg-accent px-2 py-1 rounded text-xs">Beginner</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>3/10 Projects</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn the fundamentals of Arduino programming, circuits, and sensors through 10 guided projects.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>23,456 learners</span>
                    </div>
                    <Button className="w-full">Continue Learning</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>ESP32 IoT Projects</CardTitle>
                      <CardDescription>Internet-connected ESP32 applications</CardDescription>
                    </div>
                    <span className="bg-accent px-2 py-1 rounded text-xs">Intermediate</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>0/8 Projects</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Build IoT projects using ESP32, connecting your devices to the internet and cloud services.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>12,783 learners</span>
                    </div>
                    <Button className="w-full">Start Learning</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Raspberry Pi Robotics</CardTitle>
                      <CardDescription>Build advanced robots with Raspberry Pi</CardDescription>
                    </div>
                    <span className="bg-accent px-2 py-1 rounded text-xs">Advanced</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>0/6 Projects</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Create sophisticated robots with computer vision, machine learning, and advanced sensor integration.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>8,921 learners</span>
                    </div>
                    <Button className="w-full">Start Learning</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sensors & Data Visualization</CardTitle>
                      <CardDescription>Collect and visualize sensor data</CardDescription>
                    </div>
                    <span className="bg-accent px-2 py-1 rounded text-xs">Intermediate</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>0/7 Projects</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn to collect, process, and visualize data from various sensors to create meaningful displays.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>15,347 learners</span>
                    </div>
                    <Button className="w-full">Start Learning</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    author: string;
    likes: number;
    views: number;
    lastUpdated: string;
    tags: string[];
    difficulty: string;
    platform: string;
    progress: number;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 bg-muted relative">
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
            {project.platform}
          </span>
        </div>
        <div className="absolute bottom-2 right-2">
          <span className="bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded">
            {project.difficulty}
          </span>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>by {project.author}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {project.tags.map((tag) => (
            <span 
              key={tag} 
              className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
          <div 
            className="bg-primary h-1.5 rounded-full" 
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            <span>{project.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Search className="h-3.5 w-3.5" />
            <span>{project.views}</span>
          </div>
          <span>Updated {project.lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
