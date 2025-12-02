export interface FAQItem {
    id: number;
    question: string;
    answer: string;
  }
  
  export const faqData: FAQItem[] = [
    { 
      id: 1, 
      question: "How do I know if an optometrist is verified on Nethra?", 
      answer: "All optometrists undergo strict verification including license checks, credential validation, and professional background review. Verified doctors carry a blue checkmark badge on their profiles, so you can trust their expertise." 
    },
    { 
      id: 2, 
      question: "How long does it take to book an appointment?", 
      answer: "Booking takes less than 3 minutes. You'll see real-time availability, select a convenient slot, and receive instant confirmation — no waiting calls or back-and-forth." 
    },
    { 
      id: 3, 
      question: "Are my health records secure on Nethra?", 
      answer: "Yes. We use bank-level encryption and comply with international health data protection standards. Your records are private, secure, and only shared with the optometrists you choose." 
    },
    { 
      id: 4, 
      question: "Can I access my eye care history from previous visits?", 
      answer: "Absolutely. Your prescriptions, reports, and test results are stored in a personal digital health wallet. You can access them anytime and share with any verified optometrist on Nethra." 
    },
    { 
      id: 5, 
      question: "What payment methods do you accept for appointments?", 
      answer: "We support multiple payment methods including debit/credit cards, bank transfers, mobile money, and USSD. All payments are processed securely and only after your booking is confirmed." 
    },
    { 
      id: 6, 
      question: "Can I cancel or reschedule my appointment?", 
      answer: "Yes. You can cancel or reschedule up to 2 hours before your appointment through your dashboard. Both you and your optometrist will receive instant updates." 
    },
    { 
      id: 7, 
      question: "Do you offer telemedicine consultations?", 
      answer: "Yes. Many optometrists on Nethra provide virtual consultations for follow-ups, prescriptions, and initial checks. All video calls are encrypted and run directly on our secure platform." 
    },
    { 
      id: 8, 
      question: "Is Nethra available everywhere in Nigeria?", 
      answer: "Nethra is accessible nationwide. You can connect with optometrists in major cities and growing communities. We are continuously expanding to ensure eye care access for all Nigerians." 
    },
    { 
      id: 9, 
      question: "What if I need urgent or emergency eye care?", 
      answer: "Nethra is designed for routine and scheduled care, not emergencies. For urgent situations, we recommend visiting the nearest hospital or emergency eye clinic immediately." 
    },
    { 
      id: 10, 
      question: "Can hospitals or clinics use Nethra?", 
      answer: "Yes. Nethra partners with clinics, hospitals, and diagnostic centers to streamline bookings, digital records, and patient care across Nigeria." 
    },
  ];
  