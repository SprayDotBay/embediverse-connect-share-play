
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Star } from "lucide-react";

interface LeaderboardProps {
  searchTerm: string;
}

// Mock leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Mike Arduino",
    username: "mikearduino",
    avatar: "https://placehold.co/300/172554/f8fafc?text=MA",
    points: 12580,
    level: 32,
    badges: ["ESP Master", "Arduino Pro", "Code Wizard"],
    projects: 27,
    contributions: 154
  },
  {
    id: 2,
    name: "Emily Circuits",
    username: "emilycircuits",
    avatar: "https://placehold.co/300/1e40af/f8fafc?text=EC",
    points: 10340,
    level: 28,
    badges: ["Sensor Expert", "IoT Builder", "Community Mentor"],
    projects: 19,
    contributions: 97
  },
  {
    id: 3,
    name: "David Maker",
    username: "davidmaker",
    avatar: "https://placehold.co/300/0d9488/f8fafc?text=DM",
    points: 9250,
    level: 25,
    badges: ["Robotics Guru", "Library Contributor", "Challenge Winner"],
    projects: 15,
    contributions: 112
  },
  {
    id: 4,
    name: "Lisa Electronics",
    username: "lisaelectronics",
    avatar: "https://placehold.co/300/172554/f8fafc?text=LE",
    points: 8720,
    level: 24,
    badges: ["Hardware Hacker", "PCB Designer", "Display Master"],
    projects: 22,
    contributions: 76
  },
  {
    id: 5,
    name: "Kevin Programmer",
    username: "kevinprogrammer",
    avatar: "https://placehold.co/300/1e40af/f8fafc?text=KP",
    points: 7950,
    level: 22,
    badges: ["API Expert", "WiFi Wizard", "Code Reviewer"],
    projects: 12,
    contributions: 135
  },
  {
    id: 6,
    name: "Sophia Invent",
    username: "sophiainvent",
    avatar: "https://placehold.co/300/0d9488/f8fafc?text=SI",
    points: 7240,
    level: 20,
    badges: ["Creative Innovator", "Sensor Specialist", "Project Mentor"],
    projects: 17,
    contributions: 68
  },
  {
    id: 7,
    name: "James Electron",
    username: "jameselectron",
    avatar: "https://placehold.co/300/172554/f8fafc?text=JE",
    points: 6890,
    level: 19,
    badges: ["Bluetooth Expert", "Motor Master", "Tutorial Creator"],
    projects: 14,
    contributions: 82
  },
  {
    id: 8,
    name: "Anna Circuit",
    username: "annacircuit",
    avatar: "https://placehold.co/300/1e40af/f8fafc?text=AC",
    points: 6350,
    level: 18,
    badges: ["LED Artist", "Automation Engineer", "Challenge Mentor"],
    projects: 11,
    contributions: 59
  }
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ searchTerm }) => {
  // Filter leaderboard based on search term
  const filteredLeaderboard = leaderboardData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.badges.some(badge => badge.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Community Leaderboard
          </CardTitle>
          <CardDescription>
            Top community members ranked by contribution points and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="font-bold text-lg min-w-[24px] text-center">
                  {index + 1}
                </div>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">@{user.username}</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{user.points.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
                <div className="text-center">
                  <div className="font-bold flex items-center justify-center">
                    <Star className="h-4 w-4 text-orange-warning mr-1 fill-orange-warning" />
                    {user.level}
                  </div>
                  <div className="text-xs text-muted-foreground">level</div>
                </div>
                <div className="flex-1 flex flex-wrap gap-1">
                  {user.badges.slice(0, 3).map(badge => (
                    <span 
                      key={badge} 
                      className="px-2 py-0.5 bg-muted text-xs rounded-full truncate max-w-[100px]"
                      title={badge}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="text-center">
                  <div className="font-medium">{user.projects}</div>
                  <div className="text-xs text-muted-foreground">projects</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
