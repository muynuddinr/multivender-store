import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

// Update address
export async function PUT(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    
    await dbConnect();
    
    const { address } = await req.json();
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Update address
    user.address = address;
    
    await user.save();
    
    return NextResponse.json({
      message: 'Address updated successfully',
      address: user.address
    });
  } catch (error) {
    console.error('Address update error:', error);
    return NextResponse.json({ message: 'Address update failed' }, { status: 500 });
  }
}

// Delete address
export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    
    await dbConnect();
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Remove address
    user.address = undefined;
    
    await user.save();
    
    return NextResponse.json({
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Address delete error:', error);
    return NextResponse.json({ message: 'Address deletion failed' }, { status: 500 });
  }
} 