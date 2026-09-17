/**
 * Multi-tenant HRMS Enterprise Data Types
 */

export interface TenantCompany {
  id: string;
  name: string;
  legalName: string;
  brandName: string;
  domain: string;
  logoUrl?: string;
  industry: string;
  cinNumber: string;
  panNumber: string;
  gstinNumber: string;
  tanNumber?: string;
  pfRegistrationNumber?: string;
  esiRegistrationNumber?: string;
  foundedDate: string;
  website: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyAddress {
  id: string;
  companyId: string;
  type: 'REGISTERED' | 'CORPORATE' | 'BILLING' | 'BRANCH_HQ';
  isPrimary: boolean;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
}

export interface CompanyContact {
  id: string;
  companyId: string;
  type: 'PRIMARY_ADMIN' | 'HR_HEAD' | 'PAYROLL_OFFICER' | 'COMPLIANCE_OFFICER' | 'LEGAL_REPRESENTATIVE';
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  isEmergencyEscalation: boolean;
}

export interface FinancialYearConfig {
  id: string;
  companyId: string;
  startMonth: number; // 4 for April (India) or 1 for January (US/Calendar)
  endMonth: number;   // 3 for March or 12 for December
  currentFYName: string; // e.g. "FY 2026-2027"
  isLocked: boolean;
  currencySymbol: string;
  currencyCode: string;
  decimalPlaces: number;
  roundingMethod: 'NEAREST_ONE' | 'NEAREST_TEN' | 'DECIMAL_ROUND' | 'CEIL' | 'FLOOR';
}

export interface PayrollCycleConfig {
  id: string;
  companyId: string;
  payFrequency: 'MONTHLY' | 'BI_WEEKLY' | 'SEMI_MONTHLY' | 'WEEKLY';
  cutOffDay: number; // e.g. 25th of month
  payDay: number; // e.g. 30th or 1st of next month
  salaryCalculationBasis: 'CALENDAR_DAYS' | 'FIXED_30_DAYS' | 'ACTUAL_WORKING_DAYS';
  allowNegativeSalary: boolean;
  prorateFirstMonth: boolean;
  overtimeCalculationRate: number; // multiplier e.g. 1.5 or 2.0
  attendanceCutOffDay: number;
  autoProcessOnDisbursementDate: boolean;
}

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface WorkingDayRule {
  day: DayOfWeek;
  isWorkingDay: boolean;
  isHalfDay: boolean;
  standardHours: number;
  alternateWeekRule?: 'ALL' | 'ALTERNATE_1_3' | 'ALTERNATE_2_4' | 'NONE'; // For Saturday working rules
}

export interface WorkingDaysConfig {
  id: string;
  companyId: string;
  workScheduleName: string;
  weeklySchedule: WorkingDayRule[];
  defaultShiftStartTime: string; // "09:00"
  defaultShiftEndTime: string;   // "18:00"
  breakDurationMinutes: number;  // 60
  gracePeriodMinutes: number;    // 15 mins for late punch
}

export interface HolidayItem {
  id: string;
  companyId: string;
  holidayName: string;
  holidayDate: string;
  holidayType: 'NATIONAL' | 'STATE' | 'FESTIVAL' | 'OPTIONAL_RESTRICTED';
  isRecurringAnnually: boolean;
  description?: string;
  applicableBranchIds?: string[]; // Empty for all branches
}

export interface AuditLogEntry {
  id: string;
  companyId: string;
  module: 'COMPANY_MANAGEMENT' | 'ORGANIZATION' | 'USER_MANAGEMENT' | 'PAYROLL' | 'COMPLIANCE';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VERIFY' | 'CONFIGURATION_CHANGE';
  entityName: string;
  entityId: string;
  performedBy: {
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
  };
  previousValue?: Record<string, any>;
  newValue?: Record<string, any>;
  changeSummary: string;
  timestamp: string;
  ipAddress: string;
  userAgent?: string;
}

export interface CompanyCompletePayload {
  company: TenantCompany;
  addresses: CompanyAddress[];
  contacts: CompanyContact[];
  financialYear: FinancialYearConfig;
  payrollConfig: PayrollCycleConfig;
  workingDays: WorkingDaysConfig;
  holidays: HolidayItem[];
  recentAuditLogs: AuditLogEntry[];
}
