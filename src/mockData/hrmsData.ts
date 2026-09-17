// Comprehensive enterprise mock data for TechNova HRMS & Apex Global

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'HR_MANAGER' | 'PAYROLL_ADMIN' | 'DEPT_HEAD' | 'EMPLOYEE';
  department: string;
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  lastLogin: string;
  twoFactorEnabled: boolean;
  avatarBg: string;
}

export interface EmployeeRecord {
  id: string;
  empCode: string;
  name: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  location: string;
  employmentType: 'FULL_TIME' | 'CONTRACT' | 'PROBATION' | 'INTERN';
  status: 'ACTIVE' | 'ON_LEAVE' | 'PROBATION' | 'NOTICE_PERIOD';
  joiningDate: string;
  reportingManager: string;
  ctc: number; // in INR
  panNumber: string;
  uanNumber: string;
  bankAccount: {
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  avatar: string;
}

export interface PunchRecord {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  totalHours: string;
  status: 'ON_TIME' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'ON_LEAVE';
  punchMethod: 'BIOMETRIC_DEVICE' | 'WEB_PORTAL' | 'GEO_MOBILE';
  location: string;
}

export interface LeaveRequest {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  department: string;
  leaveType: 'CASUAL_LEAVE' | 'SICK_LEAVE' | 'EARNED_PRIVILEGE' | 'MATERNITY' | 'COMP_OFF';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  appliedOn: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  comments?: string;
}

export interface LeaveBalance {
  empId: string;
  casualLeave: { total: number; used: number; remaining: number };
  sickLeave: { total: number; used: number; remaining: number };
  earnedLeave: { total: number; used: number; remaining: number };
  compOff: { total: number; used: number; remaining: number };
}

export interface PayrollRunRecord {
  id: string;
  month: string; // e.g. "August 2026"
  periodStart: string;
  periodEnd: string;
  payDate: string;
  totalEmployees: number;
  grossDisbursement: number;
  totalPFDeduction: number;
  totalESIDeduction: number;
  totalTDSDeduction: number;
  netPayout: number;
  status: 'PROCESSED' | 'PENDING_APPROVAL' | 'DISBURSED' | 'DRAFT';
  disbursementMode: 'DIRECT_BANK_TRANSFER' | 'CHEQUE' | 'HOLD';
}

export interface EmployeePayslip {
  id: string;
  payrollId: string;
  empId: string;
  empName: string;
  empCode: string;
  designation: string;
  department: string;
  month: string;
  payableDays: number;
  lossOfPayDays: number;
  earnings: {
    basic: number;
    hra: number;
    specialAllowance: number;
    conveyance: number;
    performanceBonus: number;
    grossEarnings: number;
  };
  deductions: {
    employeePF: number;
    employerPF: number;
    esic: number;
    professionalTax: number;
    tdsTax: number;
    otherDeductions: number;
    totalDeductions: number;
  };
  netPayable: number;
  status: 'PAID' | 'READY' | 'HOLD';
}

export interface IncrementProposal {
  id: string;
  empId: string;
  empName: string;
  empCode: string;
  department: string;
  designation: string;
  currentCTC: number;
  proposedHikePercent: number;
  proposedCTC: number;
  effectiveDate: string;
  appraisalRating: 'EXCEEDS_EXPECTATIONS' | 'MEETS_EXPECTATIONS' | 'OUTSTANDING' | 'NEEDS_IMPROVEMENT';
  managerRemarks: string;
  status: 'DRAFT' | 'HR_REVIEW' | 'APPROVED' | 'REJECTED';
}

export interface StatutoryFiling {
  id: string;
  statuteName: string;
  filingCode: string;
  category: 'EPFO_PF' | 'ESIC' | 'TDS_INCOME_TAX' | 'PROFESSIONAL_TAX' | 'LABOUR_WELFARE';
  frequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  dueDate: string;
  targetMonth: string;
  filingStatus: 'COMPLIANT' | 'DUE_SOON' | 'OVERDUE' | 'FILED';
  amountDue: number;
  challanNumber?: string;
  filedDate?: string;
  penaltyRisk: 'NONE' | 'LOW' | 'HIGH';
}

export interface AssetRecord {
  id: string;
  assetTag: string;
  assetName: string;
  category: 'LAPTOP' | 'MONITOR' | 'MOBILE' | 'ACCESSORY' | 'LICENSE';
  brand: string;
  serialNumber: string;
  assignedToEmpId: string | null;
  assignedToEmpName: string | null;
  assignedDate: string | null;
  purchaseDate: string;
  purchaseValue: number;
  warrantyExpiry: string;
  condition: 'EXCELLENT' | 'GOOD' | 'REPAIR_REQUIRED' | 'DECOMMISSIONED';
  status: 'ASSIGNED' | 'IN_STOCK' | 'UNDER_MAINTENANCE' | 'LOST';
}

export interface WorkflowRule {
  id: string;
  title: string;
  triggerEvent: 'LEAVE_APPLICATION' | 'SALARY_INCREMENT' | 'REIMBURSEMENT_CLAIM' | 'ASSET_REQUEST' | 'ONBOARDING_INIT';
  description: string;
  approvalLevels: {
    level: number;
    approverRole: string;
    slaHours: number;
    autoEscalate: boolean;
  }[];
  isActive: boolean;
  totalExecutions: number;
  lastTriggered: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDept: string;
  headcount: number;
  budgetAllocated: number;
  location: string;
}

export interface DesignationItem {
  id: string;
  title: string;
  band: string;
  department: string;
  totalEmployees: number;
  minExperienceYears: number;
}

// -------------------------------------------------------------
// SEED MOCK DATA
// -------------------------------------------------------------

export const MOCK_USERS: SystemUser[] = [
  {
    id: 'usr_001',
    name: 'John Admin',
    email: 'john.admin@technova.io',
    role: 'COMPANY_ADMIN',
    department: 'Executive Board',
    status: 'ACTIVE',
    lastLogin: '2026-08-25 09:42 AM',
    twoFactorEnabled: true,
    avatarBg: 'bg-[#131b2e]'
  },
  {
    id: 'usr_002',
    name: 'Priya Sharma',
    email: 'priya.sharma@technova.io',
    role: 'HR_MANAGER',
    department: 'Human Resources',
    status: 'ACTIVE',
    lastLogin: '2026-08-25 08:30 AM',
    twoFactorEnabled: true,
    avatarBg: 'bg-purple-700'
  },
  {
    id: 'usr_003',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@technova.io',
    role: 'PAYROLL_ADMIN',
    department: 'Finance & Accounts',
    status: 'ACTIVE',
    lastLogin: '2026-08-24 05:15 PM',
    twoFactorEnabled: true,
    avatarBg: 'bg-emerald-700'
  },
  {
    id: 'usr_004',
    name: 'Aakash Verma',
    email: 'aakash.v@technova.io',
    role: 'DEPT_HEAD',
    department: 'Engineering',
    status: 'ACTIVE',
    lastLogin: '2026-08-25 09:12 AM',
    twoFactorEnabled: false,
    avatarBg: 'bg-blue-700'
  },
  {
    id: 'usr_005',
    name: 'Neha Kapoor',
    email: 'neha.k@technova.io',
    role: 'HR_MANAGER',
    department: 'Talent Acquisition',
    status: 'ACTIVE',
    lastLogin: '2026-08-23 04:20 PM',
    twoFactorEnabled: true,
    avatarBg: 'bg-rose-700'
  },
  {
    id: 'usr_006',
    name: 'Rahul Sen',
    email: 'rahul.sen@technova.io',
    role: 'EMPLOYEE',
    department: 'Product Design',
    status: 'INVITED',
    lastLogin: 'Never',
    twoFactorEnabled: false,
    avatarBg: 'bg-amber-700'
  }
];

export const MOCK_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp_01',
    empCode: 'TN-1001',
    name: 'Aakash Verma',
    email: 'aakash.v@technova.io',
    phone: '+91 98765 43210',
    designation: 'Principal Architect & VP Tech',
    department: 'Engineering',
    location: 'Bengaluru Tech Park (HQ)',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joiningDate: '2021-03-15',
    reportingManager: 'John Admin',
    ctc: 3200000,
    panNumber: 'ABCDE1234F',
    uanNumber: '101234567890',
    bankAccount: {
      accountNumber: '918237461928',
      bankName: 'HDFC Bank Ltd',
      ifsc: 'HDFC0001234',
      branch: 'Indiranagar, Bengaluru'
    },
    emergencyContact: {
      name: 'Ritu Verma',
      relation: 'Spouse',
      phone: '+91 98765 43219'
    },
    avatar: 'AV'
  },
  {
    id: 'emp_02',
    empCode: 'TN-1002',
    name: 'Priya Sharma',
    email: 'priya.sharma@technova.io',
    phone: '+91 98220 11223',
    designation: 'Head of Human Resources',
    department: 'Human Resources',
    location: 'Bengaluru Tech Park (HQ)',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joiningDate: '2021-06-01',
    reportingManager: 'John Admin',
    ctc: 2400000,
    panNumber: 'BKGPS8890K',
    uanNumber: '101456789012',
    bankAccount: {
      accountNumber: '50100234567890',
      bankName: 'ICICI Bank',
      ifsc: 'ICIC0000456',
      branch: 'Koramangala, Bengaluru'
    },
    emergencyContact: {
      name: 'Rajesh Sharma',
      relation: 'Father',
      phone: '+91 98220 11299'
    },
    avatar: 'PS'
  },
  {
    id: 'emp_03',
    empCode: 'TN-1003',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@technova.io',
    phone: '+91 97112 33445',
    designation: 'Lead Payroll & Statutory Officer',
    department: 'Finance & Accounts',
    location: 'Mumbai Branch Office',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joiningDate: '2022-01-10',
    reportingManager: 'John Admin',
    ctc: 1950000,
    panNumber: 'CYMPJ4456L',
    uanNumber: '101987654321',
    bankAccount: {
      accountNumber: '00341040001234',
      bankName: 'Axis Bank',
      ifsc: 'UTIB0000034',
      branch: 'BKC, Mumbai'
    },
    emergencyContact: {
      name: 'Ananya Joshi',
      relation: 'Spouse',
      phone: '+91 97112 33499'
    },
    avatar: 'VJ'
  },
  {
    id: 'emp_04',
    empCode: 'TN-1004',
    name: 'Sneha Mukherjee',
    email: 'sneha.m@technova.io',
    phone: '+91 94331 55667',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Bengaluru Tech Park (HQ)',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joiningDate: '2023-04-18',
    reportingManager: 'Aakash Verma',
    ctc: 1600000,
    panNumber: 'DFPMK7712E',
    uanNumber: '101567890123',
    bankAccount: {
      accountNumber: '32981010049281',
      bankName: 'State Bank of India',
      ifsc: 'SBIN0004123',
      branch: 'Whitefield, Bengaluru'
    },
    emergencyContact: {
      name: 'Debashis Mukherjee',
      relation: 'Brother',
      phone: '+91 94331 55699'
    },
    avatar: 'SM'
  },
  {
    id: 'emp_05',
    empCode: 'TN-1005',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@technova.io',
    phone: '+91 99201 77889',
    designation: 'DevOps & Cloud Security Specialist',
    department: 'Engineering',
    location: 'Bengaluru Tech Park (HQ)',
    employmentType: 'FULL_TIME',
    status: 'ON_LEAVE',
    joiningDate: '2023-09-01',
    reportingManager: 'Aakash Verma',
    ctc: 1750000,
    panNumber: 'ZXCVB9921M',
    uanNumber: '101890123456',
    bankAccount: {
      accountNumber: '601289347102',
      bankName: 'HDFC Bank Ltd',
      ifsc: 'HDFC0001234',
      branch: 'Indiranagar, Bengaluru'
    },
    emergencyContact: {
      name: 'Sunita Deshmukh',
      relation: 'Mother',
      phone: '+91 99201 77800'
    },
    avatar: 'RD'
  },
  {
    id: 'emp_06',
    empCode: 'TN-1006',
    name: 'Ananya Roy',
    email: 'ananya.roy@technova.io',
    phone: '+91 98450 99887',
    designation: 'Senior Product Designer',
    department: 'Product Design',
    location: 'Bengaluru Tech Park (HQ)',
    employmentType: 'FULL_TIME',
    status: 'ACTIVE',
    joiningDate: '2024-02-15',
    reportingManager: 'Priya Sharma',
    ctc: 1500000,
    panNumber: 'GHJKL3345P',
    uanNumber: '101678901234',
    bankAccount: {
      accountNumber: '445566778899',
      bankName: 'Kotak Mahindra Bank',
      ifsc: 'KKBK0000123',
      branch: 'MG Road, Bengaluru'
    },
    emergencyContact: {
      name: 'Subhash Roy',
      relation: 'Father',
      phone: '+91 98450 99800'
    },
    avatar: 'AR'
  },
  {
    id: 'emp_07',
    empCode: 'TN-1007',
    name: 'Karthik Raja',
    email: 'karthik.r@technova.io',
    phone: '+91 97900 12345',
    designation: 'QA Automation Engineer',
    department: 'Quality Assurance',
    location: 'Chennai Tech Center',
    employmentType: 'PROBATION',
    status: 'PROBATION',
    joiningDate: '2026-06-01',
    reportingManager: 'Aakash Verma',
    ctc: 900000,
    panNumber: 'POIUY6678T',
    uanNumber: '101789012345',
    bankAccount: {
      accountNumber: '112233445566',
      bankName: 'HDFC Bank Ltd',
      ifsc: 'HDFC0005678',
      branch: 'OMR, Chennai'
    },
    emergencyContact: {
      name: 'Meena Raja',
      relation: 'Spouse',
      phone: '+91 97900 12399'
    },
    avatar: 'KR'
  }
];

