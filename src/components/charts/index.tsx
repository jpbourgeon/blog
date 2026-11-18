import BrowserOnly from '@docusaurus/BrowserOnly';
import {
  Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, Legend,
  Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

export type ChartDatum = {name: string; value: number};

type Props = {
  data: ChartDatum[];
  height?: number;
  unit?: string;
};

function ChartFallback({data, unit = ''}: Pick<Props, 'data' | 'unit'>) {
  return (
    <table>
      <thead><tr><th>Catégorie</th><th>Valeur</th></tr></thead>
      <tbody>
        {data.map(({name, value}) => (
          <tr key={name}><td>{name}</td><td>{value} {unit}</td></tr>
        ))}
      </tbody>
    </table>
  );
}

export function BarChart({data, height = 300, unit = ''}: Props) {
  return (
    <BrowserOnly fallback={<ChartFallback data={data} unit={unit} />}>
      {() => (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit={unit} />
            <Tooltip />
            <Bar dataKey="value" fill="var(--ifm-color-primary)" />
          </RechartsBarChart>
        </ResponsiveContainer>
      )}
    </BrowserOnly>
  );
}

export function LineChart({data, height = 300, unit = ''}: Props) {
  return (
    <BrowserOnly fallback={<ChartFallback data={data} unit={unit} />}>
      {() => (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} accessibilityLayer>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit={unit} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="var(--ifm-color-primary)" />
          </RechartsLineChart>
        </ResponsiveContainer>
      )}
    </BrowserOnly>
  );
}

export function PieChart({data, height = 300}: Omit<Props, 'unit'>) {
  return (
    <BrowserOnly fallback={<ChartFallback data={data} />}>
      {() => (
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart accessibilityLayer>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="75%">
              {data.map((item, index) => (
                <Cell key={item.name} fill={`hsl(${(index * 137.508) % 360} 55% 48%)`} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
    </BrowserOnly>
  );
}
