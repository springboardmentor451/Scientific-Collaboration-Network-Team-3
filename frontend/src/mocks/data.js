export const mockResearchers = [
  { id: 'usr_1', name: 'Dr. Aris Thorne', department: 'Physics', institution: 'Institute of Quantum Computing' },
  { id: 'usr_2', name: 'Prof. Elena Rostova', department: 'Administration', institution: 'Institute of Quantum Computing' },
  { id: 'usr_3', name: 'Dr. James Chen', department: 'Computer Science', institution: 'Global Research Network' },
  { id: 'usr_5', name: 'Dr. Sarah J.', department: 'Physics', institution: 'Institute of Quantum Computing' },
];

export const mockPublications = [
  { id: 'pub_1', title: 'Quantum Entanglement in Macroscopic Systems', status: 'Published', authors: ['Dr. Aris Thorne', 'Dr. Sarah J.'], date: '2023-10-12', type: 'Paper' },
  { id: 'pub_2', title: 'Topological Insulators for Next-Gen Computing', status: 'Submitted', authors: ['Dr. Aris Thorne', 'Prof. Elena Rostova'], date: '2023-09-28', type: 'Paper' },
  { id: 'pub_3', title: 'Decoherence Metrics in Superconducting Qubits', status: 'Draft', authors: ['Dr. Aris Thorne'], date: '', type: 'Report' },
];

export const mockCollaborations = [
  { id: 'col_1', title: 'Topological Data Analysis', progress: 75, members: ['Dr. Aris Thorne', 'Dr. James Chen'] },
  { id: 'col_2', title: 'Neural Network Scalability', progress: 42, members: ['Dr. Aris Thorne', 'Prof. Elena Rostova'] },
];

export const mockConferences = [
  { id: 'conf_1', title: 'Global Network Analysis 2024', location: 'Geneva, Switzerland', date: '2024-11-12', status: 'Registered' },
  { id: 'conf_2', title: 'AI in Research Summit', location: 'Virtual Event', date: '2024-12-05', status: 'Upcoming' },
];

export const mockCitations = [
  { id: 'cit_1', publicationId: 'pub_1', citedBy: 'Nature Physics, Vol 19', date: '2023-11-01' },
];

export const mockDashboards = {
  'Researcher': {
    stats: { totalPublications: 42, activeProjects: 8, collaborators: 124, citations: 1200 },
    recentActivity: [
      { id: 1, text: 'New citation added to Quantum Dynamics', time: '2 hours ago', type: 'citation' },
      { id: 2, text: 'Dr. Sarah J. invited you to collaborate.', time: 'Yesterday', type: 'invite' },
      { id: 3, text: 'Manuscript Decoherence Metrics approved.', time: 'Oct 15, 2023', type: 'approval' }
    ]
  },
  'Institution Admin': {
    stats: { totalResearchers: 450, totalPublications: 1240, activeProjects: 85, citations: 15400 }
  },
  'Reviewer': {
    stats: { pendingReviews: 12, completedReviews: 85, averageTurnaround: '4.5 days' }
  },
  'System Admin': {
    stats: { totalUsers: 12500, activeInstitutions: 45, systemUptime: '99.99%' }
  }
};
