import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[var(--shadow-soft-ui)] hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 tracking-tight">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-gold-bg text-gold-accent flex items-center justify-center">
          <Icon size={24} />
        </div>
      </div>
      
      {trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span 
            className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
              isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
            {trendValue}
          </span>
          <span className="text-xs text-neutral-400 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
