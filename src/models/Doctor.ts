import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    bio: { type: String },
    availability: [
      {
        day: { type: String, required: true }, // e.g., "Monday"
        slots: [{ type: String }], // e.g., ["09:00", "10:00"]
      },
    ],
    consultationFee: { type: Number, required: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
