import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  TenantCompany,
  CompanyAddress,
  CompanyContact,
  FinancialYearConfig,
  PayrollCycleConfig,
  WorkingDaysConfig,
  HolidayItem,
  AuditLogEntry,
  CompanyCompletePayload
} from './src/types.js';

// Seed Database with Multi-Tenant Separation
interface TenantDataStore {
  company: TenantCompany;
  addresses: CompanyAddress[];
  contacts: CompanyContact[];
  financialYear: FinancialYearConfig;
  payrollConfig: PayrollCycleConfig;
  workingDays: WorkingDaysConfig;
  holidays: HolidayItem[];
  auditLogs: AuditLogEntry[];
}

const mockDatabase: Record<string, TenantDataStore> = {
  comp_technova_01: {
    company: {
      id: 'comp_technova_01',
      name: 'TechNova Solutions',
      legalName: 'TechNova Solutions India Private Limited',
      brandName: 'TechNova Enterprise HRMS',
      domain: 'technova.io',
      logoUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=128&auto=format&fit=crop&q=80',
      industry: 'Enterprise Software & Cloud SaaS',
      cinNumber: 'U72200KA2018PTC112345',
      panNumber: 'AABCT1234F',
      gstinNumber: '29AABCT1234F1Z5',
      tanNumber: 'BLRT12345E',
      pfRegistrationNumber: 'KN/BLR/1098765/000',
      esiRegistrationNumber: '53000987650001001',
      foundedDate: '2018-04-15',
      website: 'https://technovasolutions.com',
      status: 'ACTIVE',
      currency: 'INR (₹)',
      timezone: 'Asia/Kolkata (GMT+05:30)',
      createdAt: '2021-01-10T08:00:00.000Z',
      updatedAt: '2026-08-25T09:30:00.000Z',
    },
    addresses: [
      {
        id: 'addr_01',
        companyId: 'comp_technova_01',
        type: 'REGISTERED',
        isPrimary: true,
        addressLine1: 'TechNova Tower, 4th Floor, Outer Ring Road',
        addressLine2: 'Bellandur, Devarabisanahalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
        landmark: 'Near EcoSpace Tech Park',
      },
      {
        id: 'addr_02',
        companyId: 'comp_technova_01',
        type: 'CORPORATE',
        isPrimary: false,
        addressLine1: 'Cyber Towers, Level 7, Hitec City',
        addressLine2: 'Madhapur',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        country: 'India',
        landmark: 'Opposite Cyber Pearl',
      },
      {
        id: 'addr_03',
        companyId: 'comp_technova_01',
        type: 'BILLING',
        isPrimary: false,
        addressLine1: 'TechNova Tower, Accounts Wing, 4th Floor',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560103',
        country: 'India',
      }
    ],
    contacts: [
      {
        id: 'cont_01',
        companyId: 'comp_technova_01',
        type: 'PRIMARY_ADMIN',
        fullName: 'John Admin',
        designation: 'VP of People Operations',
        email: 'john.admin@technova.io',
        phone: '+91 98450 12345',
        isEmergencyEscalation: true,
      },
      {
        id: 'cont_02',
        companyId: 'comp_technova_01',
        type: 'HR_HEAD',
        fullName: 'Sarah Jenkins',
        designation: 'Head of Human Resources',
        email: 'sarah.jenkins@technova.io',
        phone: '+91 98450 23456',
        isEmergencyEscalation: true,
      },
      {
        id: 'cont_03',
        companyId: 'comp_technova_01',
        type: 'PAYROLL_OFFICER',
        fullName: 'Ramesh Sundaram',
        designation: 'Senior Payroll Lead',
        email: 'payroll@technova.io',
        phone: '+91 98450 34567',
        isEmergencyEscalation: false,
      },
      {
        id: 'cont_04',
        companyId: 'comp_technova_01',
        type: 'COMPLIANCE_OFFICER',
        fullName: 'Ananya Verma',
        designation: 'Legal & Statutory Advisor',
        email: 'compliance@technova.io',
        phone: '+91 98450 45678',
        isEmergencyEscalation: false,
      }
    ],
    financialYear: {
      id: 'fy_01',
      companyId: 'comp_technova_01',
      startMonth: 4, // April
      endMonth: 3,   // March
      currentFYName: 'FY 2026-2027',
      isLocked: false,
      currencySymbol: '₹',
      currencyCode: 'INR',
      decimalPlaces: 2,
      roundingMethod: 'NEAREST_ONE',
    },
    payrollConfig: {
      id: 'prc_01',
      companyId: 'comp_technova_01',
      payFrequency: 'MONTHLY',
      cutOffDay: 25,
      payDay: 31,
      salaryCalculationBasis: 'ACTUAL_WORKING_DAYS',
      allowNegativeSalary: false,
      prorateFirstMonth: true,
      overtimeCalculationRate: 1.5,
      attendanceCutOffDay: 24,
      autoProcessOnDisbursementDate: false,
    },
    workingDays: {
      id: 'wd_01',
      companyId: 'comp_technova_01',
      workScheduleName: 'Standard 5-Day Work Week (Mon - Fri)',
      weeklySchedule: [
        { day: 'MONDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'TUESDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'WEDNESDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'THURSDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'FRIDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'SATURDAY', isWorkingDay: false, isHalfDay: false, standardHours: 0, alternateWeekRule: 'NONE' },
        { day: 'SUNDAY', isWorkingDay: false, isHalfDay: false, standardHours: 0 },
      ],
      defaultShiftStartTime: '09:00',
      defaultShiftEndTime: '18:00',
      breakDurationMinutes: 60,
      gracePeriodMinutes: 15,
    },
    holidays: [
      {
        id: 'hol_01',
        companyId: 'comp_technova_01',
        holidayName: 'Republic Day',
        holidayDate: '2026-01-26',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
        description: 'National holiday commemorating the Constitution of India.',
      },
      {
        id: 'hol_02',
        companyId: 'comp_technova_01',
        holidayName: 'Holi Festival',
        holidayDate: '2026-03-04',
        holidayType: 'FESTIVAL',
        isRecurringAnnually: false,
        description: 'Spring festival of colors celebrating renewal and joy.',
      },
      {
        id: 'hol_03',
        companyId: 'comp_technova_01',
        holidayName: 'May Day (Labor Day)',
        holidayDate: '2026-05-01',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
        description: 'International Workers Day statutory paid holiday.',
      },
      {
        id: 'hol_04',
        companyId: 'comp_technova_01',
        holidayName: 'Independence Day',
        holidayDate: '2026-08-15',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
        description: 'National statutory holiday marking 79 years of independence.',
      },
      {
        id: 'hol_05',
        companyId: 'comp_technova_01',
        holidayName: 'Mahatma Gandhi Jayanti',
        holidayDate: '2026-10-02',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
        description: 'Gazetted national paid holiday across all branches.',
      },
      {
        id: 'hol_06',
        companyId: 'comp_technova_01',
        holidayName: 'Diwali (Deepavali)',
        holidayDate: '2026-11-08',
        holidayType: 'FESTIVAL',
        isRecurringAnnually: false,
        description: 'Festival of lights celebrated nationally.',
      },
      {
        id: 'hol_07',
        companyId: 'comp_technova_01',
        holidayName: 'Christmas Day',
        holidayDate: '2026-12-25',
        holidayType: 'FESTIVAL',
        isRecurringAnnually: true,
        description: 'Statutory winter holiday.',
      }
    ],
    auditLogs: [
      {
        id: 'aud_01',
        companyId: 'comp_technova_01',
        module: 'COMPANY_MANAGEMENT',
        action: 'CONFIGURATION_CHANGE',
        entityName: 'PayrollCycleConfig',
        entityId: 'prc_01',
        performedBy: {
          userId: 'usr_admin_01',
          userName: 'John Admin',
          userEmail: 'john.admin@technova.io',
          role: 'COMPANY_ADMIN',
        },
        previousValue: { cutOffDay: 20, payDay: 28 },
        newValue: { cutOffDay: 25, payDay: 31 },
        changeSummary: 'Updated payroll cut-off day to 25th and disbursement day to 31st.',
        timestamp: '2026-08-25T08:15:30.000Z',
        ipAddress: '192.168.1.104',
      },
      {
        id: 'aud_02',
        companyId: 'comp_technova_01',
        module: 'COMPANY_MANAGEMENT',
        action: 'UPDATE',
        entityName: 'CompanyAddress',
        entityId: 'addr_02',
        performedBy: {
          userId: 'usr_admin_01',
          userName: 'John Admin',
          userEmail: 'john.admin@technova.io',
          role: 'COMPANY_ADMIN',
        },
        changeSummary: 'Added corporate regional branch office address for Hyderabad facility.',
        timestamp: '2026-08-24T14:22:10.000Z',
        ipAddress: '192.168.1.104',
      },
      {
        id: 'aud_03',
        companyId: 'comp_technova_01',
        module: 'COMPANY_MANAGEMENT',
        action: 'CREATE',
        entityName: 'HolidayItem',
        entityId: 'hol_07',
        performedBy: {
          userId: 'usr_admin_01',
          userName: 'John Admin',
          userEmail: 'john.admin@technova.io',
          role: 'COMPANY_ADMIN',
        },
        changeSummary: 'Published 2026 Annual Statutory Holiday Calendar for Indian Branches.',
        timestamp: '2026-08-20T10:05:00.000Z',
        ipAddress: '192.168.1.104',
      }
    ]
  },
  // Second Tenant for multi-tenant isolation demonstration
  comp_apex_02: {
    company: {
      id: 'comp_apex_02',
      name: 'Apex Global Systems',
      legalName: 'Apex Global Logistics & Systems Corp',
      brandName: 'Apex Global',
      domain: 'apexglobal.com',
      industry: 'Supply Chain & Logistics SaaS',
      cinNumber: 'U63090MH2019PTC998877',
      panNumber: 'BBACX5432K',
      gstinNumber: '27BBACX5432K1ZP',
      foundedDate: '2019-09-01',
      website: 'https://apexglobal.com',
      status: 'ACTIVE',
      currency: 'USD ($)',
      timezone: 'America/New_York (GMT-04:00)',
      createdAt: '2022-03-15T08:00:00.000Z',
      updatedAt: '2026-08-24T11:00:00.000Z',
    },
    addresses: [
      {
        id: 'addr_apex_01',
        companyId: 'comp_apex_02',
        type: 'REGISTERED',
        isPrimary: true,
        addressLine1: '100 Wall Street, Suite 1400',
        city: 'New York',
        state: 'NY',
        postalCode: '10005',
        country: 'United States',
      }
    ],
    contacts: [
      {
        id: 'cont_apex_01',
        companyId: 'comp_apex_02',
        type: 'PRIMARY_ADMIN',
        fullName: 'Elena Rostova',
        designation: 'Operations Director',
        email: 'elena.rostova@apexglobal.com',
        phone: '+1 212 555 0199',
        isEmergencyEscalation: true,
      }
    ],
    financialYear: {
      id: 'fy_apex_01',
      companyId: 'comp_apex_02',
      startMonth: 1, // January
      endMonth: 12,  // December
      currentFYName: 'FY 2026',
      isLocked: false,
      currencySymbol: '$',
      currencyCode: 'USD',
      decimalPlaces: 2,
      roundingMethod: 'DECIMAL_ROUND',
    },
    payrollConfig: {
      id: 'prc_apex_01',
      companyId: 'comp_apex_02',
      payFrequency: 'BI_WEEKLY',
      cutOffDay: 14,
      payDay: 15,
      salaryCalculationBasis: 'ACTUAL_WORKING_DAYS',
      allowNegativeSalary: false,
      prorateFirstMonth: true,
      overtimeCalculationRate: 1.5,
      attendanceCutOffDay: 13,
      autoProcessOnDisbursementDate: true,
    },
    workingDays: {
      id: 'wd_apex_01',
      companyId: 'comp_apex_02',
      workScheduleName: 'Standard 40h US Work Week',
      weeklySchedule: [
        { day: 'MONDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'TUESDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'WEDNESDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'THURSDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'FRIDAY', isWorkingDay: true, isHalfDay: false, standardHours: 8 },
        { day: 'SATURDAY', isWorkingDay: false, isHalfDay: false, standardHours: 0 },
        { day: 'SUNDAY', isWorkingDay: false, isHalfDay: false, standardHours: 0 },
      ],
      defaultShiftStartTime: '08:30',
      defaultShiftEndTime: '17:30',
      breakDurationMinutes: 60,
      gracePeriodMinutes: 10,
    },
    holidays: [
      {
        id: 'hol_apex_01',
        companyId: 'comp_apex_02',
        holidayName: 'New Year Day',
        holidayDate: '2026-01-01',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
      },
      {
        id: 'hol_apex_02',
        companyId: 'comp_apex_02',
        holidayName: 'Independence Day (US)',
        holidayDate: '2026-07-04',
        holidayType: 'NATIONAL',
        isRecurringAnnually: true,
      }
    ],
    auditLogs: [
      {
        id: 'aud_apex_01',
        companyId: 'comp_apex_02',
        module: 'COMPANY_MANAGEMENT',
        action: 'CREATE',
        entityName: 'TenantCompany',
        entityId: 'comp_apex_02',
        performedBy: {
          userId: 'usr_apex_01',
          userName: 'Elena Rostova',
          userEmail: 'elena.rostova@apexglobal.com',
          role: 'COMPANY_ADMIN',
        },
        changeSummary: 'Initialized tenant workspace for Apex Global Systems.',
        timestamp: '2026-08-24T11:00:00.000Z',
        ipAddress: '10.0.0.45',
      }
    ]
  }
};

// Helper to extract tenant ID and verify tenant isolation
function getTenantId(req: express.Request): string {
  const tenantHeader = req.headers['x-tenant-id'] as string;
  if (tenantHeader && mockDatabase[tenantHeader]) {
    return tenantHeader;
  }
  return 'comp_technova_01'; // Default tenant
}

function recordAudit(
  tenantId: string,
  action: AuditLogEntry['action'],
  entityName: string,
  entityId: string,
  summary: string,
  prevVal?: Record<string, any>,
  newVal?: Record<string, any>,
  req?: express.Request
) {
  const store = mockDatabase[tenantId];
  if (!store) return;

  const entry: AuditLogEntry = {
    id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    companyId: tenantId,
    module: 'COMPANY_MANAGEMENT',
    action,
    entityName,
    entityId,
    performedBy: {
      userId: 'usr_admin_01',
      userName: 'John Admin',
      userEmail: 'john.admin@technova.io',
      role: 'COMPANY_ADMIN',
    },
    previousValue: prevVal,
    newValue: newVal,
    changeSummary: summary,
    timestamp: new Date().toISOString(),
    ipAddress: req?.ip || '127.0.0.1',
    userAgent: req?.headers['user-agent'],
  };

  store.auditLogs.unshift(entry);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (RESTful Multi-Tenant HRMS Backend) ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'TechNova HRMS SaaS API',
      timestamp: new Date().toISOString(),
      activeTenant: getTenantId(req),
    });
  });

  // Get list of tenants (for admin multi-tenant testing switcher)
  app.get('/api/tenants', (req, res) => {
    const tenants = Object.keys(mockDatabase).map((key) => {
      const c = mockDatabase[key].company;
      return {
        id: c.id,
        name: c.name,
        brandName: c.brandName,
        domain: c.domain,
        currency: c.currency,
        status: c.status,
      };
    });
    res.json({ tenants });
  });

  // Get complete company bundle for active tenant
  app.get('/api/company', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) {
      return res.status(404).json({ error: 'Tenant company not found' });
    }

    const payload: CompanyCompletePayload = {
      company: store.company,
      addresses: store.addresses,
      contacts: store.contacts,
      financialYear: store.financialYear,
      payrollConfig: store.payrollConfig,
      workingDays: store.workingDays,
      holidays: store.holidays,
      recentAuditLogs: store.auditLogs.slice(0, 50),
    };

    res.json(payload);
  });

  // Update company profile details
  app.put('/api/company/profile', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const prev = { ...store.company };
    const updates = req.body;

    // Strict validation
    if (!updates.name || updates.name.trim().length < 2) {
      return res.status(400).json({ error: 'Company Name is required (minimum 2 characters).' });
    }
    if (!updates.legalName || updates.legalName.trim().length < 2) {
      return res.status(400).json({ error: 'Legal Entity Name is required for statutory filings.' });
    }
    if (!updates.panNumber || updates.panNumber.trim().length < 5) {
      return res.status(400).json({ error: 'Valid PAN / Tax ID is required for corporate registration.' });
    }

    store.company = {
      ...store.company,
      ...updates,
      id: tenantId, // Guard against tenant ID modification
      updatedAt: new Date().toISOString(),
    };

    recordAudit(
      tenantId,
      'UPDATE',
      'TenantCompany',
      tenantId,
      `Updated company profile for ${store.company.name} (Legal: ${store.company.legalName})`,
      prev,
      store.company,
      req
    );

    res.json({ success: true, company: store.company });
  });

  // Update or manage company addresses
  app.put('/api/company/addresses', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { addresses } = req.body;
    if (!Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({ error: 'At least one primary registered address is required.' });
    }

    // Ensure companyId is strictly enforced
    const sanitizedAddresses = addresses.map((addr, idx) => ({
      ...addr,
      id: addr.id || `addr_${Date.now()}_${idx}`,
      companyId: tenantId,
    }));

    const prev = [...store.addresses];
    store.addresses = sanitizedAddresses;

    recordAudit(
      tenantId,
      'UPDATE',
      'CompanyAddress',
      tenantId,
      `Updated corporate address book (${sanitizedAddresses.length} addresses defined)`,
      prev,
      sanitizedAddresses,
      req
    );

    res.json({ success: true, addresses: store.addresses });
  });

  // Update company contacts
  app.put('/api/company/contacts', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { contacts } = req.body;
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({ error: 'At least one primary administrative contact is required.' });
    }

    const sanitizedContacts = contacts.map((c, idx) => ({
      ...c,
      id: c.id || `cont_${Date.now()}_${idx}`,
      companyId: tenantId,
    }));

    const prev = [...store.contacts];
    store.contacts = sanitizedContacts;

    recordAudit(
      tenantId,
      'UPDATE',
      'CompanyContact',
      tenantId,
      `Updated organizational key stakeholders & compliance officers list`,
      prev,
      sanitizedContacts,
      req
    );

    res.json({ success: true, contacts: store.contacts });
  });

  // Update financial year & currency configuration
  app.put('/api/company/financial-year', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const updates: Partial<FinancialYearConfig> = req.body;
    const prev = { ...store.financialYear };

    store.financialYear = {
      ...store.financialYear,
      ...updates,
      companyId: tenantId,
    };

    recordAudit(
      tenantId,
      'CONFIGURATION_CHANGE',
      'FinancialYearConfig',
      store.financialYear.id,
      `Updated Financial Year parameters: ${store.financialYear.currentFYName}, Currency: ${store.financialYear.currencyCode}`,
      prev,
      store.financialYear,
      req
    );

    res.json({ success: true, financialYear: store.financialYear });
  });

  // Update payroll configuration & cycle
  app.put('/api/company/payroll-config', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const updates: Partial<PayrollCycleConfig> = req.body;
    const prev = { ...store.payrollConfig };

    // Validation
    if (updates.cutOffDay && (updates.cutOffDay < 1 || updates.cutOffDay > 31)) {
      return res.status(400).json({ error: 'Cut-off day must be between 1 and 31.' });
    }
    if (updates.payDay && (updates.payDay < 1 || updates.payDay > 31)) {
      return res.status(400).json({ error: 'Pay day must be between 1 and 31.' });
    }

    store.payrollConfig = {
      ...store.payrollConfig,
      ...updates,
      companyId: tenantId,
    };

    recordAudit(
      tenantId,
      'CONFIGURATION_CHANGE',
      'PayrollCycleConfig',
      store.payrollConfig.id,
      `Updated payroll processing cycle: ${store.payrollConfig.payFrequency}, Cut-off: Day ${store.payrollConfig.cutOffDay}, Payday: Day ${store.payrollConfig.payDay}`,
      prev,
      store.payrollConfig,
      req
    );

    res.json({ success: true, payrollConfig: store.payrollConfig });
  });

  // Update working days and work schedule
  app.put('/api/company/working-days', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const updates: Partial<WorkingDaysConfig> = req.body;
    const prev = { ...store.workingDays };

    store.workingDays = {
      ...store.workingDays,
      ...updates,
      companyId: tenantId,
    };

    recordAudit(
      tenantId,
      'CONFIGURATION_CHANGE',
      'WorkingDaysConfig',
      store.workingDays.id,
      `Updated organizational weekly working schedule and default shift timings`,
      prev,
      store.workingDays,
      req
    );

    res.json({ success: true, workingDays: store.workingDays });
  });

  // Holiday management
  app.get('/api/company/holidays', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ holidays: store.holidays });
  });

  app.post('/api/company/holidays', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { holidayName, holidayDate, holidayType, isRecurringAnnually, description } = req.body;
    if (!holidayName || !holidayDate) {
      return res.status(400).json({ error: 'Holiday Name and Date are required.' });
    }

    const newHoliday: HolidayItem = {
      id: `hol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      companyId: tenantId,
      holidayName: holidayName.trim(),
      holidayDate,
      holidayType: holidayType || 'FESTIVAL',
      isRecurringAnnually: Boolean(isRecurringAnnually),
      description,
    };

    store.holidays.push(newHoliday);
    // Sort chronologically
    store.holidays.sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime());

    recordAudit(
      tenantId,
      'CREATE',
      'HolidayItem',
      newHoliday.id,
      `Added statutory holiday '${newHoliday.holidayName}' scheduled for ${newHoliday.holidayDate}`,
      undefined,
      newHoliday,
      req
    );

    res.json({ success: true, holiday: newHoliday, holidays: store.holidays });
  });

  app.put('/api/company/holidays/:id', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { id } = req.params;
    const index = store.holidays.findIndex((h) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Holiday not found' });
    }

    const prev = { ...store.holidays[index] };
    store.holidays[index] = {
      ...store.holidays[index],
      ...req.body,
      id,
      companyId: tenantId,
    };

    // Sort chronologically
    store.holidays.sort((a, b) => new Date(a.holidayDate).getTime() - new Date(b.holidayDate).getTime());

    recordAudit(
      tenantId,
      'UPDATE',
      'HolidayItem',
      id,
      `Modified holiday item '${store.holidays[index].holidayName}'`,
      prev,
      store.holidays[index],
      req
    );

    res.json({ success: true, holiday: store.holidays[index], holidays: store.holidays });
  });

  app.delete('/api/company/holidays/:id', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { id } = req.params;
    const index = store.holidays.findIndex((h) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Holiday not found' });
    }

    const deleted = store.holidays[index];
    store.holidays.splice(index, 1);

    recordAudit(
      tenantId,
      'DELETE',
      'HolidayItem',
      id,
      `Removed holiday '${deleted.holidayName}' (${deleted.holidayDate}) from statutory calendar`,
      deleted,
      undefined,
      req
    );

    res.json({ success: true, holidays: store.holidays });
  });

  // Audit Logs
  app.get('/api/company/audit-logs', (req, res) => {
    const tenantId = getTenantId(req);
    const store = mockDatabase[tenantId];
    if (!store) return res.status(404).json({ error: 'Tenant not found' });

    const { search, action, entity } = req.query;
    let logs = [...store.auditLogs];

    if (action) {
      logs = logs.filter((l) => l.action === action);
    }
    if (entity) {
      logs = logs.filter((l) => l.entityName === entity);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.changeSummary.toLowerCase().includes(q) ||
          l.performedBy.userName.toLowerCase().includes(q) ||
          l.entityName.toLowerCase().includes(q)
      );
    }

    res.json({ auditLogs: logs });
  });

  // Vite middleware for development vs static production serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HRMS Backend] TechNova Multi-Tenant Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer();
