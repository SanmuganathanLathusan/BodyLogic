import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { getPayPalAccessToken, getPayPalApiBase } from '@/lib/paypal';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ message: 'Missing order ID' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Payment not completed' }, { status: 400 });
    }

    const capturedOrder = await response.json();
    if (capturedOrder.status !== 'COMPLETED') {
      return NextResponse.json({ message: 'Payment not completed' }, { status: 400 });
    }

    const purchaseUnit = capturedOrder.purchase_units?.[0];
    let orderData: { doctorId?: string; patientId?: string; date?: string; time?: string } = {};
    const paymentCaptureId = purchaseUnit?.payments?.captures?.[0]?.id;

    if (purchaseUnit?.custom_id) {
      try {
        orderData = JSON.parse(purchaseUnit.custom_id);
      } catch {
        return NextResponse.json({ message: 'Invalid order metadata' }, { status: 400 });
      }
    }

    const { doctorId, patientId, date, time } = orderData;

    if (!doctorId || !patientId || !date || !time) {
      return NextResponse.json({ message: 'Invalid order metadata' }, { status: 400 });
    }

    // Create appointment after payment confirmation
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      message: 'Payment completed - Consultation booked',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentOrderId: orderId,
      paymentCaptureId,
    });

    return NextResponse.json(
      { success: true, appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { message: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}
