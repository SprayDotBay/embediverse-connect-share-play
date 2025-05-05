
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Calendar, Clock, Users } from "lucide-react";

interface ChallengesProps {
  searchTerm: string;
}

// Mock challenges data
const challengesData = [
  {
    id: 1,
    title: "IoT Weather Monitor Challenge",
    description: "Build a weather monitoring station using ESP32 and connect it to a web dashboard. Track temperature, humidity, and air quality.",
    difficulty: "Intermediate",
    category: "IoT",
    participants: 234,
    daysRemaining: 12,
    prizes: ["ESP32 Dev Kit", "$50 Gift Card", "Community Badge"],
    image: "https://placehold.co/600x300/172554/f8fafc?text=Weather+Monitor+Challenge"
  },
  {
    id: 2,
    title: "Arduino Robot Obstacle Course",
    description: "Program an Arduino-based robot to navigate through an obstacle course autonomously. Sensors and precision are key!",
    difficulty: "Advanced",
    category: "Robotics",
    participants: 186,
    daysRemaining: 18,
    prizes: ["Motor Driver Kit", "$100 Gift Card", "Robot Master Badge"],
    image: "https://placehold.co/600x300/1e40af/f8fafc?text=Robot+Challenge"
  },
  {
    id: 3,
    title: "LED Art Display Project",
    description: "Create an artistic LED display or installation. Show off your creativity with programming patterns and animations.",
    difficulty: "Beginner",
    category: "Creative",
    participants: 312,
    daysRemaining: 25,
    prizes: ["RGB LED Strip Kit", "$30 Gift Card", "LED Artist Badge"],
    image: "https://placehold.co/600x300/0d9488/f8fafc?text=LED+Art+Challenge"
  },
  {
    id: 4,
    title: "Energy Monitoring System",
    description: "Design and build a system to monitor and optimize energy usage in your home or a specific appliance.",
    difficulty: "Intermediate",
    category: "Energy",
    participants: 158,
    daysRemaining: 20,
    prizes: ["Current Sensor Kit", "$75 Gift Card", "Energy Guru Badge"],
    image: "https://placehold.co/600x300/172554/f8fafc?text=Energy+Challenge"
  },
  {
    id: 5,
    title: "Tiny ML Challenge",
    description: "Implement machine learning on microcontrollers. Create a project that uses TensorFlow Lite for on-device inference.",
    difficulty: "Expert",
    category: "Machine Learning",
    participants: 134,
    daysRemaining: 30,
    prizes: ["ESP32-CAM", "$150 Gift Card", "ML Expert Badge"],
    image: "https://placehold.co/600x300/1e40af/f8fafc?text=ML+Challenge"
  }
];

export const Challenges: React.FC<ChallengesProps> = ({ searchTerm }) => {
  // Filter challenges based on search term
  const filteredChallenges = challengesData.filter(challenge => 
    challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    challenge.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-success/20 text-green-success';
      case 'intermediate':
        return 'bg-blue-medium/20 text-blue-medium';
      case 'advanced':
        return 'bg-orange-warning/20 text-orange-warning';
      case 'expert':
        return 'bg-red-error/20 text-red-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Calculate time progress (inverse of days remaining)
  const getTimeProgress = (daysRemaining: number) => {
    // Assuming max challenge time is 30 days
    return 100 - (daysRemaining / 30) * 100;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredChallenges.map(challenge => (
        <Card key={challenge.id} className="flex flex-col overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={challenge.image} 
              alt={challenge.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle>{challenge.title}</CardTitle>
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
            <CardDescription>{challenge.category}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground mb-4">{challenge.description}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{challenge.participants} participants</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{challenge.daysRemaining} days left</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Time remaining</span>
                  <span>{challenge.daysRemaining} days</span>
                </div>
                <Progress value={getTimeProgress(challenge.daysRemaining)} className="h-2" />
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-primary" />
                  Prizes
                </div>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  {challenge.prizes.map((prize, index) => (
                    <li key={index}>{prize}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button className="w-full">Join Challenge</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
