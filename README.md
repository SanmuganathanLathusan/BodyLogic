# 🏥 BodyLogic: Premium Healthcare Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

**BodyLogic** is a state-of-the-art healthcare platform designed to bridge the gap between patients and medical professionals. Built with a focus on ease of use, security, and premium aesthetics, it provides a seamless experience for booking appointments, tracking health metrics, and finding verified medical experts.

---

## 🚀 Live Demo
Experience the platform in action:  
🔗 **[Live Demo Link (Replace with your actual URL)](https://body-logic-iota.vercel.app/)**

---

## ✨ Key Features

- **🛡️ Verified Experts:** Access a curated network of vetted healthcare professionals.
- **📅 Smart Scheduling:** Intuitive booking system with instant confirmations.
- **📈 Health Tracking:** Securely store and monitor your medical history and vitals.
- **💳 Secure Payments:** Integrated PayPal gateway for seamless consultation fees.
- **🔐 Enterprise Security:** NextAuth-driven authentication with secure password hashing.
- **📱 Ultra Responsive:** Fluid design that works perfectly on mobile, tablet, and desktop.
- **📧 Automated Notifications:** Nodemailer integration for appointment alerts and password resets.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, React 19, Framer Motion |
| **Styling** | Tailwind CSS 4.0 (Vanilla CSS & Modern Utilities) |
| **Backend** | Next.js Server Components & Route Handlers |
| **Database** | MongoDB (via Mongoose) |
| **Authentication** | NextAuth.js (Credentials Provider) |
| **Payments** | PayPal Checkout SDK |
| **Forms/Validation** | React Hook Form & Zod |
| **Icons** | Lucide React |

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bodylogic.git
cd bodylogic
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox

EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🏗️ Architecture & Structure

```
src/
├── app/          # Next.js App Router (Pages, API, Layouts)
├── components/   # Reusable UI components & sections
├── lib/          # Utilities, database connection, and shared logic
├── models/       # Mongoose schemas for Users, Doctors, etc.
└── types/        # TypeScript interfaces and definitions
```

---

## 🎨 Design Philosophy

BodyLogic follows a **modern, minimalist healthcare aesthetic**:
- **Typography:** Clean, sans-serif fonts for maximum readability.
- **Color Palette:** Professional slate and crisp whites balanced with healthcare-blue accents.
- **Micro-interactions:** Subtle Framer Motion animations for a premium, high-fidelity feel.
- **Accessibility:** Semantic HTML and high-contrast ratios for inclusive usability.

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request or open an issue for any suggestions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the BodyLogic Team
</p>