export const MOCK_PUNCH_RECORDS: PunchRecord[] = [
  {
    id: 'punch_01',
    empId: 'emp_01',
    empName: 'Aakash Verma',
    empCode: 'TN-1001',
    department: 'Engineering',
    date: '2026-08-25',
    checkIn: '09:04 AM',
    checkOut: null,
    totalHours: '5h 12m (In Progress)',
    status: 'ON_TIME',
    punchMethod: 'BIOMETRIC_DEVICE',
    location: 'Bengaluru HQ Turnstile Gate 1'
  },
  {
    id: 'punch_02',
    empId: 'emp_02',
    empName: 'Priya Sharma',
    empCode: 'TN-1002',
    department: 'Human Resources',
    date: '2026-08-25',
    checkIn: '08:52 AM',
    checkOut: null,
    totalHours: '5h 24m (In Progress)',
    status: 'ON_TIME',
    punchMethod: 'GEO_MOBILE',
    location: 'Bengaluru Campus Geofence'
  },
  {
    id: 'punch_03',
    empId: 'emp_03',
    empName: 'Vikram Joshi',
    empCode: 'TN-1003',
    department: 'Finance & Accounts',
    date: '2026-08-25',
    checkIn: '09:32 AM',
    checkOut: null,
    totalHours: '4h 44m (In Progress)',
    status: 'LATE',
    punchMethod: 'WEB_PORTAL',
    location: 'Mumbai Office Secure IP'
  },
  {
    id: 'punch_04',
    empId: 'emp_04',
    empName: 'Sneha Mukherjee',
    empCode: 'TN-1004',
    department: 'Engineering',
    date: '2026-08-25',
    checkIn: '09:00 AM',
    checkOut: null,
    totalHours: '5h 16m (In Progress)',
    status: 'ON_TIME',
    punchMethod: 'BIOMETRIC_DEVICE',
    location: 'Bengaluru HQ Turnstile Gate 2'
  },
  {
    id: 'punch_05',
    empId: 'emp_05',
    empName: 'Rohan Deshmukh',
    empCode: 'TN-1005',
    department: 'Engineering',
    date: '2026-08-25',
    checkIn: '-',
    checkOut: null,
    totalHours: '0h 00m',
    status: 'ON_LEAVE',
    punchMethod: 'WEB_PORTAL',
    location: 'Approved Privilege Leave'
  },
  {
    id: 'punch_06',
    empId: 'emp_06',
    empName: 'Ananya Roy',
    empCode: 'TN-1006',
    department: 'Product Design',
    date: '2026-08-25',
    checkIn: '09:14 AM',
    checkOut: null,
    totalHours: '5h 02m (In Progress)',
    status: 'ON_TIME',
    punchMethod: 'BIOMETRIC_DEVICE',
    location: 'Bengaluru HQ Turnstile Gate 1'
  },
  {
    id: 'punch_07',
    empId: 'emp_07',
    empName: 'Karthik Raja',
    empCode: 'TN-1007',
    department: 'Quality Assurance',
    date: '2026-08-25',
    checkIn: '10:15 AM',
    checkOut: null,
    totalHours: '4h 01m (In Progress)',
    status: 'LATE',
    punchMethod: 'GEO_MOBILE',
    location: 'Chennai Campus Mobile Punch'
  }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'lev_01',
    empId: 'emp_05',
    empName: 'Rohan Deshmukh',
    empCode: 'TN-1005',
    department: 'Engineering',
    leaveType: 'EARNED_PRIVILEGE',
    startDate: '2026-08-25',
    endDate: '2026-08-27',
    daysCount: 3,
    reason: 'Family wedding ceremony in Pune',
    appliedOn: '2026-08-20',
    status: 'APPROVED',
    approvedBy: 'Priya Sharma',
    comments: 'Approved. Handover plan aligned with Sneha.'
  },
  {
    id: 'lev_02',
    empId: 'emp_04',
    empName: 'Sneha Mukherjee',
    empCode: 'TN-1004',
    department: 'Engineering',
    leaveType: 'CASUAL_LEAVE',
    startDate: '2026-09-02',
    endDate: '2026-09-02',
    daysCount: 1,
    reason: 'Personal banking and statutory documentation',
    appliedOn: '2026-08-24',
    status: 'PENDING'
  },
  {
    id: 'lev_03',
    empId: 'emp_07',
    empName: 'Karthik Raja',
    empCode: 'TN-1007',
    department: 'Quality Assurance',
    leaveType: 'SICK_LEAVE',
    startDate: '2026-08-18',
    endDate: '2026-08-19',
    daysCount: 2,
    reason: 'Viral fever and medical rest',
    appliedOn: '2026-08-18',
    status: 'APPROVED',
    approvedBy: 'Aakash Verma',
    comments: 'Medical certificate verified.'
  },
  {
    id: 'lev_04',
    empId: 'emp_06',
    empName: 'Ananya Roy',
    empCode: 'TN-1006',
    department: 'Product Design',
    leaveType: 'COMP_OFF',
    startDate: '2026-09-10',
    endDate: '2026-09-10',
    daysCount: 1,
    reason: 'Worked on production release launch last weekend',
    appliedOn: '2026-08-25',
    status: 'PENDING'
  }
];

