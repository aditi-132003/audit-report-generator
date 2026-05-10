import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Calendar, ArrowUpRight } from 'lucide-react';

const COLORS = ['#1B4F8A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
const GRADIENTS = [
  { from: '#1B4F8A', to: '#3B82F6' },
  { from: '#10B981', to: '#059669' },
  { from: '#F59E0B', to: '#D97706' }
];

export default function Analytics() {
  const [data, setData] = useState({
    categoryData: [],
    statusData: [],
    trendData: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('6m');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await getAnalytics(period);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="h-96 bg-white rounded-[32px] border border-slate-100"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-white rounded-[32px] border border-slate-100"></div>
          <div className="h-80 bg-white rounded-[32px] border border-slate-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-slate-500 mt-1">Deep insights into organizational compliance and audit performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {['1m', '3m', '6m', '1y'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                period === p ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Area Chart */}
        <div className="lg:col-span-12 glass-card p-8 rounded-[32px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Audit Volume Trend</h2>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
              <ArrowUpRight size={14} />
              <span>+24% Growth</span>
            </div>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}}
                  cursor={{stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Total Audits" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="lg:col-span-7 glass-card p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <BarChart3 size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Categorical Distribution</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" name="Count" fill="#3B82F6" radius={[8, 8, 0, 0]} barSize={45}>
                  {data.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="lg:col-span-5 glass-card p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <PieChartIcon size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Current Status</h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
