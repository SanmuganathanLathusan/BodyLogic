import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DoctorRequest from '@/models/DoctorRequest';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Validate required fields
    const { fullName, email, phoneNumber, registrationNumber, specialization, hospitalName, experience, licenseUrl } = body;
    if (!fullName || !email || !phoneNumber || !registrationNumber || !specialization || !hospitalName || !experience || !licenseUrl) {
      return NextResponse.json({ message: 'Missing required fields including license' }, { status: 400 });
    }

    const newRequest = await DoctorRequest.create({
      fullName,
      email,
      phoneNumber,
      registrationNumber,
      specialization,
      hospitalName,
      experience: Number(experience),
      licenseUrl,
      notes: body.notes || '',
      status: 'pending',
    });

    return NextResponse.json({ message: 'Request submitted successfully', request: newRequest }, { status: 201 });
  } catch (error: any) {
    console.error('Doctor request error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
