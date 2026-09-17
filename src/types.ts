export type CompanyStatus = 'Active' | 'Trial' | 'Suspended' | 'Pending' | 'Cancelled';

export type SubscriptionPlanTier = 'Free' | 'Starter' | 'Professional' | 'Enterprise';

export interface CompanyAdmin {
  name: string;
  email: string;
  phone: string;
  role: string;
  lastLogin: string;
  avatar: string;
  status: 'Active' | 'Suspended' | 'Pending';
}

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  logoText: string;
  logoBgColor: string;
  logoTextColor: string;
  logoUrl?: string;
  industry: string;
  country: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  companySize: string;
  registrationDate: string;
  status: CompanyStatus;
  plan: SubscriptionPlanTier;
  planLevel: string;
  billingCycle: 'Monthly' | 'Annual';
  monthlyPrice: number;
  renewalDate: string;
  currentPeriodStart: string;
  autoRenewal: boolean;
  employeesCount: number;
  quotaEmployees: number;
  storageUsedGB: number;
  quotaStorageGB: number;
  apiRequestsMTD: number;
  quotaApiRequests: number;
  payrollProcessing: {
    lastRun: string;
    avgProcessingTime: string;
    successRate: number;
  };
  eSignaturesCompletedYTD: number;
  eSignaturesGrowth: number;
  admin: CompanyAdmin;
  tags?: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionPlanTier;
  tier: SubscriptionPlanTier;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  userLimit: number;
  storageLimitGB: number;
  features: string[];
  subscribedCompaniesCount: number;
  revenueMonthly: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  churnRate: number;
  isPopular?: boolean;
  status: 'Active' | 'Archived' | 'Draft';
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded' | 'Overdue';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId: string;
  companyName: string;
  companyLogoText: string;
  plan: SubscriptionPlanTier;
  amount: number;
  billingDate: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  paymentMethod: string;
  transactionId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  total: number;
  billingAddress: string;
}

export type PaymentStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';

export interface PaymentTransaction {
  id: string;
  transactionId: string;
  companyId: string;
  companyName: string;
  amount: number;
  paymentMethod: 'Credit Card' | 'Wire Transfer' | 'ACH Direct Debit' | 'PayPal';
  cardLast4?: string;
  date: string;
  status: PaymentStatus;
  invoiceId: string;
  gatewayReference: string;
  feeAmount: number;
}

export type UserRole =
  | 'Super Admin'
  | 'Company Admin'
  | 'HR Admin'
  | 'HR Manager'
  | 'Manager'
  | 'Employee'
  | 'Finance Admin';

export type UserStatus = 'Active' | 'Suspended' | 'Invited' | 'Inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  createdDate?: string;
  avatar?: string;
  phone?: string;
  department?: string;
  location?: string;
  twoFactorEnabled?: boolean;
}

export type PlatformUser = User;

export interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description: string;
  enabled: boolean;
  tierRequirement?: string;
  rolloutPercentage: number;
}

export interface SystemService {
  id: string;
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  latency: string;
  uptime: string;
  lastChecked: string;
}

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type TicketStatus =
  | 'Open'
  | 'In Progress'
  | 'Waiting for Customer'
  | 'Resolved'
  | 'Closed';

export interface TicketMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  avatar?: string;
  timestamp: string;
  content: string;
  isInternal: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  companyId: string;
  companyName: string;
  requesterName: string;
  requesterEmail: string;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdDate: string;
  updatedDate: string;
  category:
    | 'Billing'
    | 'API & Integration'
    | 'Bug Report'
    | 'Feature Request'
    | 'Security'
    | 'General';
  messages: TicketMessage[];
}

export type HealthStatus = 'Operational' | 'Degraded' | 'Major Outage';

export interface PlatformService {
  id: string;
  name: string;
  category: string;
  status: HealthStatus;
  uptimePercent: number;
  responseTimeMs: number;
  errorRatePercent: number;
  rpm: number;
  lastIncident?: string;
  region: string;
  description: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  action: string;
  companyId?: string;
  companyName?: string;
  ipAddress: string;
  resource: string;
  status: 'Success' | 'Warning' | 'Failed';
  details: string;
}

export interface AdminSession {
  id: string;
  adminName: string;
  email: string;
  ipAddress: string;
  location: string;
  device: string;
  browser: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  companyName: string;
  createdDate: string;
  lastUsedDate: string;
  status: 'Active' | 'Revoked';
  scope: 'Full Access' | 'Read Only' | 'Webhooks Only';
}

export interface SecurityEvent {
  id: string;
  type:
    | 'Failed Login'
    | 'Suspicious IP'
    | 'MFA Bypass Attempt'
    | 'Token Revocation'
    | 'Privilege Escalation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  sourceIp: string;
  targetUser: string;
  companyName: string;
  status: 'Investigating' | 'Resolved' | 'Blocked';
  details: string;
}

export interface PlatformFeature {
  id: string;
  name: string;
  code: string;
  category: 'Core HR' | 'Finance' | 'Productivity' | 'Security & AI' | 'Developer';
  description: string;
  status: 'Enabled' | 'Disabled' | 'Beta';
  planTiers: SubscriptionPlanTier[];
  activeTenantsCount: number;
  betaEnrollments: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'system' | 'payment' | 'security' | 'subscription' | 'support';
  timestamp: string;
  read: boolean;
  linkTab?: string;
  linkId?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}


/* ============================================================
   ROLES & PERMISSIONS
   ============================================================ */

export type PlatformRoleName =
  | 'Super Admin'
  | 'Platform Admin'
  | 'Support Admin'
  | 'Finance Admin'
  | 'Security Admin'
  | 'HR Admin';

export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Export';

export interface PermissionItem {
  id: string;
  module: string;
  actions: PermissionAction[];
}

export interface PlatformRole {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionsCount: number;
  permissions: PermissionItem[];
  status: 'Active' | 'Inactive';
  createdDate: string;
  isSystemRole: boolean;
}
