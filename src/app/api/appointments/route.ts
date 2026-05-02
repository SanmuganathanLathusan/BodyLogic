import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import Doctor from '@/models/Doctor';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'patient') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { doctorId, date, time, message } = body;

    if (!doctorId || !date || !time) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const appointment = await Appointment.create({
      patientId: session.user.id,
      doctorId,
      date,
      time,
      message,
      status: 'pending'
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // If patient, fetch appointments where patientId matches
    // If doctor, fetch appointments where doctorId matches
    let appointments = [];
    if (session.user.role === 'patient') {
      appointments = await Appointment.find({ patientId: session.user.id })
        .populate({ path: 'doctorId', select: 'name email' })
        .sort({ createdAt: -1 });
    } else if (session.user.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: session.user.id })
        .populate({ path: 'patientId', select: 'name email' })
        .sort({ createdAt: -1 });
    } else if (session.user.role === 'admin') {
      // Admins can view all appointments with patient and doctor user info
      appointments = await Appointment.find()
        .populate({ path: 'patientId', model: 'User', select: 'name email' })
        .populate({ path: 'doctorId', model: 'User', select: 'name email' })
        .sort({ createdAt: -1 });

      // Enrich appointments with doctor's profile (specialization) when available
      appointments = await Promise.all(appointments.map(async (appt) => {
        const obj = appt.toObject ? appt.toObject() : appt;
        try {
          const docProfile = await Doctor.findOne({ userId: obj.doctorId?._id });
          if (docProfile) {
            obj.doctorProfile = { specialization: docProfile.specialization };
          }
        } catch (e) {
          console.error('Failed to fetch doctor profile:', e);
        }
        return obj;
      }));
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
