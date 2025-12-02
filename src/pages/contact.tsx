import React from 'react';
import { Mail } from 'lucide-react';
import LogoDark from '@/component/common/UI/LogoDark';
import { BsFacebook, BsLinkedin, BsTiktok, BsTwitterX } from 'react-icons/bs';

const Contact = () => {
  return (
    <div className=" bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-20 bg-gradient-to-b from-white via-blue-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <LogoDark />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Contact <span className="text-blue-600">Nethra</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to collaborate?
            We’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-6 py-20 ">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Email */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Reach out anytime, we’ll respond promptly.</p>
            <a
              href="mailto:thenethraapp@gmail.com"
              className="text-blue-600 font-medium hover:underline"
            >
              thenethraapp@gmail.com
            </a>
          </div>

          {/* Socials */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BsLinkedin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Connect With Us</h3>
            <p className="text-gray-600 mb-6">Follow Nethra across platforms</p>
            <div className="flex justify-center space-x-6 text-blue-600">
              <a
                href="https://x.com/nethrahealth?s=11&t=Aceyv1eej2X9kqbdjf9e4w"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-800"
              >
                <BsTwitterX className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@nethrahealth?_t=ZS-8zTWrbV952v&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900"
              >
                <BsTiktok className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/nethrahealth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
              >
                <BsLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.facebook.com/share/1CiRPEVpyh/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <BsFacebook className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="px-6 py-20 bg-vividblue">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Let’s Build the Future Together</h2>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed">
            Whether you’re a patient, optometrist, or partner,
            Nethra is here to connect and collaborate.
          </p>
          <a
            href="mailto:thenethraapp@gmail.com"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl shadow hover:bg-gray-100"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
