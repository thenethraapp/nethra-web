// eventually we will use this component to show user pfp, it will need the userId prop to async fetch the user profile picture

import Image from "next/image";


const UserAvatar = ({size = 64}: { size?: number}) => {
  return (
      <Image
        src="/icons/avatar.png"
        alt="User Avatar"
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
  )
}

export default UserAvatar;