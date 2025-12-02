interface StatsCardProps {
    icon: React.ReactNode;
    title: string;
    count: number;
    color: string;
    bgColor: string;
  }
  
const StatsCard: React.FC<StatsCardProps> = ({ icon, title, count, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-grayblue text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-charcoal">{count}</p>
        </div>
        <div className={`${color} p-4 rounded-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

export default StatsCard;