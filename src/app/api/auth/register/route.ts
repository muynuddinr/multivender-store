import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, profileImage } = await req.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      profileImage
    });
    
    await user.save();
    
    // Return success (exclude password from response)
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Something went wrong with registration' },
      { status: 500 }
    );
  }
} 