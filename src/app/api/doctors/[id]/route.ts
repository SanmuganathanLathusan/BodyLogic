import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // In Next 15+ params should be awaited if generic
) {
  const p = await params;
  
  try {
    await dbConnect();

    const doctor = await Doctor.findById(p.id).populate({
      path: 'userId',
      model: User,
      select: 'name email image'
    });

    if (!doctor) {
      return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
