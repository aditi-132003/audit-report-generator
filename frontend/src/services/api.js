let mockAudits = [
  { id: 1, title: 'Q1 Financial Audit', category: 'Finance', status: 'Completed', score: 92, date: '2026-03-15' },
  { id: 2, title: 'Security Compliance', category: 'Security', status: 'In Progress', score: null, date: '2026-04-10' },
  { id: 3, title: 'HR Policy Review', category: 'HR', status: 'Pending', score: null, date: '2026-04-25' },
  { id: 4, title: 'IT Infrastructure', category: 'IT', status: 'Pending', score: null, date: '2026-05-01' },
  { id: 5, title: 'Q2 Financial Audit', category: 'Finance', status: 'Pending', score: null, date: '2026-06-15' },
];

export const login = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        resolve({ data: { token: 'mock-jwt-token-12345' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

export const getAudits = async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc', search = '', status = '', startDate = '', endDate = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter
      let filteredAudits = mockAudits.filter(a => {
        let matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
        let matchesStatus = status ? a.status === status : true;
        let matchesDate = true;
        if (startDate && a.date < startDate) matchesDate = false;
        if (endDate && a.date > endDate) matchesDate = false;
        return matchesSearch && matchesStatus && matchesDate;
      });

      // Sort
      let sortedAudits = filteredAudits.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        
        if (valA === null && valB === null) return 0;
        if (valA === null) return sortDir === 'asc' ? 1 : -1;
        if (valB === null) return sortDir === 'asc' ? -1 : 1;
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      // Paginate
      const start = page * size;
      const paginatedData = sortedAudits.slice(start, start + size);
      
      resolve({ 
        data: {
          content: paginatedData,
          totalPages: Math.ceil(sortedAudits.length / size),
          totalElements: sortedAudits.length,
          size: size,
          number: page
        } 
      });
    }, 800);
  });
};

export const getAuditById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const audit = mockAudits.find(a => a.id === parseInt(id));
      if (audit) resolve({ data: audit });
      else reject(new Error('Audit not found'));
    }, 500);
  });
};

export const createAudit = async (auditData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAudit = { ...auditData, id: Date.now(), score: null, status: 'Pending', date: new Date().toISOString().split('T')[0] };
      mockAudits.push(newAudit);
      resolve({ data: newAudit });
    }, 800);
  });
};

export const updateAudit = async (id, auditData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockAudits.findIndex(a => a.id === parseInt(id));
      if (index !== -1) {
        mockAudits[index] = { ...mockAudits[index], ...auditData };
        resolve({ data: mockAudits[index] });
      } else {
        reject(new Error('Audit not found'));
      }
    }, 800);
  });
};

export const deleteAudit = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAudits = mockAudits.filter(a => a.id !== parseInt(id));
      resolve({ data: { success: true } });
    }, 800);
  });
};

export const getStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          total: mockAudits.length,
          completed: mockAudits.filter(a => a.status === 'Completed').length,
          avgScore: 92,
          pending: mockAudits.filter(a => a.status === 'Pending').length,
          categoryData: [
            { name: 'Finance', value: mockAudits.filter(a => a.category === 'Finance').length },
            { name: 'Security', value: mockAudits.filter(a => a.category === 'Security').length },
            { name: 'HR', value: mockAudits.filter(a => a.category === 'HR').length },
            { name: 'IT', value: mockAudits.filter(a => a.category === 'IT').length }
          ],
          statusData: [
            { name: 'Completed', value: mockAudits.filter(a => a.status === 'Completed').length },
            { name: 'In Progress', value: mockAudits.filter(a => a.status === 'In Progress').length },
            { name: 'Pending', value: mockAudits.filter(a => a.status === 'Pending').length }
          ]
        }
      });
    }, 800);
  });
};

export const getAnalytics = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          categoryData: [
            { name: 'Finance', value: 12 },
            { name: 'Security', value: 8 },
            { name: 'HR', value: 5 },
            { name: 'IT', value: 10 }
          ],
          statusData: [
            { name: 'Completed', value: 15 },
            { name: 'In Progress', value: 10 },
            { name: 'Pending', value: 10 }
          ],
          trendData: [
            { month: 'Jan', count: 4 },
            { month: 'Feb', count: 6 },
            { month: 'Mar', count: 5 },
            { month: 'Apr', count: 8 },
            { month: 'May', count: 12 }
          ]
        }
      });
    }, 800);
  });
};

export const askAI = async (auditId, question) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error("AI service timeout."));
      } else {
        resolve({
          data: {
            answer: `Based on the audit report, here is an analysis regarding "${question}". The key findings suggest we need to review internal controls and update compliance protocols.`,
            confidence: 0.89,
            model_used: "LLaMA-3.3-70b"
          }
        });
      }
    }, 1500);
  });
};
