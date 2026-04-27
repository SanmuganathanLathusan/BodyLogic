import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Appointment from '@/models/Appointment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const patientCount = await User.countDocuments({ role: 'patient' });
    const doctorCount = await Doctor.countDocuments();
    const appointmentCount = await Appointment.countDocuments();

    return NextResponse.json({
      patients: patientCount,
      doctors: doctorCount,
      appointments: appointmentCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
