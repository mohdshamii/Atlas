import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  data: { year: number; value: number | null }[];
  color?: string;
  unit?: string;
  height?: number;
}

export default function TrendChart({ data, color = '#D98E30', unit = '', height = 240 }: Props) {
  const hasData = data.some((d) => d.value != null);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center rounded-md border border-dashed border-base-700 text-sm text-base-500" style={{ height }}>
        No trend data available for this selection.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#212A3E" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: '#75839F', fontSize: 11 }} axisLine={{ stroke: '#212A3E' }} tickLine={false} />
        <YAxis
          tick={{ fill: '#75839F', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{ background: '#161C2C', border: '1px solid #212A3E', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#EEF1F6' }}
          formatter={(value: number) => [`${value.toLocaleString('en-IN')} ${unit}`, 'Value']}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
