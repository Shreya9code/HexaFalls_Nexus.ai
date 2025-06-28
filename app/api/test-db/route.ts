import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/configs/db';
import { userXP } from '@/configs/schema';

export async function GET(req: NextRequest) {
  try {
    console.log('=== Testing Database Connection ===');
    
    // Test basic query
    const result = await db.select().from(userXP).limit(1);
    console.log('Database query result:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection working',
      data: result,
      tableExists: true
    });
  } catch (err) {
    console.error('Database connection error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      tableExists: false
    }, { status: 500 });
  }
} 