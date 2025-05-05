
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <section className="rounded-lg border p-6 bg-card shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Welcome to Embediverse
              </h1>
              <p className="text-muted-foreground mb-4">
                Connect, program, and share your embedded systems projects in one place.
                Start by connecting a device or exploring community projects.
              </p>
              <div className="flex gap-4">
                <Button>Connect Device</Button>
                <Button variant="outline">Explore Projects</Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="circuit-pattern bg-muted h-64 rounded-lg flex items-center justify-center">
                <div className="animate-float bg-card p-4 rounded-lg shadow-lg">
                  <div className="w-32 h-16 bg-blue-medium/10 rounded-md flex items-center justify-center">
                    <div className="w-6 h-6 bg-teal rounded-full animate-pulse-gentle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Connect</CardTitle>
              <CardDescription>Connect to your devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-success"></div>
                    <span>Arduino Uno</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-warning"></div>
                    <span>ESP32 DevKit</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Connect
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                    <span>Raspberry Pi</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Connect
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
              <CardDescription>Popular in the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Weather Station", author: "maker42", views: 2345 },
                  { name: "Smart Garden", author: "plant_lover", views: 1876 },
                  { name: "Home Security", author: "secure_dev", views: 1432 },
                ].map((project) => (
                  <div key={project.name} className="group flex justify-between items-center">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {project.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        by {project.author} • {project.views} views
                      </p>
                    </div>
                    <Button size="icon" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Tracks</CardTitle>
              <CardDescription>Guided projects to build skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Getting Started</h3>
                      <p className="text-sm text-muted-foreground">
                        For beginners learning the basics
                      </p>
                    </div>
                    <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                      Beginner
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Sensor Projects</h3>
                      <p className="text-sm text-muted-foreground">
                        Create projects with various sensors
                      </p>
                    </div>
                    <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                      Intermediate
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">IoT Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your devices to the internet
                      </p>
                    </div>
                    <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                      Advanced
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
