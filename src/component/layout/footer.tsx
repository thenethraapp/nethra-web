import React from "react";
import Link from "next/link";
import { IoChatbox, IoMailSharp } from "react-icons/io5";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
// import LogoDark from "../common/UI/LogoDark";
import Logo from "../common/UI/Logo";

const Footer = () => {
  return (
    <footer className="bg-[#0D1828] text-white px-6 md:px-10 pt-16 pb-10">
      <div className="max-width mx-auto border border-darkgray/5 mb-12" />
      <div className="max-width mx-auto border-b border-white/10 pb-12 mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12">
          {/* Brand Info */}
          <div className="flex-1 lg:max-w-2xl">
            <Logo />
            <h2 className="text-2xl md:text-3xl font-semibold mt-6 mb-4 text-white">
              Connecting Patients and Optometrists Seamlessly
            </h2>
            <p className="text-white/80 text-base leading-relaxed max-w-xl">
              Nethra is your trusted platform for accessible and reliable eye
              care. Whether you’re a patient seeking professional help or an
              optometrist building meaningful connections, we make eye care
              simpler, faster, and more collaborative.
            </p>
          </div>

          {/* Quick Links */}
          <div className="min-w-[230px]">
            <h3 className="text-xl font-semibold mb-5 border-b border-white/10 pb-3">
              Quick Links
            </h3>
            <ul className="space-y-3 text-white/80">
              {[
                { href: "/feed", label: "Find a Verified Doctor" },
                { href: "/about-us", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/terms", label: "Terms" },
                { href: "/privacy-policy", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-cyan transition-colors duration-200 text-base no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-xl">
          <Link
            href="/contact"
            className="bg-white text-darkgray flex items-center justify-center gap-2 hover:bg-white/80  font-medium rounded-full px-3 py-3 transition-all duration-300 shadow-md"
          >
            <IoChatbox size={20} />
            Contact Us
          </Link>

          <a
            href="mailto:thenethraapp@gmail.com"
            className="bg-white  flex items-center justify-center gap-2 hover:bg-white/70 text-darkgray font-medium rounded-full px-3 py-3 transition-all duration-300 shadow-md"
          >
            <IoMailSharp size={20} />
            Email Us
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="pt-6 max-width mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-sm text-white/70">
        {/* Social + Legal */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[
              {
                href: "https://www.instagram.com/nethrahealth",
                icon: <FaInstagram />,
              },
              {
                href: "https://www.linkedin.com/company/nethrahealth/",
                icon: <FaLinkedinIn />,
              },
              {
                href: "https://www.facebook.com/share/1CiRPEVpyh/?mibextid=wwXIfr",
                icon: <FaFacebook />,
              },
              {
                href: "https://x.com/nethrahealth?s=11&t=Aceyv1eej2X9kqbdjf9e4w",
                icon: <FaXTwitter />,
              },
            ].map(({ href, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary-cyan transition-colors duration-200"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center lg:text-right">
          © 2025 Nethra. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;