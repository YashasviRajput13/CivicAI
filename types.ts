
export type Tab = 'home' | 'assistant' | 'explainer' | 'admin' | 'formFiller' | 'profile' | 'schemes' | 'grievances' | 'welfare';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  state?: string;
  district?: string;
  aadhaarMasked?: string;
  hasDocument?: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string;
  officialLink: string;
}

export interface Grievance {
  id: string;
  subject: string;
  description: string;
  department: string;
  status: 'Open' | 'Resolved' | 'Escalated';
  createdAt: Date;
  aiClassification?: ClassificationResult;
}

export interface WelfareBenefit {
  id: string;
  name: string;
  amount?: string;
  status: 'Active' | 'Pending' | 'Paused';
  lastDisbursement?: string;
}

export interface ClassificationResult {
  category: string;
  priority: 'Low' | 'Medium' | 'High';
  department: string;
  urgencyReason: string;
}

export interface FormAnalysis {
  purpose: string;
  requirements: string[];
  deadlines: string;
  commonMistakes: string[];
  simplifiedExplanation: string;
}

export interface ServiceDetailInfo {
  summary: string;
  features: string[];
  steps: string[];
  aiInsight: string;
  processingTime: string;
  checklist: string[];
}

export interface RejectionPrediction {
  approvalProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  redFlags: string[];
  mitigationSteps: string[];
  aiAnalystNote: string;
}

export interface ServiceRequest {
  id: string;
  subject: string;
  classification?: ClassificationResult;
  status: 'Pending' | 'Processed';
  createdAt: Date;
}

export interface GenericFormDraft {
  formSubject: string;
  applicationType: string;
  fullName: string;
  fatherName: string;
  dateOfBirth: string;
  address: string;
  aiVerificationNote: string;
}
