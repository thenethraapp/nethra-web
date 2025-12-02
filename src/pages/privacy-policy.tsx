import React from 'react';
import LogoDark from '@/component/common/UI/LogoDark';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <LogoDark />
          <h1 className="text-5xl font-bold text-gray-800 mt-6">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mt-4">
            Nethra values your privacy. This policy explains how we collect, use, and protect your data.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
            <p>
              We collect personal details such as your name, email, phone number, and medical
              history required for booking and maintaining digital health records. Doctors may
              provide professional and clinic information for verification purposes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
            <p>
              Your data is used to facilitate bookings, maintain digital records, provide secure
              communication between patients and doctors, and improve platform functionality.
              We do not sell or rent your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Protection</h2>
            <p>
              Nethra complies with the Nigeria Data Protection Regulation (NDPR). Data is stored
              securely using industry-standard encryption. Access to health records is restricted
              to verified users with explicit consent.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Third-Party Services</h2>
            <p>
              We may integrate with secure third-party services such as payment providers.
              These providers operate under their own privacy policies, and we encourage you
              to review them before use.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Patient Records</h2>
            <p>
              Health records created on Nethra remain accessible only within the platform.
              Patients and doctors cannot transfer these records outside Nethra without
              authorized consent, ensuring security and trust.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect new features or
              regulatory requirements. Users will be notified of significant changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
