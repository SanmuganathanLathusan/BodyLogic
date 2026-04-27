import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const doctors = await Doctor.find().populate({
      path: 'userId',
      model: User,
      select: 'name email image'
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, email, password, specialization, experience, consultationFee } = body;

    if (!name || !email || !password || !specialization) {
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
      role: 'doctor',
    });

    // Create Doctor profile immediately approved
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience: experience || 0,
      consultationFee: consultationFee || 100,
      isApproved: true, 
      availability: [
        { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00"] },
      ]
    });

    return NextResponse.json({ message: 'Doctor created successfully', doctor }, { status: 201 });
  } catch (error: any) {
    console.error('Admin doctor creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
