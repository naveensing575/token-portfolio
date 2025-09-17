import React, { memo } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TableSparklineProps {
  data: number[];
  change24h: number;
}

const TableSparkline: React.FC<TableSparklineProps> = memo(({ data, change24h }) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-400 text-xs">No data</div>;
  }

  const chartData = data.map((y, i) => ({ x: i, y }));
  const strokeColor = change24h >= 0 ? "#4ade80" : "#f87171";

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={chartData}>
        <Line
          type="monotone"
          dataKey="y"
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});

TableSparkline.displayName = 'TableSparkline';

export default TableSparkline;