export const MOCK_PAYROLL_RUNS: PayrollRunRecord[] = [
  {
    id: 'pay_aug_2026',
    month: 'August 2026',
    periodStart: '2026-08-01',
    periodEnd: '2026-08-31',
    payDate: '2026-08-31',
    totalEmployees: 48,
    grossDisbursement: 3840000,
    totalPFDeduction: 288000,
    totalESIDeduction: 32400,
    totalTDSDeduction: 412000,
    netPayout: 3107600,
    status: 'PENDING_APPROVAL',
    disbursementMode: 'DIRECT_BANK_TRANSFER'
  },
  {
    id: 'pay_jul_2026',
    month: 'July 2026',
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    payDate: '2026-07-31',
    totalEmployees: 47,
    grossDisbursement: 3760000,
    totalPFDeduction: 282000,
    totalESIDeduction: 31800,
    totalTDSDeduction: 398000,
    netPayout: 3048200,
    status: 'DISBURSED',
    disbursementMode: 'DIRECT_BANK_TRANSFER'
  },
  {
    id: 'pay_jun_2026',
    month: 'June 2026',
    periodStart: '2026-06-01',
    periodEnd: '2026-06-30',
    payDate: '2026-06-30',
    totalEmployees: 45,
    grossDisbursement: 3580000,
    totalPFDeduction: 268500,
    totalESIDeduction: 30200,
    totalTDSDeduction: 375000,
    netPayout: 2906300,
    status: 'DISBURSED',
    disbursementMode: 'DIRECT_BANK_TRANSFER'
  }
];

