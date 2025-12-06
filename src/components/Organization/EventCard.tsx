import Image from "next/image";

interface EventCardProps {
  image: string;
  title: string;
  date: string;
}

export function EventCard({ image, title, date }: EventCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
      <Image
        className="w-[55px] h-[55px] rounded-lg object-cover"
        alt={title}
        src={image}
        width={55}
        height={55}
      />
      <div>
        <div className="font-outfit font-semibold text-[#0e1f35] text-sm leading-[21px]">
          {title}
        </div>
        <div className="font-outfit font-normal text-gray-500 text-xs leading-[18px] mt-1">
          {date}
        </div>
      </div>
    </div>
  );
}

