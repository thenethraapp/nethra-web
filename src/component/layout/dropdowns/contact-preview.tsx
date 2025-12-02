"use client";
import Link from "next/link";
import { FaWhatsapp, FaInstagram, FaFacebook, FaTwitter, FaLinkedin, FaTiktok } from "react-icons/fa";

const ContactPreview = () => {
  const socialLinks = [
    { name: "WhatsApp", icon: FaWhatsapp, url: "https://wa.me/2349113501452", color: "hover:text-green-500" },
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/nethrahealth", color: "hover:text-pink-500" },
    { name: "Facebook", icon: FaFacebook, url: "https://www.facebook.com/share/1CiRPEVpyh/?mibextid=wwXIfr", color: "hover:text-blue-600" },
    { name: "Twitter", icon: FaTwitter, url: "https://x.com/nethrahealth?s=11&t=Aceyv1eej2X9kqbdjf9e4w", color: "hover:text-blue-400" },
    { name: "LinkedIn", icon: FaLinkedin, url: "https://www.linkedin.com/company/nethrahealth/", color: "hover:text-blue-700" },
    { name: "TikTok", icon: FaTiktok, url: "https://tiktok.com/@nethrahealth", color: "hover:text-black" },
  ];

  return (
    <section className="bg-white shadow-xl rounded-2xl w-full max-w-md md:max-w-2xl p-3 border border-gray-100 transition-all duration-300">
      <div>
        <div className="col-span-3 bg-primary-darkcyan rounded-2xl p-4 flex flex-col gap-3">
          <div className="bg-white/10 rounded-xl p-6 flex items-center justify-center h-36 md:h-48">
            <div className="grid grid-cols-3 gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 group"
                >
                  <social.icon className="text-white text-xl group-hover:text-primary-darkcyan transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm md:text-base leading-snug mb-2">
              Connect With Us
            </h4>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/80 text-white text-xs md:text-sm rounded-full px-4 py-2 font-medium hover:bg-white hover:text-darkgray transition-all duration-300"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPreview;