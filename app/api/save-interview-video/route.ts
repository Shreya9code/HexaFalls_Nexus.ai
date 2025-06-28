import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoBlob = formData.get('video') as Blob;
    const interviewId = formData.get('interviewId') as string;

    if (!videoBlob) {
      return NextResponse.json({ error: 'No video data provided' }, { status: 400 });
    }

    // Convert blob to buffer
    const arrayBuffer = await videoBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Always save as temp.mp4
    const filePath = path.join(uploadsDir, 'temp.mp4');

    // Write the file
    await writeFile(filePath, buffer);

    console.log(`Video saved successfully to: ${filePath}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Video saved successfully',
      filePath: filePath
    });

  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json({ error: 'Failed to save video' }, { status: 500 });
  }
} 