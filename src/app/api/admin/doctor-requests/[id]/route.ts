import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import DoctorRequest from '@/models/DoctorRequest';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session: any = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await req.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    await dbConnect();
    const request = await DoctorRequest.findById(id);

    if (!request) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'pending') {
      return NextResponse.json({ message: 'Request already processed' }, { status: 400 });
    }

    if (status === 'rejected') {
      request.status = 'rejected';
      await request.save();
      return NextResponse.json({ message: 'Request rejected style' });
    }

    // Approval Logic: Create User and Doctor profile
    // Generate unique username
    const baseUsername = request.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    let username = `dr_${baseUsername}`;
    let isUnique = false;
    let counter = 0;
    
    while (!isUnique) {
      const existing = await User.findOne({ username: counter === 0 ? username : `${username}${counter}` });
      if (!existing) {
        if (counter > 0) username = `${username}${counter}`;
        isUnique = true;
      } else {
        counter++;
      }
    }

    // Generate temporary password
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 chars
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create User
    const user = await User.create({
      name: request.fullName,
      email: request.email,
      username: username,
      phoneNumber: request.phoneNumber,
      password: hashedPassword,
      role: 'doctor',
      requiresPasswordChange: true,
    });

    // Create Doctor Profile
    await Doctor.create({
      userId: user._id,
      specialization: request.specialization,
      experience: request.experience,
      consultationFee: 1500, // Default fee
      isApproved: true,
      availability: [
        { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00"] },
      ]
    });

    // Update Request status
    request.status = 'approved';
    await request.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const loginUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`;

    const mailOptions = {
      from: `"BodyLogic Admin" <${process.env.EMAIL_USER}>`,
      to: request.email,
      subject: 'Your Doctor Access Request Approved',
      text: `Hello Dr. ${request.fullName},\n\nYour request for doctor access has been approved. You can now log in using the following credentials:\n\nUsername: ${username}\nTemporary Password: ${tempPassword}\nLogin URL: ${loginUrl}\n\nPlease change your password after your first login.\n\nBest regards,\nBodyLogic Team`,
      html: `
        <div style="font-family: sans-serif; color: #333;">
          <h2>Access Approved</h2>
          <p>Hello Dr. ${request.fullName},</p>
          <p>Your request for doctor access has been approved. You can now log in using the following credentials:</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
            <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
          </div>
          <p>Please change your password after your first login.</p>
          <p>Best regards,<br/>BodyLogic Team</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return NextResponse.json({ message: 'Doctor request approved and account created' });
  } catch (error: any) {
    console.error('Approval Error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
