import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

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
    
    const { name, profileImage, currentPassword, newPassword } = await req.json();
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    
    // Update basic profile information
    user.name = name || user.name;
    
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }
    
    // Check if trying to change password
    if (newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
      }
      
      // Set new password (model pre-save hook will hash it)
      user.password = newPassword;
    }
    
    await user.save();
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage
      }
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ message: 'Profile update failed' }, { status: 500 });
  }
} 