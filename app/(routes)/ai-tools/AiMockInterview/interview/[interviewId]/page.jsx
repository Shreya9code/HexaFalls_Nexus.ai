"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/configs/db";
import { MockInterview } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Interview() {
  const params = useParams();
  const interviewId = params?.interviewId;
  console.log(interviewId);
  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Let's Get Started</h1>
        <p className="text-muted-foreground">
          Review your interview details and prepare your camera
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Job Role/Position</h3>
                <p className="text-muted-foreground">{interviewData?.jobPosition}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Job Description/Tech Stack</h3>
                <p className="text-muted-foreground">{interviewData?.jobDesc}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Years of Experience</h3>
                <p className="text-muted-foreground">{interviewData?.jobExperience}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {process.env.NEXT_PUBLIC_INFORMATION}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {webCamEnabled ? (
                <Webcam
                  onUserMedia={() => setWebCamEnabled(true)}
                  onUserMediaError={() => setWebCamEnabled(false)}
                  mirrored={true}
                  className="w-full h-[300px] rounded-lg object-cover"
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
                    <WebcamIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setWebCamEnabled(true)}
                  >
                    Enable Webcam and Microphone
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Link href={`/ai-tools/AiMockInterview/interview/${interviewId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;
