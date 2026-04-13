import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const specialization = searchParams.get('specialization');
    
    // In a real app we might only fetch isApproved: true, but for demo we fetch all
    const query: any = {};
    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };

    const doctors = await Doctor.find(query).populate({
      path: 'userId',
      model: User,
      select: 'name email image'
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
