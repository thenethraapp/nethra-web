import React from "react";
import Image from "next/image";
import NethraLogo from "../../../../public/logos/logoDark.svg";
import { useRouter } from "next/router";

interface LogoProps {
    width?: number;
    height?: number;
}

const LogoDark = ({
    width = 120,
    height = 40
}: LogoProps) => {

  const router = useRouter();

  return (
    <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
      <Image
        src={NethraLogo}
        alt="Nethra Logo"
        width={width}
        height={height}
        priority
      />
    </div>
  );
};
export default LogoDark;