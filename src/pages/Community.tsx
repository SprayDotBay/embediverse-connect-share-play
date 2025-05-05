import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowRight, 
  FileCode, 
  MessageSquare, 
  Search, 
  Star, 
  Upload, 
  User,
  Users
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const Community = () => {
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
                placeholder="Search projects, users..." 
                className="pl-8 w-[250px]" 
              />
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Share Project
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          <div className="md:col-span-4 space-y-6">
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <FileCode className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Smart Home Automation Hub</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>by robotics_guru</span>
                              <span>•</span>
                              <span>2 days ago</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge>ESP32</Badge>
                            <Badge variant="outline">IoT</Badge>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          Complete home automation system using ESP32 as the central hub. 
                          Controls lights, temperature, and security with mobile app integration.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span>435</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>48</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Project
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <FileCode className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Plant Monitoring System</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>by green_thumb</span>
                              <span>•</span>
                              <span>1 week ago</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge>Arduino</Badge>
                            <Badge variant="outline">Sensors</Badge>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          Monitor soil moisture, light levels, and temperature for your plants.
                          Get alerts when plants need watering and view historical data.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span>327</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>32</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Project
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <FileCode className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Voice-Controlled Robot</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>by tech_explorer</span>
                              <span>•</span>
                              <span>3 days ago</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge>Raspberry Pi</Badge>
                            <Badge variant="outline">Robotics</Badge>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">
                          Build a robot that responds to voice commands using Raspberry Pi and Python.
                          Features obstacle avoidance and custom wake words.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span>289</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>27</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Project
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="latest" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-center items-center h-40 text-muted-foreground">
                      Latest projects will appear here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="following" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-center items-center h-40 text-muted-foreground">
                      Follow users to see their projects here
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="challenges" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                          1
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Weekly Challenge: Weather Station</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Ends in 5 days</span>
                              <span>•</span>
                              <span>128 participants</span>
                            </div>
                          </div>
                          <Badge className="bg-blue-medium hover:bg-blue-medium/90">Active</Badge>
                        </div>
                        <p className="mt-2 text-sm">
                          Build a weather station that measures temperature, humidity, and pressure.
                          Bonus points for adding a web interface to view the data.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map((i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[8px]">U{i}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">+125 more</span>
                          </div>
                          <Button size="sm">
                            Join Challenge
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-muted-foreground/30 flex items-center justify-center text-muted-foreground font-bold">
                          2
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">Monthly Challenge: Home Automation</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Starts in 6 days</span>
                              <span>•</span>
                              <span>43 pre-registered</span>
                            </div>
                          </div>
                          <Badge variant="outline">Upcoming</Badge>
                        </div>
                        <p className="mt-2 text-sm">
                          Create a home automation system that controls at least three different 
                          appliances or systems in your home.
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[1, 2].map((i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-[8px]">U{i}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">+41 more</span>
                          </div>
                          <Button variant="outline" size="sm">
                            Pre-register
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Most active community members</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {[
                    { name: "robotics_guru", level: "Expert", badges: 15, contributions: 47 },
                    { name: "circuit_master", level: "Advanced", badges: 9, contributions: 32 },
                    { name: "code_wizard", level: "Expert", badges: 12, contributions: 29 },
                    { name: "tech_explorer", level: "Intermediate", badges: 6, contributions: 21 },
                    { name: "arduino_fan", level: "Advanced", badges: 8, contributions: 18 },
                  ].map((user, idx) => (
                    <div key={user.name} className="flex items-center gap-3">
                      <div className="font-medium text-sm text-muted-foreground w-5">
                        {idx + 1}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.level} • {user.badges} badges
                        </div>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {user.contributions} projects
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Contributors
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Robot Zoo</CardTitle>
                <CardDescription>Live device showcase</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {[
                    { name: "GardenBot", owner: "green_thumb", status: "active", type: "Environmental Monitor" },
                    { name: "RoverOne", owner: "robotics_guru", status: "active", type: "Autonomous Vehicle" },
                    { name: "SmartDisplay", owner: "code_wizard", status: "active", type: "Information Panel" },
                  ].map((device) => (
                    <div key={device.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-green-success animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{device.name}</div>
                        <div className="text-xs text-muted-foreground">
                          by {device.owner} • {device.type}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-muted rounded-md text-center">
                  <p className="text-sm mb-2">Add your device to the Robot Zoo</p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Community meetups and workshops</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Arduino Hackathon</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Jun 15 • Online • 24 hours
                        </p>
                      </div>
                      <div className="flex items-center text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        <span>42</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Register
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Raspberry Pi Workshop</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Jun 22 • San Francisco • 3 hours
                        </p>
                      </div>
                      <div className="flex items-center text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        <span>28</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Register
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">ESP32 IoT Meetup</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Jul 5 • Online • 2 hours
                        </p>
                      </div>
                      <div className="flex items-center text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        <span>19</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-2">
                      Register
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
