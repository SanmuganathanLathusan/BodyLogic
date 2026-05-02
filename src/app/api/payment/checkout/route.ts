import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getPayPalAccessToken, getPayPalApiBase } from '@/lib/paypal';

const CONSULTATION_FEE_LKR = 1650;
const PAYPAL_EXCHANGE_RATE_LKR_PER_USD = 300;
const CONSULTATION_FEE_USD = (CONSULTATION_FEE_LKR / PAYPAL_EXCHANGE_RATE_LKR_PER_USD).toFixed(2);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'patient') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, date, time, doctorName, doctorSpecialization } = body;

    if (!doctorId || !date || !time) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const accessToken = await getPayPalAccessToken();
    const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: doctorId,
            custom_id: JSON.stringify({
              doctorId,
              patientId: session.user.id,
              date,
              time,
            }),
            description: `Consultation with Dr. ${doctorName} - ${doctorSpecialization} - ${date} at ${time}`,
            amount: {
              currency_code: 'USD',
              value: CONSULTATION_FEE_USD,
            },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXTAUTH_URL}/payment/success`,
          cancel_url: `${process.env.NEXTAUTH_URL}/doctors/${doctorId}`,
          brand_name: 'BodyLogic',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create PayPal order: ${errorText}`);
    }

    const order = await response.json();
    const approvalUrl = order.links?.find((link: { rel: string; href: string }) => link.rel === 'approve')?.href;

    if (!approvalUrl) {
      throw new Error('PayPal approval URL not found');
    }

    return NextResponse.json({ url: approvalUrl }, { status: 200 });
  } catch (error) {
    console.error('PayPal checkout error:', error);
    return NextResponse.json(
      { message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
