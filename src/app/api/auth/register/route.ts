import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, password, phoneNumber, address, role, specialization, experience, consultationFee } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the User first
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      role: role === 'doctor' ? 'doctor' : 'patient',
    });

    // If role is doctor, additionally create Doctor profile
    if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: specialization || 'General',
        experience: experience || 0,
        consultationFee: consultationFee || 100,
        isApproved: false, // Must be approved by admin
        availability: [
          { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00"] },
          { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
          { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
          { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00"] },
          { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        ]
      });
    }

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