export const MOCK_PAYSLIPS: EmployeePayslip[] = [
  {
    id: 'slip_01',
    payrollId: 'pay_aug_2026',
    empId: 'emp_01',
    empName: 'Aakash Verma',
    empCode: 'TN-1001',
    designation: 'Principal Architect & VP Tech',
    department: 'Engineering',
    month: 'August 2026',
    payableDays: 31,
    lossOfPayDays: 0,
    earnings: {
      basic: 133333,
      hra: 66667,
      specialAllowance: 50000,
      conveyance: 8000,
      performanceBonus: 8667,
      grossEarnings: 266667
    },
    deductions: {
      employeePF: 16000,
      employerPF: 16000,
      esic: 0,
      professionalTax: 200,
      tdsTax: 38500,
      otherDeductions: 0,
      totalDeductions: 54700
    },
    netPayable: 211967,
    status: 'READY'
  },
  {
    id: 'slip_02',
    payrollId: 'pay_aug_2026',
    empId: 'emp_02',
    empName: 'Priya Sharma',
    empCode: 'TN-1002',
    designation: 'Head of Human Resources',
    department: 'Human Resources',
    month: 'August 2026',
    payableDays: 31,
    lossOfPayDays: 0,
    earnings: {
      basic: 100000,
      hra: 50000,
      specialAllowance: 38000,
      conveyance: 6000,
      performanceBonus: 6000,
      grossEarnings: 200000
    },
    deductions: {
      employeePF: 12000,
      employerPF: 12000,
      esic: 0,
      professionalTax: 200,
      tdsTax: 24500,
      otherDeductions: 0,
      totalDeductions: 36700
    },
    netPayable: 163300,
    status: 'READY'
  },
  {
    id: 'slip_03',
    payrollId: 'pay_aug_2026',
    empId: 'emp_04',
    empName: 'Sneha Mukherjee',
    empCode: 'TN-1004',
    designation: 'Senior Frontend Engineer',
    department: 'Engineering',
    month: 'August 2026',
    payableDays: 31,
    lossOfPayDays: 0,
    earnings: {
      basic: 66667,
      hra: 33333,
      specialAllowance: 25000,
      conveyance: 4000,
      performanceBonus: 4333,
      grossEarnings: 133333
    },
    deductions: {
      employeePF: 8000,
      employerPF: 8000,
      esic: 0,
      professionalTax: 200,
      tdsTax: 12800,
      otherDeductions: 0,
      totalDeductions: 21000
    },
    netPayable: 112333,
    status: 'READY'
  }
];

