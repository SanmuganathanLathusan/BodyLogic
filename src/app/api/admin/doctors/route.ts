import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const doctors = await Doctor.find().populate({
      path: 'userId',
      model: User,
      select: 'name email image'
    });

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching admin doctors:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, email, username, phoneNumber, password, specialization, experience, consultationFee, imageBase64, imageName } = body;

    if (!name || !email || !username || !password || !specialization) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: 'Email or Username already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // handle optional image (base64) -> save to public/uploads
    let publicImagePath: string | undefined = undefined;
    if (imageBase64 && imageName) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.promises.mkdir(uploadsDir, { recursive: true });
        const base64Data = imageBase64.replace(/^data:.*;base64,/, '');
        const safeName = `${Date.now()}-${imageName.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const filePath = path.join(uploadsDir, safeName);
        await fs.promises.writeFile(filePath, Buffer.from(base64Data, 'base64'));
        publicImagePath = `/uploads/${safeName}`;
      } catch (err) {
        console.error('Error saving uploaded image:', err);
      }
    }

    // Create the User first
    const userData: any = {
      name,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      role: 'doctor',
      requiresPasswordChange: true,
    };
    if (publicImagePath) userData.image = publicImagePath;

    const user = await User.create(userData);

    // Create Doctor profile immediately approved
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experience: experience || 0,
      consultationFee: consultationFee || 100,
      isApproved: true, 
      availability: [
        { day: "Monday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Tuesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Wednesday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Thursday", slots: ["09:00", "10:00", "11:00", "14:00"] },
        { day: "Friday", slots: ["09:00", "10:00", "11:00", "14:00"] },
      ]
    });

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"BodyLogic Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Doctor Account Created',
      text: `Hello Dr. ${name},\n\nYour account has been created. You can log in with:\nUsername: ${username}\nTemporary Password: ${password}\n\nPlease log in and change your password.\n\nThank you!`,
      html: `
        <p>Hello Dr. ${name},</p>
        <p>Your account has been created. You can log in with:</p>
        <ul>
          <li><strong>Username:</strong> ${username}</li>
          <li><strong>Temporary Password:</strong> ${password}</li>
        </ul>
        <p>Please log in and change your password.</p>
        <p>Thank you!</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send email to doctor:', emailError);
      // We still return 201 since doctor was created successfully
    }

    return NextResponse.json({ message: 'Doctor created successfully and email sent', doctor }, { status: 201 });
  } catch (error: any) {
    console.error('Admin doctor creation error:', error);
    return NextResponse.json({ message: error.message || 'Internal server error' }, { status: 500 });
  }
}
