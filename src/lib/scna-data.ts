/**
 * SCNA placeholder dataset.
 * Pure presentation data for the Scientific Collaboration Network Analyzer UI.
 */

export type ResearcherStatus = "Active" | "On Leave" | "Visiting";

export interface Researcher {
  id: string;
  name: string;
  title: string;
  department: string;
  institution: string;
  email: string;
  publications: number;
  citations: number;
  hIndex: number;
  collaborators: number;
  status: ResearcherStatus;
  initials: string;
}

export const departments = [
  "Computational Biology",
  "Physics",
  "Materials Science",
  "Climate Science",
  "Computer Science",
  "Neuroscience",
] as const;

export const researchers: Researcher[] = [
  {
    id: "R-1041",
    name: "Dr. Amara Okonkwo",
    title: "Principal Investigator",
    department: "Computational Biology",
    institution: "Northfield Institute of Technology",
    email: "a.okonkwo@northfield.edu",
    publications: 87,
    citations: 4210,
    hIndex: 38,
    collaborators: 64,
    status: "Active",
    initials: "AO",
  },
  {
    id: "R-1077",
    name: "Prof. Lukas Brenner",
    title: "Chair of Quantum Optics",
    department: "Physics",
    institution: "ETH Ruhrland",
    email: "l.brenner@ethruhr.edu",
    publications: 142,
    citations: 9860,
    hIndex: 52,
    collaborators: 118,
    status: "Active",
    initials: "LB",
  },
  {
    id: "R-1102",
    name: "Dr. Mei-Lin Chao",
    title: "Senior Research Fellow",
    department: "Materials Science",
    institution: "Pacific Rim University",
    email: "m.chao@pacrim.edu",
    publications: 63,
    citations: 2980,
    hIndex: 29,
    collaborators: 47,
    status: "Visiting",
    initials: "MC",
  },
  {
    id: "R-1130",
    name: "Dr. Ines Ferreira",
    title: "Associate Professor",
    department: "Climate Science",
    institution: "Northfield Institute of Technology",
    email: "i.ferreira@northfield.edu",
    publications: 54,
    citations: 3125,
    hIndex: 31,
    collaborators: 52,
    status: "Active",
    initials: "IF",
  },
  {
    id: "R-1168",
    name: "Dr. Rahul Iyer",
    title: "Postdoctoral Researcher",
    department: "Computer Science",
    institution: "Cavendish Data Lab",
    email: "r.iyer@cavendish.org",
    publications: 26,
    citations: 890,
    hIndex: 17,
    collaborators: 33,
    status: "Active",
    initials: "RI",
  },
  {
    id: "R-1194",
    name: "Prof. Sofia Marchetti",
    title: "Director, Neural Systems Lab",
    department: "Neuroscience",
    institution: "Università di Torino",
    email: "s.marchetti@unito.it",
    publications: 98,
    citations: 6440,
    hIndex: 44,
    collaborators: 91,
    status: "On Leave",
    initials: "SM",
  },
  {
    id: "R-1210",
    name: "Dr. Tomás Herrera",
    title: "Research Scientist",
    department: "Materials Science",
    institution: "Pacific Rim University",
    email: "t.herrera@pacrim.edu",
    publications: 41,
    citations: 1720,
    hIndex: 22,
    collaborators: 38,
    status: "Active",
    initials: "TH",
  },
  {
    id: "R-1233",
    name: "Dr. Hana Suzuki",
    title: "Assistant Professor",
    department: "Computational Biology",
    institution: "Kyoto Systems Institute",
    email: "h.suzuki@ksi.jp",
    publications: 35,
    citations: 1490,
    hIndex: 20,
    collaborators: 29,
    status: "Active",
    initials: "HS",
  },
];

export type PublicationStatus = "Published" | "Under Review" | "Preprint" | "Draft";

export interface Publication {
  id: string;
  title: string;
  venue: string;
  year: number;
  type: "Journal Article" | "Conference Paper" | "Review" | "Dataset";
  authors: string[];
  citations: number;
  status: PublicationStatus;
  doi: string;
  openAccess: boolean;
}

