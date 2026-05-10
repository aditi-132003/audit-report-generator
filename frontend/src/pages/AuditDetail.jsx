import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAuditById, askAI, deleteAudit } from '../services/api';
import { 
  ArrowLeft, Edit2, Trash2, Bot, AlertCircle, RefreshCw, 
  Send, Sparkles, User, ShieldCheck, Zap, MessageSquare 
} from 'lucide-react';

export default function AuditDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI Panel State
  const [aiQuestion, setAiQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Hello! I am your AI Audit Assistant. How can I help you analyze this report today?' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    const fetchAudit = async () => {
      setLoading(true);
      try {
        const response = await getAuditById(id);
        setAudit(response.data);
      } catch (error) {
        console.error('Failed to fetch audit:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudit();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this audit?')) {
      try {
        await deleteAudit(id);
        navigate('/audits');
      } catch (error) {
        console.error('Failed to delete audit:', error);
      }
    }
  };

  const handleAskAI = async (questionOverride) => {
    const question = questionOverride || aiQuestion;
    if (!question.trim()) return;
    
    const newUserMessage = { role: 'user', content: question };
    setChatHistory(prev => [...prev, newUserMessage]);
    setAiQuestion('');
    setAiLoading(true);
    setAiError(false);
    
    try {
      const response = await askAI(id, question);
      
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.answer,
        meta: {
          confidence: response.data.confidence,
          model: response.data.model_used
        }
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Request failed:', error);
      setAiError(true);
      setChatHistory(prev => [...prev, { role: 'system', content: 'Error: Failed to connect to AI service. Please try again.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const suggestions = [
    { label: 'Summarize Findings', icon: <Sparkles size={14} /> },
    { label: 'Identify Top Risks', icon: <ShieldCheck size={14} /> },
    { label: 'Actionable Advice', icon: <Zap size={14} /> }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-pulse">
        <div className="rounded-full h-16 w-16 bg-slate-200 mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="text-center py-12 glass-card rounded-2xl mx-auto max-w-lg">
        <AlertCircle className="mx-auto h-16 w-16 text-slate-300 mb-6" />
        <h3 className="text-xl font-bold text-slate-900">Audit Not Found</h3>
        <p className="text-slate-500 mt-2">This report has been moved or deleted.</p>
        <Link to="/audits" className="mt-6 inline-flex items-center text-blue-600 font-semibold hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/audits')}
          className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <div className="mr-3 p-2 rounded-full group-hover:bg-slate-100 transition-colors">
            <ArrowLeft size={18} />
          </div>
          Return to Audit Logs
        </button>
        <div className="flex gap-3">
          <Link 
            to={`/audits/new?edit=${id}`}
            className="flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-all shadow-sm"
          >
            <Edit2 size={16} className="mr-2 text-blue-600" /> Modify
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center px-5 py-2.5 bg-white border border-rose-100 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-all shadow-sm"
          >
            <Trash2 size={16} className="mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-md">
                  {audit.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${
                  audit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                  audit.status === 'In Progress' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                  'bg-amber-50 text-amber-700 ring-amber-600/20'
                }`}>
                  {audit.status}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{audit.title}</h1>
              <p className="text-slate-400 mt-2 font-medium">Internal Audit Reference: #{audit.id}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center min-w-[140px]">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Audit Score</div>
              <div className={`text-4xl font-black ${
                audit.score >= 90 ? 'text-emerald-500' :
                audit.score >= 70 ? 'text-blue-500' :
                audit.score ? 'text-rose-500' : 'text-slate-300'
              }`}>
                {audit.score !== null ? `${audit.score}%` : '—'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Assessment Date</div>
              <div className="text-lg font-bold text-slate-800">{audit.date}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Assigned Dept</div>
              <div className="text-lg font-bold text-slate-800">{audit.category}</div>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="text-xs font-bold text-slate-400 uppercase">Compliance Level</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${audit.score >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${audit.score || 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-slate-600">{audit.score || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[600px] border-blue-100 shadow-blue-900/5 shadow-2xl">
            {/* Chat Header */}
            <div className="premium-gradient p-5 flex items-center justify-between shadow-lg relative z-10">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/30">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">AI Audit Intelligence</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Active • LLaMA-3.3-70B</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white border-blue-700' 
                        : msg.role === 'assistant' 
                        ? 'bg-white text-blue-600 border-slate-100'
                        : 'bg-slate-800 text-white border-slate-900'
                    }`}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                      }`}>
                        {msg.content}
                      </div>
                      {msg.meta && (
                        <div className="flex items-center gap-3 px-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence: {Math.round(msg.meta.confidence * 100)}%</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Analysis</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="flex justify-start animate-in">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-10 h-10 rounded-2xl bg-white text-blue-600 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Bot size={20} />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              {!aiLoading && chatHistory.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAI(s.label)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                    >
                      {s.icon}
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="relative">
                <input 
                  type="text" 
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="Analyze this report... (e.g., 'What are the top 3 risks?')"
                  className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-700"
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                />
                <button 
                  onClick={() => handleAskAI()}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="absolute right-2 top-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">
                Protected by Tool‑24 Secure Gateway • Data Sanitzation Active
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
