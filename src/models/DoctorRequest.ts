import mongoose from 'mongoose';

const DoctorRequestSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    hospitalName: { type: String, required: true },
    experience: { type: Number, required: true },
    licenseUrl: { type: String, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.DoctorRequest || mongoose.model('DoctorRequest', DoctorRequestSchema);