export const publications: Publication[] = [
  {
    id: "P-8801",
    title: "Graph-Regularized Inference of Multi-Omics Interaction Networks",
    venue: "Nature Computational Science",
    year: 2026,
    type: "Journal Article",
    authors: ["A. Okonkwo", "H. Suzuki", "R. Iyer"],
    citations: 34,
    status: "Published",
    doi: "10.1038/s43588-026-0142-7",
    openAccess: true,
  },
  {
    id: "P-8814",
    title: "Coherence Lifetimes in Cryogenic Photonic Lattices",
    venue: "Physical Review Letters",
    year: 2026,
    type: "Journal Article",
    authors: ["L. Brenner", "M. Chao"],
    citations: 12,
    status: "Under Review",
    doi: "10.1103/PhysRevLett.pending",
    openAccess: false,
  },
  {
    id: "P-8829",
    title: "Sparse Attention Models for Citation Graph Completion",
    venue: "NeurIPS 2026",
    year: 2026,
    type: "Conference Paper",
    authors: ["R. Iyer", "A. Okonkwo"],
    citations: 8,
    status: "Preprint",
    doi: "arXiv:2603.11284",
    openAccess: true,
  },
  {
    id: "P-8840",
    title: "Regional Downscaling of Monsoon Variability under RCP4.5",
    venue: "Journal of Climate",
    year: 2025,
    type: "Journal Article",
    authors: ["I. Ferreira", "T. Herrera"],
    citations: 76,
    status: "Published",
    doi: "10.1175/JCLI-D-25-0311.1",
    openAccess: true,
  },
  {
    id: "P-8856",
    title: "Perovskite Interface Stability: A Systematic Review",
    venue: "Advanced Materials",
    year: 2025,
    type: "Review",
    authors: ["M. Chao", "T. Herrera", "L. Brenner"],
    citations: 143,
    status: "Published",
    doi: "10.1002/adma.202504418",
    openAccess: false,
  },
  {
    id: "P-8871",
    title: "Cortical Connectome Atlas v3 (Dataset)",
    venue: "Scientific Data",
    year: 2026,
    type: "Dataset",
    authors: ["S. Marchetti", "H. Suzuki"],
    citations: 5,
    status: "Draft",
    doi: "10.1038/s41597-026-0088-x",
    openAccess: true,
  },
];

export interface Project {
  id: string;
  title: string;
  lead: string;
  funder: string;
  funding: string;
  progress: number;
  deadline: string;
  stage: "Proposal" | "Active" | "Analysis" | "Completed";
  team: string[];
}

export const projects: Project[] = [
  {
    id: "PR-401",
    title: "Pan-European Multi-Omics Consortium",
    lead: "Dr. Amara Okonkwo",
    funder: "Horizon Europe",
    funding: "€2.4M",
    progress: 68,
    deadline: "Mar 2027",
    stage: "Active",
    team: ["AO", "HS", "RI"],
  },
  {
    id: "PR-408",
    title: "Cryogenic Photonics Testbed",
    lead: "Prof. Lukas Brenner",
    funder: "National Science Foundation",
    funding: "$1.1M",
    progress: 42,
    deadline: "Nov 2026",
    stage: "Active",
    team: ["LB", "MC"],
  },
  {
    id: "PR-415",
    title: "Monsoon Downscaling Initiative",
    lead: "Dr. Ines Ferreira",
    funder: "Climate Futures Trust",
    funding: "$640K",
    progress: 88,
    deadline: "Sep 2026",
    stage: "Analysis",
    team: ["IF", "TH"],
  },
  {
    id: "PR-422",
    title: "Citation Graph Foundation Models",
    lead: "Dr. Rahul Iyer",
    funder: "Cavendish Internal Grant",
    funding: "$180K",
    progress: 15,
    deadline: "Jan 2028",
    stage: "Proposal",
    team: ["RI", "AO"],
  },
  {
    id: "PR-430",
    title: "Perovskite Durability Roadmap",
    lead: "Dr. Mei-Lin Chao",
    funder: "Pacific Materials Alliance",
    funding: "$920K",
    progress: 100,
    deadline: "Completed Jun 2026",
    stage: "Completed",
    team: ["MC", "TH", "LB"],
  },
  {
    id: "PR-436",
    title: "Neural Systems Atlas Expansion",
    lead: "Prof. Sofia Marchetti",
    funder: "European Brain Council",
    funding: "€1.8M",
    progress: 55,
    deadline: "Aug 2027",
    stage: "Active",
    team: ["SM", "HS"],
  },
];

