import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const p = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { status } = body; // 'accepted', 'rejected', 'cancelled', 'completed'

    const appointment = await Appointment.findById(p.id);
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }

    // Verify ownership
    if (
      (session.user.role === 'patient' && appointment.patientId.toString() !== session.user.id) ||
      (session.user.role === 'doctor' && appointment.doctorId.toString() !== session.user.id)
    ) {
      return NextResponse.json({ message: 'Unauthorized action' }, { status: 403 });
    }

    // Patients can only 'cancel'
    if (session.user.role === 'patient' && status !== 'cancelled') {
      return NextResponse.json({ message: 'Patients can only cancel appointments' }, { status: 403 });
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
