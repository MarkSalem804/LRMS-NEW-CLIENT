import PropTypes from "prop-types";
import { BookOpen, Download, Eye, Star, Layers } from "lucide-react";
import { cn } from "@/components/shadcn-components/utils";

// Simple Card components if Card doesn't exist
const Card = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

CardTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function StatItem({ stat }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div style={{ color: stat.color }}>{stat.icon}</div>
        <span className="text-xs text-white">{stat.label}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold text-white">
          {stat.displayValue}
        </span>
        <span className="text-xs text-gray-400 ml-auto">
          {stat.percentage}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-teal-900/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(stat.percentage, 100)}%`,
            backgroundColor: stat.color,
          }}
        />
      </div>
    </div>
  );
}

StatItem.propTypes = {
  stat: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    displayValue: PropTypes.string.isRequired,
    percentage: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
  }).isRequired,
};

export function StatsCard({ title, icon, stats, className }) {
  return (
    <Card
      className={`${className} relative overflow-hidden bg-gray-900 border-gray-800`}
    >
      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg text-white">
            <div className="text-cyan-400">{icon}</div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {stats.map((stat, index) => (
              <StatItem key={index} stat={stat} />
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      displayValue: PropTypes.string.isRequired,
      percentage: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

StatsCard.defaultProps = {
  icon: null,
  className: "",
};

// Pre-configured card for Modules
export function ModulesStatsCard() {
  const stats = [
    {
      label: "Total Count",
      value: 48,
      displayValue: "48",
      percentage: 80,
      color: "hsl(221, 83%, 53%)",
      icon: <Layers className="h-3 w-3" />,
    },
    {
      label: "Avg. Rating",
      value: 4.5,
      displayValue: "4.5/5",
      percentage: 90,
      color: "hsl(43, 96%, 56%)",
      icon: <Star className="h-3 w-3" />,
    },
    {
      label: "Total Views",
      value: 12450,
      displayValue: "12.4K",
      percentage: 75,
      color: "hsl(142, 71%, 45%)",
      icon: <Eye className="h-3 w-3" />,
    },
    {
      label: "Downloads",
      value: 3280,
      displayValue: "3.2K",
      percentage: 65,
      color: "hsl(346, 77%, 50%)",
      icon: <Download className="h-3 w-3" />,
    },
  ];

  return (
    <StatsCard
      title="Modules"
      icon={<BookOpen className="h-5 w-5 text-primary" />}
      stats={stats}
    />
  );
}