export interface Conference {
  id: string;
  name: string;
  acronym: string;
  location: string;
  date: string;
  track: string;
  registration: "Registered" | "Abstract Submitted" | "Pending" | "Invited Speaker";
  attendees: number;
  submissionsFromLab: number;
}

export const conferences: Conference[] = [
  {
    id: "C-210",
    name: "International Conference on Computational Biology",
    acronym: "ICCB",
    location: "Lisbon, Portugal",
    date: "12–15 Sep 2026",
    track: "Systems Biology",
    registration: "Registered",
    attendees: 2400,
    submissionsFromLab: 4,
  },
  {
    id: "C-214",
    name: "Neural Information Processing Systems",
    acronym: "NeurIPS",
    location: "Vancouver, Canada",
    date: "07–13 Dec 2026",
    track: "Graph Learning",
    registration: "Abstract Submitted",
    attendees: 16000,
    submissionsFromLab: 2,
  },
  {
    id: "C-219",
    name: "Quantum Photonics Symposium",
    acronym: "QPS",
    location: "Zurich, Switzerland",
    date: "03–05 Nov 2026",
    track: "Cryogenic Systems",
    registration: "Invited Speaker",
    attendees: 780,
    submissionsFromLab: 3,
  },
  {
    id: "C-225",
    name: "World Climate Research Congress",
    acronym: "WCRC",
    location: "Nairobi, Kenya",
    date: "21–25 Oct 2026",
    track: "Regional Modelling",
    registration: "Pending",
    attendees: 3100,
    submissionsFromLab: 1,
  },
];

export interface Institution {
  name: string;
  country: string;
  researchers: number;
  jointPublications: number;
  activeProjects: number;
}

export const institutions: Institution[] = [
  {
    name: "Northfield Institute of Technology",
    country: "United States",
    researchers: 412,
    jointPublications: 268,
    activeProjects: 24,
  },
  { name: "ETH Ruhrland", country: "Germany", researchers: 305, jointPublications: 191, activeProjects: 18 },
  {
    name: "Pacific Rim University",
    country: "Australia",
    researchers: 264,
    jointPublications: 143,
    activeProjects: 12,
  },
  { name: "Università di Torino", country: "Italy", researchers: 198, jointPublications: 96, activeProjects: 9 },
  { name: "Kyoto Systems Institute", country: "Japan", researchers: 176, jointPublications: 84, activeProjects: 7 },
  { name: "Cavendish Data Lab", country: "United Kingdom", researchers: 88, jointPublications: 57, activeProjects: 6 },
];

export interface CoAuthorLink {
  a: string;
  b: string;
  papers: number;
  strength: "Strong" | "Emerging" | "Occasional";
}

export const coAuthorLinks: CoAuthorLink[] = [
  { a: "Dr. Amara Okonkwo", b: "Dr. Hana Suzuki", papers: 19, strength: "Strong" },
  { a: "Prof. Lukas Brenner", b: "Dr. Mei-Lin Chao", papers: 14, strength: "Strong" },
  { a: "Dr. Ines Ferreira", b: "Dr. Tomás Herrera", papers: 11, strength: "Strong" },
  { a: "Dr. Rahul Iyer", b: "Dr. Amara Okonkwo", papers: 7, strength: "Emerging" },
  { a: "Prof. Sofia Marchetti", b: "Dr. Hana Suzuki", papers: 5, strength: "Emerging" },
  { a: "Dr. Mei-Lin Chao", b: "Dr. Tomás Herrera", papers: 3, strength: "Occasional" },
];