export const MOCK_INCREMENTS: IncrementProposal[] = [
  {
    id: 'inc_01',
    empId: 'emp_04',
    empName: 'Sneha Mukherjee',
    empCode: 'TN-1004',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    currentCTC: 1600000,
    proposedHikePercent: 18.75,
    proposedCTC: 1900000,
    effectiveDate: '2026-10-01',
    appraisalRating: 'OUTSTANDING',
    managerRemarks: 'Led the UI modernization initiative and delivered all Phase 1-6 modules flawlessly.',
    status: 'APPROVED'
  },
  {
    id: 'inc_02',
    empId: 'emp_03',
    empName: 'Vikram Joshi',
    empCode: 'TN-1003',
    department: 'Finance & Accounts',
    designation: 'Lead Payroll & Statutory Officer',
    currentCTC: 1950000,
    proposedHikePercent: 12.82,
    proposedCTC: 2200000,
    effectiveDate: '2026-10-01',
    appraisalRating: 'EXCEEDS_EXPECTATIONS',
    managerRemarks: 'Zero statutory non-compliance citations and automated PF ECR generation.',
    status: 'HR_REVIEW'
  },
  {
    id: 'inc_03',
    empId: 'emp_06',
    empName: 'Ananya Roy',
    empCode: 'TN-1006',
    department: 'Product Design',
    designation: 'Senior Product Designer',
    currentCTC: 1500000,
    proposedHikePercent: 13.33,
    proposedCTC: 1700000,
    effectiveDate: '2026-10-01',
    appraisalRating: 'EXCEEDS_EXPECTATIONS',
    managerRemarks: 'Created comprehensive Figma design system and standard component library.',
    status: 'HR_REVIEW'
  }
];

