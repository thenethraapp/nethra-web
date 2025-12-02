"use client";
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import DotLoader from "@/component/common/UI/DotLoader";

const RegisterPatient = dynamic(() => import('./_patient'), {
  loading: () => <DotLoader />,
});

const RegisterOptometrist = dynamic(() => import('./_optometrist'), {
  loading: () => <DotLoader />,
});

const RegisterUser = () => {
  const router = useRouter();
  const { user } = router.query;

  const userType = Array.isArray(user) ? user[0] : user;

  if (!router.isReady) {
    return <DotLoader />;
  }

  if (!userType) {
    return (
      <>
        <Head>
          <title>Patient Registration - Nethra</title>
          <meta name="description" content="Register as a patient on Nethra to find and consult with professional optometrists" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <RegisterPatient />
      </>
    );
  }

  // Patient registration
  if (userType === 'patient') {
    return (
      <>
        <Head>
          <title>Patient Registration - Nethra</title>
          <meta name="description" content="Register as a patient on Nethra to find and consult with professional optometrists" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <RegisterPatient />
      </>
    );
  }

  // Optometrist registration
  if (userType === 'optometrist') {
    return (
      <>
        <Head>
          <title>Optometrist Registration - Nethra</title>
          <meta name="description" content="Register as an optometrist on Nethra to provide professional eye care consultations" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <RegisterOptometrist />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Patient Registration - Nethra</title>
        <meta name="description" content="Register as a patient on Nethra to find and consult with professional optometrists" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <RegisterPatient />
    </>
  );

};

export default RegisterUser;