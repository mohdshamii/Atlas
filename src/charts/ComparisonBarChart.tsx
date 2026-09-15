import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface Props {
  data: { name: string; value: number | null }[];
  unit?: string;
  color?: string;
  height?: number;
  highlightIndex?: number;
  highlightColor?: string;
}

export default function ComparisonBarChart({
  data,
  unit = '',
  color = '#5B6EE8',
  height = 260,
  highlightIndex,
  highlightColor = '#D98E30',
}: Props) {
  const cleaned = data.map((d) => ({ ...d, value: d.value ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={cleaned} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#212A3E" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#75839F', fontSize: 11 }} axisLine={{ stroke: '#212A3E' }} tickLine={false} />
        <YAxis tick={{ fill: '#75839F', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{ background: '#161C2C', border: '1px solid #212A3E', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#EEF1F6' }}
          formatter={(value: number) => [`${value.toLocaleString('en-IN')} ${unit}`, 'Value']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {cleaned.map((_, i) => (
            <Cell key={i} fill={i === highlightIndex ? highlightColor : color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
