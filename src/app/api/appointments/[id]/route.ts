import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { refundPayPalCapture } from '@/lib/paypal';

function getAppointmentStart(date: string, time: string) {
  return new Date(`${date}T${time}:00`);
}

function getHoursUntil(start: Date) {
  return (start.getTime() - Date.now()) / (1000 * 60 * 60);
}

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
    const { status, action, date, time } = body; // 'accepted', 'rejected', 'cancelled', 'completed', 'reschedule'

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

    const requestedAction = action || (status === 'cancelled' ? 'cancel' : undefined);

    // Patients can only cancel or reschedule
    if (session.user.role === 'patient' && !['cancel', 'reschedule'].includes(requestedAction || '')) {
      return NextResponse.json({ message: 'Patients can only cancel or reschedule appointments' }, { status: 403 });
    }

    if (session.user.role === 'patient' && requestedAction === 'reschedule') {
      if (!date || !time) {
        return NextResponse.json({ message: 'Missing reschedule date or time' }, { status: 400 });
      }

      const newStart = getAppointmentStart(date, time);
      if (Number.isNaN(newStart.getTime()) || newStart.getTime() <= Date.now()) {
        return NextResponse.json({ message: 'Reschedule time must be in the future' }, { status: 400 });
      }

      appointment.date = date;
      appointment.time = time;
      await appointment.save();

      return NextResponse.json({
        message: 'Appointment rescheduled successfully',
        appointment,
      });
    }

    if (session.user.role === 'patient' && requestedAction === 'cancel') {
      const appointmentStart = getAppointmentStart(appointment.date, appointment.time);
      const hoursUntilAppointment = getHoursUntil(appointmentStart);
      const refundEligible = appointment.paymentStatus === 'paid' && Boolean(appointment.paymentCaptureId) && hoursUntilAppointment >= 6;

      if (refundEligible && appointment.paymentCaptureId) {
        await refundPayPalCapture(appointment.paymentCaptureId);
        appointment.paymentStatus = 'refunded';
      }

      appointment.status = 'cancelled';
      await appointment.save();

      return NextResponse.json({
        message: refundEligible
          ? 'Appointment cancelled and refund issued successfully'
          : 'Appointment cancelled. Refund not available because cancellation is within 6 hours of the appointment.',
        appointment,
        refundEligible,
      });
    }

    appointment.status = status;
    await appointment.save();

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
