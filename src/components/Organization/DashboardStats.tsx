interface DashboardStatsProps {
  totalEvents: number;
  activeEvents: number;
  totalViews: number;
}

export function DashboardStats({ totalEvents, activeEvents, totalViews }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="font-outfit font-semibold text-[#1e4e79] mb-2">Total Events</h3>
        <p className="font-outfit text-3xl text-[#4fa3e3]">{totalEvents}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="font-outfit font-semibold text-[#1e4e79] mb-2">Active Events</h3>
        <p className="font-outfit text-3xl text-[#4fa3e3]">{activeEvents}</p>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="font-outfit font-semibold text-[#1e4e79] mb-2">Total Views</h3>
        <p className="font-outfit text-3xl text-[#4fa3e3]">{totalViews}</p>
      </div>
    </div>
  );
}

