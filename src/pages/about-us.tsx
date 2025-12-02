import React from 'react';
import { MapPin, Users, Shield, Heart, Target, Globe, Sparkles } from 'lucide-react';
import LogoDark from '@/component/common/UI/LogoDark';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <LogoDark />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            About <span className="text-blue-600">Nethra</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing eye care in Nigeria by connecting patients with verified optometrists
            through a trusted, accessible digital health platform.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Launching December 2025</p>
              <div className="flex items-center space-x-4 text-blue-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">4 Cities</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">200M+ Potential Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                To transform eye care accessibility in Nigeria by building a trusted digital platform
                that connects patients with verified optometrists, ensuring quality care for everyone,
                regardless of location.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Verified Professionals</h4>
                    <p className="text-gray-600">Licensed optometrists verified through ODORBN certification</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Heart className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Patient-Centered Care</h4>
                    <p className="text-gray-600">Focused specifically on optometry with specialized features</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Accessible Everywhere</h4>
                    <p className="text-gray-600">GPS-based discovery to find trusted care in any city</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-cover bg-center bg-no-repeat rounded-3xl p-8 text-white overflow-hidden"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                  <Globe className="w-12 h-12 text-gray-100 mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-gray-100 leading-relaxed mb-6">
                    To become {"Africa's"} leading digital eye care platform, expanding across
                    Ghana, Kenya, and South Africa while pioneering blockchain verification
                    and AI-powered diagnostics in healthcare.
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <p className="text-sm text-gray-100">
                      By 2028, we envision a DAO-based governance model with AR/VR
                      eye examination capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why Nethra Exists</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {"We're"} solving critical challenges in {"Nigeria's"} eye care ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">The Problems</h3>

              <div className="space-y-4">
                <div className="border-l-4 border-red-200 pl-4">
                  <p className="text-gray-700 font-medium">Trust Crisis</p>
                  <p className="text-gray-600 text-sm">Quack practitioners and unlicensed clinics create unsafe conditions</p>
                </div>

                <div className="border-l-4 border-red-200 pl-4">
                  <p className="text-gray-700 font-medium">Accessibility Issues</p>
                  <p className="text-gray-600 text-sm">Patients struggle to find trusted optometrists when traveling</p>
                </div>

                <div className="border-l-4 border-red-200 pl-4">
                  <p className="text-gray-700 font-medium">Fragmented Records</p>
                  <p className="text-gray-600 text-sm">Paper-based systems lead to repeated tests and delays</p>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Solution</h3>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="text-gray-700 font-medium">Verified Network</p>
                  <p className="text-gray-600 text-sm">ODORBN-certified optometrists with transparent credentials</p>
                </div>

                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="text-gray-700 font-medium">Smart Discovery</p>
                  <p className="text-gray-600 text-sm">GPS-based matching with emergency prioritization</p>
                </div>

                <div className="border-l-4 border-blue-200 pl-4">
                  <p className="text-gray-700 font-medium">Digital Records</p>
                  <p className="text-gray-600 text-sm">Secure, accessible patient history and seamless care continuity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Market Opportunity</h2>
            <p className="text-xl text-gray-600">A massive, underserved market ready for digital transformation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-3xl">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">200M+</h3>
              <p className="text-gray-600">People in Nigeria</p>
              <p className="text-sm text-gray-500 mt-2">20-25% experience vision issues</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-3xl">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">60%</h3>
              <p className="text-gray-600">Internet Penetration</p>
              <p className="text-sm text-gray-500 mt-2">Growing smartphone adoption</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-3xl">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">20%</h3>
              <p className="text-gray-600">CAGR Growth</p>
              <p className="text-sm text-gray-500 mt-2">African digital health market</p>
            </div>
          </div>
        </div>
      </section>

      {/* Launch Cities */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Launch Cities</h2>
            <p className="text-xl text-gray-600">Starting with strategic locations across Southwest Nigeria</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { city: "Akure", state: "Ondo State", description: "Innovation hub" },
              { city: "Ibadan", state: "Oyo State", description: "Major metropolitan" },
              { city: "Ilorin", state: "Kwara State", description: "Regional center" },
              { city: "Ikeja", state: "Lagos State", description: "Commercial capital" }
            ].map((location, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{location.city}</h3>
                <p className="text-gray-600 mb-2">{location.state}</p>
                <p className="text-sm text-gray-500">{location.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-block bg-white rounded-2xl px-8 py-4 shadow-lg border border-gray-100">
              <p className="text-gray-600 mb-2">Physical offices in all four cities</p>
              <div className="flex items-center justify-center space-x-4 text-blue-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Registered & Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">The Future of Eye Care</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            While we start with Web2 simplicity, our roadmap includes cutting-edge innovations
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Blockchain Verification</h3>
              <p className="text-gray-600">Immutable credential verification and secure health records</p>
              <p className="text-sm text-blue-600 font-medium mt-3">Coming 2026</p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">AI Diagnostics</h3>
              <p className="text-gray-600">Smart symptom checking and intelligent doctor-patient matching</p>
              <p className="text-sm text-purple-600 font-medium mt-3">Coming 2026</p>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Continental Expansion</h3>
              <p className="text-gray-600">Scaling across Ghana, Kenya, and South Africa</p>
              <p className="text-sm text-green-600 font-medium mt-3">2027-2028</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Join the Revolution</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Be part of transforming eye care in Nigeria. Whether {"you're"} an optometrist
            looking to grow your practice or a patient seeking trusted care, Nethra is building the future.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
            <p className="text-blue-100 mb-2">Official Launch</p>
            <p className="text-2xl font-bold">December 2025</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;