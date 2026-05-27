import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'doctor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const doctor = await Doctor.findOne({ userId: session.user.id });
    
    if (!doctor) {
      return NextResponse.json({ message: 'Doctor profile not found' }, { status: 404 });
    }

    return NextResponse.json(doctor.availability || []);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'doctor') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { availability } = await request.json();

    await dbConnect();
    const doctor = await Doctor.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { availability } },
      { new: true }
    );

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor profile not found' }, { status: 404 });
    }

    return NextResponse.json(doctor.availability);
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