export const MOCK_STATUTORY_FILINGS: StatutoryFiling[] = [
  {
    id: 'stat_01',
    statuteName: 'Employees Provident Fund (EPFO) - Monthly ECR',
    filingCode: 'EPF-ECR-M',
    category: 'EPFO_PF',
    frequency: 'MONTHLY',
    dueDate: '2026-09-15',
    targetMonth: 'August 2026',
    filingStatus: 'DUE_SOON',
    amountDue: 576000,
    penaltyRisk: 'NONE'
  },
  {
    id: 'stat_02',
    statuteName: 'Employees State Insurance (ESIC) Return',
    filingCode: 'ESIC-CHALLAN',
    category: 'ESIC',
    frequency: 'MONTHLY',
    dueDate: '2026-09-15',
    targetMonth: 'August 2026',
    filingStatus: 'DUE_SOON',
    amountDue: 64800,
    penaltyRisk: 'NONE'
  },
  {
    id: 'stat_03',
    statuteName: 'Tax Deducted at Source (TDS 24Q) Deposit',
    filingCode: 'IT-CHALLAN-281',
    category: 'TDS_INCOME_TAX',
    frequency: 'MONTHLY',
    dueDate: '2026-09-07',
    targetMonth: 'August 2026',
    filingStatus: 'DUE_SOON',
    amountDue: 412000,
    penaltyRisk: 'LOW'
  },
  {
    id: 'stat_04',
    statuteName: 'Karnataka Professional Tax (PT Form 5A)',
    filingCode: 'KA-PT-RETURN',
    category: 'PROFESSIONAL_TAX',
    frequency: 'MONTHLY',
    dueDate: '2026-09-20',
    targetMonth: 'August 2026',
    filingStatus: 'COMPLIANT',
    amountDue: 9600,
    challanNumber: 'KAPT20260812903',
    filedDate: '2026-08-20',
    penaltyRisk: 'NONE'
  },
  {
    id: 'stat_05',
    statuteName: 'Quarterly TDS Return (Form 24Q - Q1)',
    filingCode: 'TDS-24Q-Q1',
    category: 'TDS_INCOME_TAX',
    frequency: 'QUARTERLY',
    dueDate: '2026-07-31',
    targetMonth: 'Q1 FY 2026-27',
    filingStatus: 'FILED',
    amountDue: 1184000,
    challanNumber: 'TDS24Q9910291',
    filedDate: '2026-07-28',
    penaltyRisk: 'NONE'
  }
];

