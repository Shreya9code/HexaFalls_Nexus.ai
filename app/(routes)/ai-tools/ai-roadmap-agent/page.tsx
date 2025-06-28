"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const popularTechnologies = [
  "Frontend Development",
  "Backend Development", 
  "Full Stack Development",
  "Mobile Development (React Native)",
  "Mobile Development (Flutter)",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing (AWS)",
  "Cloud Computing (Azure)",
  "Cybersecurity",
  "Blockchain Development",
  "Game Development",
  "UI/UX Design",
  "Product Management",
  "Data Engineering",
  "Software Testing",
  "System Administration"
];

export default function RoadmapAgentPage() {
  const router = useRouter();
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [customTechnology, setCustomTechnology] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTechnologySelect = (tech: string) => {
    setSelectedTechnology(tech);
    setCustomTechnology('');
  };

  const handleCustomTechnology = () => {
    setSelectedTechnology('');
  };

  const handleGenerateRoadmap = async () => {
    const finalTechnology = selectedTechnology || customTechnology;
    if (!finalTechnology.trim()) {
      alert('Please select or enter a technology/career path');
      return;
    }

    alert(`Starting roadmap generation for: ${finalTechnology}`);
    setIsLoading(true);
    const roadmapId = uuidv4();
    
    try {
      const roadmapResponse = await axios.post("/api/ai-roadmap-agent", {
        roadmapId: roadmapId,
        userInput: `Generate a comprehensive career roadmap for ${finalTechnology}. Include learning paths, skills, tools, and estimated timeline. Format the response as a structured roadmap with clear milestones.`
      });
      if (roadmapResponse.data.error) {
        throw new Error(roadmapResponse.data.error);
      }
      router.push(`/ai-tools/ai-roadmap-agent/${roadmapId}`);
    } catch (error) {
      alert(`Failed to generate roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Career Roadmap Generator</h1>
        <p className="text-muted-foreground text-lg">
          Choose your desired technology or career path to generate a personalized learning roadmap
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Popular Technologies & Career Paths</CardTitle>
          <CardDescription>
            Select from our curated list of popular technologies and career paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularTechnologies.map((tech) => (
              <Badge
                key={tech}
                variant={selectedTechnology === tech ? "default" : "outline"}
                className={`cursor-pointer p-3 text-sm hover:bg-primary hover:text-primary-foreground transition-colors ${
                  selectedTechnology === tech ? "bg-primary text-primary-foreground" : ""
                }`}
                onClick={() => handleTechnologySelect(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Custom Technology/Career Path</CardTitle>
          <CardDescription>
            Don't see what you're looking for? Enter your own technology or career path
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-tech">Technology or Career Path</Label>
              <Input
                id="custom-tech"
                placeholder="e.g., Quantum Computing, Digital Marketing, etc."
                value={customTechnology}
                onChange={(e) => setCustomTechnology(e.target.value)}
                onClick={handleCustomTechnology}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleGenerateRoadmap}
          disabled={isLoading || (!selectedTechnology && !customTechnology.trim())}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Roadmap...
            </>
          ) : (
            'Generate Career Roadmap'
          )}
        </Button>
        
        {(selectedTechnology || customTechnology) && (
          <p className="text-sm text-muted-foreground mt-2">
            Selected: <span className="font-medium">{selectedTechnology || customTechnology}</span>
          </p>
        )}
      </div>
    </div>
  );
} 