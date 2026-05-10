import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createAudit, getAuditById, updateAudit } from '../services/api';
import { 
  ArrowLeft, FilePlus, Save, X, Info, 
  ShieldCheck, Briefcase, Users, Laptop,
  CheckCircle2, Clock, AlertCircle, ChevronDown, RefreshCw
} from 'lucide-react';

export default function AuditForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Finance',
    status: 'Pending',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!editId);

  useEffect(() => {
    if (editId) {
      const fetchAudit = async () => {
        try {
          const response = await getAuditById(editId);
          setFormData({
            title: response.data.title,
            category: response.data.category,
            status: response.data.status,
            description: response.data.description || '',
          });
        } catch (error) {
          console.error('Failed to fetch audit for edit:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAudit();
    }
  }, [editId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Audit title is required';
    if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Report summary/description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      if (editId) {
        await updateAudit(editId, formData);
      } else {
        await createAudit({ ...formData, date: new Date().toISOString().split('T')[0], score: null });
      }
      navigate('/audits');
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Security Protocol: Failed to transmit audit data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const categories = [
    { value: 'Finance', icon: <Briefcase size={16} /> },
    { value: 'Security', icon: <ShieldCheck size={16} /> },
    { value: 'HR', icon: <Users size={16} /> },
    { value: 'IT', icon: <Laptop size={16} /> }
  ];

  const statuses = [
    { 
      value: 'Pending', 
      icon: <AlertCircle size={14} />, 
      activeClass: 'bg-amber-50 border-amber-200 text-amber-700 ring-2 ring-amber-100' 
    },
    { 
      value: 'In Progress', 
      icon: <Clock size={14} />, 
      activeClass: 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100' 
    },
    { 
      value: 'Completed', 
      icon: <CheckCircle2 size={14} />, 
      activeClass: 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-100' 
    }
  ];

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
        <div className="h-[500px] bg-white rounded-3xl border border-slate-100"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in">
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <div className="mr-3 p-2 rounded-full group-hover:bg-slate-100 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {editId ? 'Modify Audit Entry' : 'Initiate New Audit'}
          </h1>
          <p className="text-slate-500 mt-1">
            {editId ? 'Updating existing compliance records.' : 'Fill in the structured data fields for your new assessment.'}
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="p-8 bg-gradient-to-br from-white to-slate-50/30">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-2">
                <label htmlFor="title" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <FilePlus size={14} /> Audit Title & Reference
                </label>
                <input 
                  id="title"
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Q3 Infrastructure Security Review"
                  className={`w-full px-5 py-4 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold text-slate-700 shadow-sm ${
                    errors.title ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200'
                  }`}
                />
                {errors.title && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.title}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Classification
                </label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-5 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-semibold text-slate-700 shadow-sm cursor-pointer transition-all"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.value}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Execution Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: s.value }))}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                        formData.status === s.value 
                          ? s.activeClass
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {s.icon}
                      <span className="text-[10px] font-black uppercase tracking-tighter">{s.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  Executive Summary & Scope
                </label>
                <textarea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5" 
                  placeholder="Provide a detailed overview of the audit scope, methodology, and primary objectives..."
                  className={`w-full px-5 py-4 bg-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700 shadow-sm resize-none ${
                    errors.description ? 'border-rose-300 ring-2 ring-rose-50' : 'border-slate-200'
                  }`}
                ></textarea>
                {errors.description && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{errors.description}</p>}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3 text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">Audit protocol: V1.2.4 Active</span>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  type="button" 
                  onClick={() => navigate(-1)} 
                  className="flex-1 md:flex-none px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 premium-gradient text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Transmitting...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> {editId ? 'Update Record' : 'Log Audit'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