export const MOCK_ASSETS: AssetRecord[] = [
  {
    id: 'ast_01',
    assetTag: 'AST-TN-2024-001',
    assetName: 'MacBook Pro 16" M3 Max (36GB / 1TB)',
    category: 'LAPTOP',
    brand: 'Apple',
    serialNumber: 'C02G9981MD6R',
    assignedToEmpId: 'emp_01',
    assignedToEmpName: 'Aakash Verma',
    assignedDate: '2024-01-15',
    purchaseDate: '2024-01-10',
    purchaseValue: 299000,
    warrantyExpiry: '2027-01-09',
    condition: 'EXCELLENT',
    status: 'ASSIGNED'
  },
  {
    id: 'ast_02',
    assetTag: 'AST-TN-2024-002',
    assetName: 'MacBook Pro 14" M3 Pro (18GB / 512GB)',
    category: 'LAPTOP',
    brand: 'Apple',
    serialNumber: 'C02K4412MD8S',
    assignedToEmpId: 'emp_04',
    assignedToEmpName: 'Sneha Mukherjee',
    assignedDate: '2024-03-20',
    purchaseDate: '2024-03-15',
    purchaseValue: 199000,
    warrantyExpiry: '2027-03-14',
    condition: 'EXCELLENT',
    status: 'ASSIGNED'
  },
  {
    id: 'ast_03',
    assetTag: 'AST-TN-2024-003',
    assetName: 'Dell UltraSharp 27" 4K USB-C Monitor',
    category: 'MONITOR',
    brand: 'Dell',
    serialNumber: 'CN-098K12-742',
    assignedToEmpId: 'emp_06',
    assignedToEmpName: 'Ananya Roy',
    assignedDate: '2024-02-20',
    purchaseDate: '2024-02-18',
    purchaseValue: 48000,
    warrantyExpiry: '2027-02-17',
    condition: 'EXCELLENT',
    status: 'ASSIGNED'
  },
  {
    id: 'ast_04',
    assetTag: 'AST-TN-2024-004',
    assetName: 'ThinkPad T14s Gen 4 (AMD Ryzen 7 / 32GB)',
    category: 'LAPTOP',
    brand: 'Lenovo',
    serialNumber: 'PF38192X',
    assignedToEmpId: null,
    assignedToEmpName: null,
    assignedDate: null,
    purchaseDate: '2024-05-10',
    purchaseValue: 125000,
    warrantyExpiry: '2027-05-09',
    condition: 'EXCELLENT',
    status: 'IN_STOCK'
  },
  {
    id: 'ast_05',
    assetTag: 'AST-TN-2024-005',
    assetName: 'Figma Enterprise License Seat',
    category: 'LICENSE',
    brand: 'Figma Inc',
    serialNumber: 'LIC-FIGMA-ENT-092',
    assignedToEmpId: 'emp_06',
    assignedToEmpName: 'Ananya Roy',
    assignedDate: '2024-02-16',
    purchaseDate: '2024-01-01',
    purchaseValue: 75000,
    warrantyExpiry: '2026-12-31',
    condition: 'EXCELLENT',
    status: 'ASSIGNED'
  }
];

