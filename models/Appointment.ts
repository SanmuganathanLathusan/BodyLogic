import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencing User (Doctor role)
    date: { type: String, required: true }, // e.g., "2024-05-20"
    time: { type: String, required: true }, // e.g., "10:00"
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    message: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
