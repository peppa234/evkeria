import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatar?: string;
}

export function ProfileHeader({ name, email, avatar }: ProfileHeaderProps) {
  return (
    <div className="flex items-center gap-6 mb-8">
      {avatar && (
        <Image
          src={avatar}
          alt={name}
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
      <div>
        <h1 className="font-outfit font-semibold text-3xl text-[#1e4e79] mb-2">
          {name}
        </h1>
        <p className="font-outfit text-[#4fa3e3]">{email}</p>
      </div>
    </div>
  );
}