export const MOCK_WORKFLOWS: WorkflowRule[] = [
  {
    id: 'wf_01',
    title: 'Standard Leave Approval Workflow',
    triggerEvent: 'LEAVE_APPLICATION',
    description: 'Direct Reporting Manager approval required; auto-escalates to HR Head after 48 hours.',
    approvalLevels: [
      { level: 1, approverRole: 'Direct Reporting Manager', slaHours: 24, autoEscalate: true },
      { level: 2, approverRole: 'HR Manager', slaHours: 48, autoEscalate: false }
    ],
    isActive: true,
    totalExecutions: 312,
    lastTriggered: '2026-08-25 10:02 AM'
  },
  {
    id: 'wf_02',
    title: 'Annual Compensation Increment Workflow',
    triggerEvent: 'SALARY_INCREMENT',
    description: 'Requires Department Head recommendation followed by Finance Head and CEO sign-off.',
    approvalLevels: [
      { level: 1, approverRole: 'Department Head', slaHours: 72, autoEscalate: false },
      { level: 2, approverRole: 'Head of Human Resources', slaHours: 48, autoEscalate: false },
      { level: 3, approverRole: 'Managing Director / CEO', slaHours: 72, autoEscalate: false }
    ],
    isActive: true,
    totalExecutions: 48,
    lastTriggered: '2026-08-22 03:45 PM'
  },
  {
    id: 'wf_03',
    title: 'IT Hardware & Laptop Provisioning',
    triggerEvent: 'ASSET_REQUEST',
    description: 'Automated notification to IT Operations on new employee hire joining date.',
    approvalLevels: [
      { level: 1, approverRole: 'IT Operations Lead', slaHours: 24, autoEscalate: true }
    ],
    isActive: true,
    totalExecutions: 19,
    lastTriggered: '2026-08-15 11:30 AM'
  }
];

export const MOCK_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dept_01',
    name: 'Engineering & Technology',
    code: 'ENG',
    headOfDept: 'Aakash Verma',
    headcount: 24,
    budgetAllocated: 48000000,
    location: 'Bengaluru Tech Park (HQ)'
  },
  {
    id: 'dept_02',
    name: 'Human Resources & Talent',
    code: 'HR',
    headOfDept: 'Priya Sharma',
    headcount: 5,
    budgetAllocated: 8500000,
    location: 'Bengaluru Tech Park (HQ)'
  },
  {
    id: 'dept_03',
    name: 'Finance & Statutory Accounts',
    code: 'FIN',
    headOfDept: 'Vikram Joshi',
    headcount: 4,
    budgetAllocated: 6500000,
    location: 'Mumbai Branch Office'
  },
  {
    id: 'dept_04',
    name: 'Product Design & UX',
    code: 'DES',
    headOfDept: 'Ananya Roy',
    headcount: 6,
    budgetAllocated: 11000000,
    location: 'Bengaluru Tech Park (HQ)'
  },
  {
    id: 'dept_05',
    name: 'Quality Assurance & SecOps',
    code: 'QA',
    headOfDept: 'Aakash Verma',
    headcount: 9,
    budgetAllocated: 9200000,
    location: 'Chennai Tech Center'
  }
];

export const MOCK_DESIGNATIONS: DesignationItem[] = [
  { id: 'desig_01', title: 'Principal Architect & VP Tech', band: 'E-6 Executive', department: 'Engineering', totalEmployees: 1, minExperienceYears: 10 },
  { id: 'desig_02', title: 'Senior Software Engineer', band: 'E-3 Senior', department: 'Engineering', totalEmployees: 12, minExperienceYears: 4 },
  { id: 'desig_03', title: 'Head of Human Resources', band: 'E-5 Director', department: 'Human Resources', totalEmployees: 1, minExperienceYears: 8 },
  { id: 'desig_04', title: 'Lead Payroll Officer', band: 'E-4 Lead', department: 'Finance & Accounts', totalEmployees: 2, minExperienceYears: 6 },
  { id: 'desig_05', title: 'Senior Product Designer', band: 'E-3 Senior', department: 'Product Design', totalEmployees: 3, minExperienceYears: 5 },
  { id: 'desig_06', title: 'QA Automation Specialist', band: 'E-2 Associate', department: 'Quality Assurance', totalEmployees: 5, minExperienceYears: 2 }
];
