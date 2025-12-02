import React from 'react';
import LogoDark from '@/component/common/UI/LogoDark';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-6 py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <LogoDark />
          <h1 className="text-5xl font-bold text-gray-800 mt-6">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 mt-4">
            Welcome to Nethra. By using our platform, you agree to the terms outlined below.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Use of Service</h2>
            <p>
              Nethra is a digital health platform connecting patients with verified optometrists.
              The platform is intended for informational and booking purposes only and does not
              replace professional medical advice. Patients should always follow the guidance of
              licensed health practitioners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">2. User Responsibilities</h2>
            <p>
              Users must provide accurate information when registering or booking consultations.
              Any attempt to misrepresent identity, medical history, or intent may result in
              suspension or termination of access to the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Doctor Verification</h2>
            <p>
              All optometrists listed on Nethra undergo verification with the Optometry and
              Dispensing Opticians Registration Board of Nigeria (ODORBN). However, Nethra
              is not liable for services provided by practitioners beyond verifying their credentials.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Limitation of Liability</h2>
            <p>
              Nethra provides a platform for discovery, booking, and record-keeping. We are not
              responsible for the outcomes of medical consultations, treatments, or any
              professional advice given by optometrists on or outside the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Compliance & Regulations</h2>
            <p>
              Users and practitioners must comply with Nigerian laws and the Nigeria Data Protection
              Regulation (NDPR). Future international compliance, such as GDPR or HIPAA, will be
              implemented as the platform expands globally.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Modifications</h2>
            <p>
              Nethra reserves the right to update or modify these Terms & Conditions at any time.
              Continued use of the platform constitutes agreement to the revised terms.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;