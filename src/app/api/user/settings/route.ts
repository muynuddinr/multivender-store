import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-jwt-key';

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
    
    const { currentPassword, newPassword, profileImage } = await req.json();
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // If updating password, verify current password first
    if (currentPassword && newPassword) {
      // Use the comparePassword method from the user model
      const isPasswordValid = await user.comparePassword(currentPassword);
      
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      
      // Set the new password directly - let the model's pre-save hook handle hashing
      user.password = newPassword;
    }
    
    // Update profile image if provided
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'Settings updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      message: 'Settings update failed: ' + errorMessage
    }, { status: 500 });
  }
} 