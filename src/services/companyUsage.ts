import { supabase } from '../lib/supabase';

/* ================================================================
   COMPANY STORAGE USAGE
   ================================================================ */

export interface CompanyStorageUsage {
  companyId: string;
  tenantId: string;
  storageUsedBytes: number;
  storageUsedGB: number;
  quotaStorageGB: number;
  usagePercent: number;
}

/* ================================================================
   COMPANY API USAGE
   ================================================================ */

export interface CompanyApiUsage {
  companyId: string;
  tenantId: string;
  apiRequestsMTD: number;
  quotaApiRequests: number;
  usagePercent: number;
  monthStart: string;
}

/* ================================================================
   COMPANY E-SIGNATURE USAGE
   ================================================================ */

export interface CompanyESignatureUsage {
  companyId: string;
  tenantId: string;
  eSignaturesCompletedYTD: number;
  eSignaturesGrowth: number;
  currentYTD: number;
  previousYTD: number;
  yearStart: string;
}

/* ================================================================
   COMBINED COMPANY USAGE
   ================================================================ */

export interface CompanyUsage {
  storage: CompanyStorageUsage;
  api: CompanyApiUsage;
  eSignatures: CompanyESignatureUsage;
}

/* ================================================================
   GET LIVE STORAGE USAGE
   ================================================================ */

/**
 * Gets live tenant storage usage from Supabase Storage.
 *
 * Source:
 *   get_company_storage_usage RPC
 *
 * Storage is calculated from:
 *
 *   tenant-files/
 *      {tenant_id}/...
 */
export async function getCompanyStorageUsage(
  companyId: string
): Promise<CompanyStorageUsage> {
  if (!companyId) {
    throw new Error('Company ID is required.');
  }

  const { data, error } = await supabase.rpc(
    'get_company_storage_usage',
    {
      p_company_id: companyId,
    }
  );

  if (error) {
    throw new Error(
      `Unable to load storage usage: ${error.message}`
    );
  }

  const row = Array.isArray(data)
    ? data[0]
    : data;

  if (!row) {
    throw new Error(
      'No storage usage data returned for this company.'
    );
  }

  return {
    companyId: String(
      row.company_id || companyId
    ),

    tenantId: String(
      row.tenant_id || ''
    ),

    storageUsedBytes: Number(
      row.storage_used_bytes || 0
    ),

    storageUsedGB: Number(
      row.storage_used_gb || 0
    ),

    quotaStorageGB: Number(
      row.quota_storage_gb || 0
    ),

    usagePercent: Number(
      row.usage_percent || 0
    ),
  };
}

/* ================================================================
   GET LIVE API REQUEST USAGE - MTD
   ================================================================ */

/**
 * Gets live API request usage for the current month.
 *
 * Source:
 *   api_request_logs
 *
 * Aggregation:
 *   get_company_api_usage RPC
 *
 * MTD means:
 *   Month To Date
 *
 * The RPC counts requests from the beginning of the
 * current calendar month for the company's tenant.
 */
export async function getCompanyApiUsage(
  companyId: string
): Promise<CompanyApiUsage> {
  if (!companyId) {
    throw new Error('Company ID is required.');
  }

  const { data, error } = await supabase.rpc(
    'get_company_api_usage',
    {
      p_company_id: companyId,
    }
  );

  if (error) {
    throw new Error(
      `Unable to load API usage: ${error.message}`
    );
  }

  const row = Array.isArray(data)
    ? data[0]
    : data;

  if (!row) {
    throw new Error(
      'No API usage data returned for this company.'
    );
  }

  return {
    companyId: String(
      row.company_id || companyId
    ),

    tenantId: String(
      row.tenant_id || ''
    ),

    apiRequestsMTD: Number(
      row.api_requests_mtd || 0
    ),

    quotaApiRequests: Number(
      row.quota_api_requests || 0
    ),

    usagePercent: Number(
      row.usage_percent || 0
    ),

    monthStart: String(
      row.month_start || ''
    ),
  };
}

/* ================================================================
   GET LIVE E-SIGNATURE USAGE
   ================================================================ */

/**
 * Gets live e-signature usage.
 *
 * This remains prepared for the next implementation phase.
 */
export async function getCompanyESignatureUsage(
  companyId: string
): Promise<CompanyESignatureUsage> {
  if (!companyId) {
    throw new Error('Company ID is required.');
  }

  const { data, error } = await supabase.rpc(
    'get_company_esignature_usage',
    {
      p_company_id: companyId,
    }
  );

  if (error) {
    throw new Error(
      `Unable to load e-signature usage: ${error.message}`
    );
  }

  const row = Array.isArray(data)
    ? data[0]
    : data;

  if (!row) {
    throw new Error(
      'No e-signature usage data returned.'
    );
  }

  return {
    companyId: String(
      row.company_id || companyId
    ),

    tenantId: String(
      row.tenant_id || ''
    ),

    eSignaturesCompletedYTD: Number(
      row.e_signatures_completed_ytd || 0
    ),

    eSignaturesGrowth: Number(
      row.e_signatures_growth || 0
    ),

    currentYTD: Number(
      row.current_ytd || 0
    ),

    previousYTD: Number(
      row.previous_ytd || 0
    ),

    yearStart: String(
      row.year_start || ''
    ),
  };
}

/* ================================================================
   GET ALL COMPANY USAGE
   ================================================================ */

/**
 * Gets all usage metrics.
 *
 * Do not use this until the e-signature RPC is available.
 */
export async function getCompanyUsage(
  companyId: string
): Promise<CompanyUsage> {
  const [
    storage,
    api,
    eSignatures,
  ] = await Promise.all([
    getCompanyStorageUsage(companyId),
    getCompanyApiUsage(companyId),
    getCompanyESignatureUsage(companyId),
  ]);

  return {
    storage,
    api,
    eSignatures,
  };
}