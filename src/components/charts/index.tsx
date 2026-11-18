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

const axisTick = {fill: 'var(--ifm-font-color-base)', fontSize: 12};
const tooltipStyle = {
  backgroundColor: 'var(--ifm-background-surface-color)',
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: 'var(--ifm-global-radius)',
  color: 'var(--ifm-font-color-base)',
};
const tooltipTextStyle = {color: 'var(--ifm-font-color-base)'};
const pieColors = [
  'var(--ifm-color-primary-darkest)',
  'var(--ifm-color-primary-dark)',
  'var(--ifm-color-primary)',
  'var(--ifm-color-primary-light)',
  'var(--ifm-color-primary-lightest)',
];

function shortLabel(value: string) {
  return value.length > 12 ? `${value.slice(0, 11)}…` : value;
}

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
    <div className="editorial-chart">
      <BrowserOnly fallback={<ChartFallback data={data} unit={unit} />}>
        {() => (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsBarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--ifm-color-emphasis-300)" strokeDasharray="3 4" />
              <XAxis dataKey="name" tickFormatter={shortLabel} tick={axisTick} axisLine={false} tickLine={false} minTickGap={12} />
              <YAxis unit={unit} tick={axisTick} axisLine={false} tickLine={false} width={64} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipTextStyle} cursor={{fill: 'var(--ifm-color-emphasis-100)'}} />
              <Bar dataKey="value" fill="var(--ifm-color-primary)" maxBarSize={64} />
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </BrowserOnly>
    </div>
  );
}

export function LineChart({data, height = 300, unit = ''}: Props) {
  return (
    <div className="editorial-chart">
      <BrowserOnly fallback={<ChartFallback data={data} unit={unit} />}>
        {() => (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--ifm-color-emphasis-300)" strokeDasharray="3 4" />
              <XAxis dataKey="name" tickFormatter={shortLabel} tick={axisTick} axisLine={false} tickLine={false} minTickGap={12} />
              <YAxis unit={unit} tick={axisTick} axisLine={false} tickLine={false} width={64} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipTextStyle} />
              <Line type="monotone" dataKey="value" stroke="var(--ifm-color-primary)" strokeWidth={2} dot={{r: 3}} activeDot={{r: 5}} />
            </RechartsLineChart>
          </ResponsiveContainer>
        )}
      </BrowserOnly>
    </div>
  );
}

export function PieChart({data, height = 300}: Omit<Props, 'unit'>) {
  return (
    <div className="editorial-chart">
      <BrowserOnly fallback={<ChartFallback data={data} />}>
        {() => (
          <ResponsiveContainer width="100%" height={height}>
            <RechartsPieChart accessibilityLayer>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius="65%">
                {data.map((item, index) => (
                  <Cell key={item.name} fill={pieColors[index % pieColors.length]} stroke="var(--ifm-background-surface-color)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={tooltipTextStyle} />
              <Legend verticalAlign="bottom" />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </BrowserOnly>
    </div>
  );
}
