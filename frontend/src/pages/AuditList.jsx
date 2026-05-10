import { useState, useEffect, useRef } from 'react';
import { getAudits } from '../services/api';
import { 
  Search, Filter, MoreVertical, ChevronUp, ChevronDown, 
  Download, Plus, Calendar, FileText, CheckCircle2,
  Clock, AlertCircle
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

export default function AuditList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '0'));
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'id');
  const [sortDir, setSortDir] = useState(searchParams.get('sortDir') || 'asc');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const debounceTimeout = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 0) params.set('page', page);
    if (sortBy !== 'id') params.set('sortBy', sortBy);
    if (sortDir !== 'asc') params.set('sortDir', sortDir);
    if (searchQuery) params.set('q', searchQuery);
    if (statusFilter) params.set('status', statusFilter);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    
    setSearchParams(params, { replace: true });
  }, [page, sortBy, sortDir, searchQuery, statusFilter, startDate, endDate, setSearchParams]);

  useEffect(() => {
    const fetchAudits = async () => {
      setLoading(true);
      try {
        const response = await getAudits(page, size, sortBy, sortDir, searchQuery, statusFilter, startDate, endDate);
        setAudits(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.error('Failed to fetch audits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, [page, size, sortBy, sortDir, searchQuery, statusFilter, startDate, endDate]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearchQuery(val);
      setPage(0);
    }, 300);
  };

  const handleExportCSV = () => {
    if (audits.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Status', 'Date', 'Score'];
    const csvContent = [
      headers.join(','),
      ...audits.map(a => `${a.id},"${a.title}","${a.category}","${a.status}",${a.date},${a.score || ''}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audits_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return <div className="w-4 h-4" />;
    return sortDir === 'asc' 
      ? <ChevronUp size={16} className="text-blue-600 animate-in" /> 
      : <ChevronDown size={16} className="text-blue-600 animate-in" />;
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Audit Directory</h1>
          <p className="text-slate-500 mt-1">Manage and track all organizational audit reports in one place.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV} 
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
          >
            <Download size={18} /> Export Data
          </button>
          <Link 
            to="/audits/new" 
            className="flex items-center gap-2 premium-gradient text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:scale-[1.02]"
          >
            <Plus size={20} /> New Audit
          </Link>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-slate-100 shadow-2xl shadow-slate-200/50">
        {/* Filters Header */}
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center gap-6">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              placeholder="Filter by title, category, or ID..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-700 shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <Filter size={16} className="text-slate-400" />
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer min-w-[120px]"
              >
                <option value="">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                  className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer w-28"
                />
                <span className="text-slate-300">—</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                  className="bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer w-28"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-6 py-5">
                  <button 
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('id')}
                  >
                    REF ID {renderSortIcon('id')}
                  </button>
                </th>
                <th className="px-6 py-5">
                  <button 
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('title')}
                  >
                    Report Title {renderSortIcon('title')}
                  </button>
                </th>
                <th className="px-6 py-5">
                  <button 
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('category')}
                  >
                    Category {renderSortIcon('category')}
                  </button>
                </th>
                <th className="px-6 py-5 text-center">
                  <button 
                    className="flex items-center justify-center gap-2 w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('status')}
                  >
                    Current Status {renderSortIcon('status')}
                  </button>
                </th>
                <th className="px-6 py-5">
                  <button 
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('date')}
                  >
                    Issued Date {renderSortIcon('date')}
                  </button>
                </th>
                <th className="px-6 py-5">
                  <button 
                    className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                    onClick={() => handleSort('score')}
                  >
                    Audit Score {renderSortIcon('score')}
                  </button>
                </th>
                <th className="px-6 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array(size).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-12"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                    <td className="px-6 py-6"><div className="h-6 bg-slate-50 rounded-lg w-20"></div></td>
                    <td className="px-6 py-6"><div className="mx-auto h-6 bg-slate-50 rounded-full w-24"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-24"></div></td>
                    <td className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-10"></div></td>
                    <td className="px-6 py-6"></td>
                  </tr>
                ))
              ) : audits.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <FileText className="text-slate-300" size={40} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
                      <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your filters or search query to find the reports you need.</p>
                      <button 
                        onClick={() => { setSearchQuery(''); setStatusFilter(''); setStartDate(''); setEndDate(''); }}
                        className="mt-2 text-blue-600 font-bold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                audits.map((audit) => (
                  <tr key={audit.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/audits/${audit.id}`)}>
                    <td className="px-6 py-6">
                      <span className="text-xs font-black text-slate-400 tracking-tighter group-hover:text-blue-600 transition-colors">#{audit.id}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{audit.title}</div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-bold text-slate-500">{audit.category}</span>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                        audit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        audit.status === 'In Progress' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                        'bg-amber-50 text-amber-700 ring-amber-600/20'
                      }`}>
                        {audit.status === 'Completed' ? <CheckCircle2 size={12} /> : 
                         audit.status === 'In Progress' ? <Clock size={12} /> : 
                         <AlertCircle size={12} />}
                        {audit.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-600">
                      {audit.date}
                    </td>
                    <td className="px-6 py-6">
                      <div className={`text-sm font-black ${
                        audit.score >= 90 ? 'text-emerald-500' :
                        audit.score >= 70 ? 'text-blue-500' :
                        audit.score ? 'text-rose-500' : 'text-slate-300'
                      }`}>
                        {audit.score !== null ? `${audit.score}%` : 'Pending'}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="p-2 text-slate-300 group-hover:text-slate-900 group-hover:bg-white rounded-lg shadow-none group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
                        <MoreVertical size={18} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-slate-900">{audits.length > 0 ? page * size + 1 : 0}</span> to <span className="text-slate-900">{Math.min((page + 1) * size, totalElements)}</span> of <span className="text-slate-900">{totalElements}</span> logs
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(0, p - 1)); }}
              disabled={page === 0 || loading}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronDown size={20} className="rotate-90" />
            </button>
            <div className="flex items-center px-4 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-900 shadow-sm">
              PAGE {page + 1} OF {totalPages || 1}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(totalPages - 1, p + 1)); }}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronUp size={20} className="rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
