'use client';

import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  subvalue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  subvalue,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 shadow-sm border border-gray-100',
        'hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>
          <p className="mt-2 text-4xl font-bold text-gray-900">{value}</p>
          {(subtitle || subvalue) && (
            <p className="mt-1 text-sm text-gray-500">
              {subvalue && (
                <span
                  className={cn(
                    'font-semibold',
                    trend === 'up' && 'text-green-600',
                    trend === 'down' && 'text-red-600',
                    trend === 'neutral' && 'text-gray-600'
                  )}
                >
                  {subvalue}
                </span>
              )}
              {subtitle && subvalue && ' · '}
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">{icon}</div>
        )}
      </div>
    </div>
  );
}
