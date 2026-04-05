interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  valueColor?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  index?: number;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  valueColor = "#EAF0FF",
  icon,
  trend,
  trendValue,
  index = 1,
}: MetricCardProps) {
  const trendColor =
    trend === "up" ? "#2ED47A" : trend === "down" ? "#FF5A5F" : "#E7D27C";

  return (
    <div data-ocid={`metrics.item.${index}`} className="trading-card p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9AA8C1]">
          {title}
        </span>
        {icon && <span className="text-[#9AA8C1]">{icon}</span>}
      </div>
      <div
        className="text-2xl font-bold tabular-nums mt-1"
        style={{ color: valueColor }}
      >
        {value}
      </div>
      {(subtitle || trendValue) && (
        <div className="flex items-center gap-2 mt-1">
          {subtitle && (
            <span className="text-[11px] text-[#9AA8C1]">{subtitle}</span>
          )}
          {trendValue && (
            <span
              className="text-[11px] font-semibold"
              style={{ color: trendColor }}
            >
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