export interface ResearchTeam {
  id: string;
  name: string;
  focus: string;
  members: number;
  institutions: number;
  publications: number;
  lead: string;
}

export const teams: ResearchTeam[] = [
  {
    id: "T-01",
    name: "Multi-Omics Network Group",
    focus: "Graph inference across genomic layers",
    members: 14,
    institutions: 4,
    publications: 62,
    lead: "Dr. Amara Okonkwo",
  },
  {
    id: "T-02",
    name: "Quantum Photonics Cluster",
    focus: "Coherence engineering in photonic lattices",
    members: 11,
    institutions: 3,
    publications: 48,
    lead: "Prof. Lukas Brenner",
  },
  {
    id: "T-03",
    name: "Regional Climate Modelling Unit",
    focus: "High-resolution monsoon downscaling",
    members: 9,
    institutions: 5,
    publications: 37,
    lead: "Dr. Ines Ferreira",
  },
  {
    id: "T-04",
    name: "Scientometrics & Graph ML",
    focus: "Citation graph representation learning",
    members: 6,
    institutions: 2,
    publications: 21,
    lead: "Dr. Rahul Iyer",
  },
];

export const publicationTrend = [
  { year: "2020", publications: 118, citations: 1420 },
  { year: "2021", publications: 146, citations: 1980 },
  { year: "2022", publications: 171, citations: 2610 },
  { year: "2023", publications: 204, citations: 3480 },
  { year: "2024", publications: 238, citations: 4390 },
  { year: "2025", publications: 289, citations: 5720 },
  { year: "2026", publications: 214, citations: 4110 },
];

export const collaborationByDomain = [
  { domain: "Comp. Biology", internal: 82, external: 141 },
  { domain: "Physics", internal: 64, external: 118 },
  { domain: "Materials", internal: 51, external: 87 },
  { domain: "Climate", internal: 44, external: 96 },
  { domain: "Computer Sci.", internal: 73, external: 62 },
  { domain: "Neuroscience", internal: 38, external: 74 },
];

export const fundingSplit = [
  { name: "Public grants", value: 46 },
  { name: "Industry", value: 21 },
  { name: "Institutional", value: 19 },
  { name: "Philanthropic", value: 14 },
];

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  kind: "publication" | "collaboration" | "project" | "conference";
}

export const activities: ActivityItem[] = [
  {
    id: "A-1",
    actor: "Dr. Amara Okonkwo",
    action: "published",
    target: "Graph-Regularized Inference of Multi-Omics Interaction Networks",
    time: "2 hours ago",
    kind: "publication",
  },
  {
    id: "A-2",
    actor: "Dr. Rahul Iyer",
    action: "started a collaboration with",
    target: "Kyoto Systems Institute",
    time: "6 hours ago",
    kind: "collaboration",
  },
  {
    id: "A-3",
    actor: "Dr. Ines Ferreira",
    action: "moved to analysis stage",
    target: "Monsoon Downscaling Initiative",
    time: "Yesterday",
    kind: "project",
  },
  {
    id: "A-4",
    actor: "Prof. Lukas Brenner",
    action: "was confirmed as invited speaker at",
    target: "Quantum Photonics Symposium",
    time: "2 days ago",
    kind: "conference",
  },
  {
    id: "A-5",
    actor: "Dr. Mei-Lin Chao",
    action: "added 3 co-authors to",
    target: "Perovskite Interface Stability",
    time: "3 days ago",
    kind: "publication",
  },
];

export const notifications = [
  { id: "N-1", title: "Peer review due", body: "Physical Review Letters — 2 days left", time: "1h" },
  { id: "N-2", title: "New co-author request", body: "Dr. Hana Suzuki invited you to P-8871", time: "4h" },
  { id: "N-3", title: "Grant milestone", body: "Horizon Europe report window opens Monday", time: "1d" },
];

export const currentUser = {
  name: "Dr. Amara Okonkwo",
  role: "Principal Investigator",
  email: "a.okonkwo@northfield.edu",
  institution: "Northfield Institute of Technology",
  department: "Computational Biology",
  orcid: "0000-0002-4417-9931",
  initials: "AO",
};
