import { useEffect, useState } from 'react';
import { getStats, getAudits } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  ClipboardList, CheckCircle2, Clock, BarChart3, 
  ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle 
} from 'lucide-react';

const COLORS = ['#1B4F8A', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];
const STATUS_COLORS = {
  'Completed': '#10b981',
  'In Progress': '#3b82f6',
  'Pending': '#f59e0b'
};

const KPI_BG_COLORS = {
  blue: 'bg-blue-50',
  emerald: 'bg-emerald-50',
  amber: 'bg-amber-50',
  indigo: 'bg-indigo-50'
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: null,
    completed: null,
    pending: null,
    avgScore: null,
    categoryData: [],
    statusData: []
  });
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, auditsRes] = await Promise.all([
          getStats(),
          getAudits(0, 5, 'date', 'desc')
        ]);
        
        setStats({
          total: statsRes.data.total ?? 0,
          completed: statsRes.data.completed ?? 0,
          pending: statsRes.data.pending ?? 0,
          avgScore: statsRes.data.avgScore ?? 0,
          categoryData: statsRes.data.categoryData ?? [],
          statusData: statsRes.data.statusData ?? []
        });
        setRecentAudits(auditsRes.data.content || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    { 
      label: 'Total Audits', 
      value: stats.total, 
      icon: <ClipboardList className="text-blue-600" />, 
      trend: '+12%', 
      trendUp: true,
      color: 'blue'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: <CheckCircle2 className="text-emerald-600" />, 
      trend: '+5%', 
      trendUp: true,
      color: 'emerald'
    },
    { 
      label: 'Pending', 
      value: stats.pending, 
      icon: <Clock className="text-amber-600" />, 
      trend: '-2%', 
      trendUp: false,
      color: 'amber'
    },
    { 
      label: 'Avg Score', 
      value: stats.avgScore ? `${stats.avgScore}%` : null, 
      icon: <BarChart3 className="text-indigo-600" />, 
      trend: '+3%', 
      trendUp: true,
      color: 'indigo'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-96 bg-white rounded-2xl border border-slate-100"></div>
          <div className="h-96 bg-white rounded-2xl border border-slate-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time overview of your audit ecosystem performance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <TrendingUp size={16} className="text-emerald-500" />
          <span>System Healthy</span>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${KPI_BG_COLORS[kpi.color] || 'bg-slate-50'}`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center text-xs font-bold ${kpi.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-sm font-medium">{kpi.label}</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{kpi.value ?? '—'}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Audits by Category</h2>
            <select className="text-xs font-semibold bg-slate-50 border-none rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="value" fill="#1B4F8A" radius={[6, 6, 0, 0]} barSize={45}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900">Completion Status</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Done
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Pending
              </div>
            </div>
          </div>
          <div className="h-80 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-xs text-slate-500 font-medium">Total Items</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Audit Activity</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAudits.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/audits/${audit.id}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{audit.title}</div>
                    <div className="text-xs text-slate-400">ID: #{audit.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600">{audit.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      audit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                      audit.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {audit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-bold ${
                      audit.score >= 90 ? 'text-emerald-600' :
                      audit.score >= 70 ? 'text-blue-600' :
                      audit.score ? 'text-rose-600' : 'text-slate-400'
                    }`}>
                      {audit.score ? `${audit.score}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-500 font-medium">
                    {audit.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
