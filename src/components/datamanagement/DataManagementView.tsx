import React, { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  Download,
  FileArchive,
  FileCheck2,
  FileText,
  HardDrive,
  History,
  Info,
  Layers3,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";

/* ============================================================
   TYPES
============================================================ */

type OperationStatus = "Completed" | "Processing" | "Failed";

interface DataOperation {
  id: number;
  operation: string;
  description: string;
  type: "Import" | "Export" | "Backup" | "Cleanup" | "Sync";
  records: string;
  size: string;
  status: OperationStatus;
  date: string;
  user: string;
}

/* ============================================================
   MOCK DATA
============================================================ */

const initialOperations: DataOperation[] = [
  {
    id: 1,
    operation: "Employee Data Export",
    description: "Employee records exported successfully",
    type: "Export",
    records: "12,486",
    size: "18.4 MB",
    status: "Completed",
    date: "Today, 10:42 AM",
    user: "Super Admin",
  },
  {
    id: 2,
    operation: "Daily Database Backup",
    description: "Automated platform database backup",
    type: "Backup",
    records: "86,420",
    size: "2.8 GB",
    status: "Completed",
    date: "Today, 04:00 AM",
    user: "System",
  },
  {
    id: 3,
    operation: "Company Records Import",
    description: "New company master data imported",
    type: "Import",
    records: "2,148",
    size: "6.2 MB",
    status: "Completed",
    date: "Yesterday, 03:18 PM",
    user: "Super Admin",
  },
  {
    id: 4,
    operation: "Data Synchronization",
    description: "Platform data synchronization in progress",
    type: "Sync",
    records: "34,892",
    size: "—",
    status: "Processing",
    date: "Yesterday, 01:25 PM",
    user: "System",
  },
  {
    id: 5,
    operation: "Old Audit Data Cleanup",
    description: "Archived records older than retention period",
    type: "Cleanup",
    records: "8,924",
    size: "1.1 GB",
    status: "Completed",
    date: "Aug 30, 2026",
    user: "Super Admin",
  },
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function DataManagementView() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "operations" | "storage"
  >("overview");

  const [searchTerm, setSearchTerm] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] =
    useState<DataOperation | null>(null);

  const [operations, setOperations] =
    useState<DataOperation[]>(initialOperations);

  const [isSyncing, setIsSyncing] = useState(false);

  /* ============================================================
     FILTERED OPERATIONS
  ============================================================ */

  const filteredOperations = useMemo(() => {
    return operations.filter((item) => {
      const value = searchTerm.toLowerCase();

      return (
        item.operation.toLowerCase().includes(value) ||
        item.description.toLowerCase().includes(value) ||
        item.type.toLowerCase().includes(value) ||
        item.status.toLowerCase().includes(value) ||
        item.user.toLowerCase().includes(value)
      );
    });
  }, [operations, searchTerm]);

  /* ============================================================
     ACTIONS
  ============================================================ */

  const handleSync = () => {
    if (isSyncing) return;

    setIsSyncing(true);

    setTimeout(() => {
      const newOperation: DataOperation = {
        id: Date.now(),
        operation: "Manual Data Synchronization",
        description: "Platform data synchronization completed",
        type: "Sync",
        records: "42,186",
        size: "—",
        status: "Completed",
        date: "Just now",
        user: "Super Admin",
      };

      setOperations((prev) => [newOperation, ...prev]);
      setIsSyncing(false);
    }, 1800);
  };

  const handleBackup = () => {
    const newOperation: DataOperation = {
      id: Date.now(),
      operation: "Manual Database Backup",
      description: "Super Admin initiated a database backup",
      type: "Backup",
      records: "86,420",
      size: "2.8 GB",
      status: "Processing",
      date: "Just now",
      user: "Super Admin",
    };

    setOperations((prev) => [newOperation, ...prev]);
    setShowBackupModal(false);

    setTimeout(() => {
      setOperations((prev) =>
        prev.map((item) =>
          item.id === newOperation.id
            ? {
                ...item,
                status: "Completed",
                description: "Database backup completed successfully",
              }
            : item
        )
      );
    }, 2000);
  };

  const handleCleanup = () => {
    const newOperation: DataOperation = {
      id: Date.now(),
      operation: "Manual Data Cleanup",
      description: "Platform cleanup process initiated",
      type: "Cleanup",
      records: "3,428",
      size: "420 MB",
      status: "Processing",
      date: "Just now",
      user: "Super Admin",
    };

    setOperations((prev) => [newOperation, ...prev]);
    setShowCleanupModal(false);

    setTimeout(() => {
      setOperations((prev) =>
        prev.map((item) =>
          item.id === newOperation.id
            ? {
                ...item,
                status: "Completed",
                description: "Unused and expired data cleaned",
              }
            : item
        )
      );
    }, 1800);
  };

  const handleExport = () => {
    const newOperation: DataOperation = {
      id: Date.now(),
      operation: "Platform Data Export",
      description: "Selected platform data export initiated",
      type: "Export",
      records: "24,582",
      size: "32.6 MB",
      status: "Processing",
      date: "Just now",
      user: "Super Admin",
    };

    setOperations((prev) => [newOperation, ...prev]);
    setShowExportModal(false);

    setTimeout(() => {
      setOperations((prev) =>
        prev.map((item) =>
          item.id === newOperation.id
            ? {
                ...item,
                status: "Completed",
                description: "Data export generated successfully",
              }
            : item
        )
      );
    }, 1800);
  };

  /* ============================================================
     STAT CARD
  ============================================================ */

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ElementType;
    trend?: string;
  }) => (
    <div className="dm-stat-card">
      <div className="dm-stat-top">
        <div className="dm-stat-icon">
          <Icon size={21} />
        </div>

        {trend && <span className="dm-stat-trend">{trend}</span>}
      </div>

      <div className="dm-stat-value">{value}</div>

      <div className="dm-stat-title">{title}</div>

      <div className="dm-stat-subtitle">{subtitle}</div>
    </div>
  );

  /* ============================================================
     OPERATION ICON
  ============================================================ */

  const getOperationIcon = (type: DataOperation["type"]) => {
    switch (type) {
      case "Import":
        return <ArrowDownToLine size={17} />;

      case "Export":
        return <ArrowUpFromLine size={17} />;

      case "Backup":
        return <FileArchive size={17} />;

      case "Cleanup":
        return <Trash2 size={17} />;

      case "Sync":
        return <RefreshCw size={17} />;

      default:
        return <Activity size={17} />;
    }
  };

  /* ============================================================
     STATUS
  ============================================================ */

  const getStatusClass = (status: OperationStatus) => {
    switch (status) {
      case "Completed":
        return "dm-status completed";

      case "Processing":
        return "dm-status processing";

      case "Failed":
        return "dm-status failed";

      default:
        return "dm-status";
    }
  };

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>
      <div className="dm-page">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="dm-header">
          <div>
            <div className="dm-breadcrumb">
              Administration
              <ChevronRight size={14} />
              Data Management
            </div>

            <div className="dm-title-row">
              <div className="dm-title-icon">
                <Database size={25} />
              </div>

              <div>
                <h1>Data Management</h1>

                <p>
                  Manage platform data, storage, imports, exports and
                  administrative data operations.
                </p>
              </div>
            </div>
          </div>

          <div className="dm-header-actions">
            <button
              className="dm-secondary-btn"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw
                size={17}
                className={isSyncing ? "dm-spin" : ""}
              />

              {isSyncing ? "Syncing..." : "Sync Data"}
            </button>

            <button
              className="dm-primary-btn"
              onClick={() => setShowBackupModal(true)}
            >
              <FileArchive size={17} />
              Create Backup
            </button>
          </div>
        </div>

        {/* ======================================================
            SYSTEM HEALTH BAR
        ====================================================== */}

        <div className="dm-health-banner">
          <div className="dm-health-left">
            <div className="dm-health-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <strong>Data Management System Healthy</strong>

              <span>
                All primary data services are operational and synchronized.
              </span>
            </div>
          </div>

          <div className="dm-health-right">
            <span>
              <CheckCircle2 size={15} />
              Database Operational
            </span>

            <span>
              <CheckCircle2 size={15} />
              Backup Healthy
            </span>

            <span>
              <CheckCircle2 size={15} />
              Encryption Active
            </span>
          </div>
        </div>

        {/* ======================================================
            TABS
        ====================================================== */}

        <div className="dm-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={17} />
            Overview
          </button>

          <button
            className={activeTab === "operations" ? "active" : ""}
            onClick={() => setActiveTab("operations")}
          >
            <History size={17} />
            Data Operations
          </button>

          <button
            className={activeTab === "storage" ? "active" : ""}
            onClick={() => setActiveTab("storage")}
          >
            <HardDrive size={17} />
            Storage & Usage
          </button>
        </div>

        {/* ======================================================
            OVERVIEW
        ====================================================== */}

        {activeTab === "overview" && (
          <>
            <div className="dm-stats-grid">
              <StatCard
                title="Total Records"
                value="86,420"
                subtitle="Across all platform entities"
                icon={Database}
                trend="+8.4%"
              />

              <StatCard
                title="Storage Used"
                value="68.4 GB"
                subtitle="of 100 GB allocated storage"
                icon={HardDrive}
                trend="68%"
              />

              <StatCard
                title="Database Size"
                value="42.8 GB"
                subtitle="Primary production database"
                icon={Layers3}
                trend="+3.2%"
              />

              <StatCard
                title="Data Health"
                value="99.98%"
                subtitle="Validation and integrity score"
                icon={ShieldCheck}
                trend="Healthy"
              />
            </div>

            {/* ==================================================
                QUICK OPERATIONS
            ================================================== */}

            <section className="dm-section">
              <div className="dm-section-heading">
                <div>
                  <h2>Quick Data Operations</h2>

                  <p>
                    Perform common administrative data management tasks.
                  </p>
                </div>

                <span className="dm-secure-label">
                  <ShieldCheck size={14} />
                  Admin Controlled
                </span>
              </div>

              <div className="dm-operation-grid">
                <button
                  className="dm-operation-card"
                  onClick={() => setShowImportModal(true)}
                >
                  <div className="dm-operation-icon import">
                    <Upload size={22} />
                  </div>

                  <div className="dm-operation-content">
                    <strong>Import Data</strong>

                    <span>
                      Import CSV, Excel or structured platform data.
                    </span>

                    <small>
                      Start Import <ChevronRight size={13} />
                    </small>
                  </div>
                </button>

                <button
                  className="dm-operation-card"
                  onClick={() => setShowExportModal(true)}
                >
                  <div className="dm-operation-icon export">
                    <Download size={22} />
                  </div>

                  <div className="dm-operation-content">
                    <strong>Export Data</strong>

                    <span>
                      Generate secure exports of platform records.
                    </span>

                    <small>
                      Start Export <ChevronRight size={13} />
                    </small>
                  </div>
                </button>

                <button
                  className="dm-operation-card"
                  onClick={() => setShowBackupModal(true)}
                >
                  <div className="dm-operation-icon backup">
                    <FileArchive size={22} />
                  </div>

                  <div className="dm-operation-content">
                    <strong>Database Backup</strong>

                    <span>
                      Create an immediate platform database backup.
                    </span>

                    <small>
                      Create Backup <ChevronRight size={13} />
                    </small>
                  </div>
                </button>

                <button
                  className="dm-operation-card"
                  onClick={() => setShowCleanupModal(true)}
                >
                  <div className="dm-operation-icon cleanup">
                    <Trash2 size={22} />
                  </div>

                  <div className="dm-operation-content">
                    <strong>Data Cleanup</strong>

                    <span>
                      Find and clean unused or expired platform data.
                    </span>

                    <small>
                      Review Cleanup <ChevronRight size={13} />
                    </small>
                  </div>
                </button>
              </div>
            </section>

            {/* ==================================================
                DATABASE + STORAGE
            ================================================== */}

            <div className="dm-two-column">
              <section className="dm-panel">
                <div className="dm-panel-header">
                  <div>
                    <h2>Database Overview</h2>
                    <p>Current production database statistics.</p>
                  </div>

                  <button className="dm-icon-btn">
                    <MoreHorizontal size={19} />
                  </button>
                </div>

                <div className="dm-database-health">
                  <div className="dm-db-status">
                    <div className="dm-db-status-icon">
                      <Database size={20} />
                    </div>

                    <div>
                      <strong>Production Database</strong>
                      <span>Operational</span>
                    </div>

                    <div className="dm-operational-dot">
                      <span />
                    </div>
                  </div>

                  <div className="dm-db-grid">
                    <div>
                      <span>Records</span>
                      <strong>86,420</strong>
                    </div>

                    <div>
                      <span>Tables</span>
                      <strong>48</strong>
                    </div>

                    <div>
                      <span>Indexes</span>
                      <strong>126</strong>
                    </div>

                    <div>
                      <span>Last Check</span>
                      <strong>2 min ago</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="dm-panel">
                <div className="dm-panel-header">
                  <div>
                    <h2>Storage Usage</h2>
                    <p>Platform storage allocation.</p>
                  </div>

                  <HardDrive size={20} />
                </div>

                <div className="dm-storage-main">
                  <div className="dm-storage-value">
                    <strong>68.4 GB</strong>
                    <span>/ 100 GB</span>
                  </div>

                  <div className="dm-storage-percent">68%</div>
                </div>

                <div className="dm-progress">
                  <div style={{ width: "68%" }} />
                </div>

                <div className="dm-storage-list">
                  <div>
                    <span>
                      <i className="dm-dot database" />
                      Database
                    </span>

                    <strong>42.8 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-dot files" />
                      Documents
                    </span>

                    <strong>14.6 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-dot backups" />
                      Backups
                    </span>

                    <strong>8.2 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-dot other" />
                      Other
                    </span>

                    <strong>2.8 GB</strong>
                  </div>
                </div>
              </section>
            </div>

            {/* ==================================================
                SECURITY
            ================================================== */}

            <section className="dm-security-panel">
              <div className="dm-security-icon">
                <ShieldCheck size={24} />
              </div>

              <div className="dm-security-content">
                <h3>Data Security & Compliance</h3>

                <p>
                  Platform data is protected with encryption, access
                  controls, retention policies and administrative audit
                  logging.
                </p>

                <div className="dm-security-items">
                  <span>
                    <CheckCircle2 size={15} />
                    Encryption at Rest
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Encryption in Transit
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Role-Based Access
                  </span>

                  <span>
                    <CheckCircle2 size={15} />
                    Audit Logging
                  </span>
                </div>
              </div>

              <button
                className="dm-outline-btn"
                onClick={() => setActiveTab("operations")}
              >
                View Audit Activity
                <ChevronRight size={15} />
              </button>
            </section>
          </>
        )}

        {/* ======================================================
            OPERATIONS TAB
        ====================================================== */}

        {activeTab === "operations" && (
          <section className="dm-panel dm-operations-panel">
            <div className="dm-panel-header">
              <div>
                <h2>Data Operations History</h2>

                <p>
                  Track imports, exports, backups, synchronization and
                  cleanup activities.
                </p>
              </div>

              <div className="dm-search">
                <Search size={17} />

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search operations..."
                />

                {searchTerm && (
                  <button onClick={() => setSearchTerm("")}>
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="dm-table-wrapper">
              <table className="dm-table">
                <thead>
                  <tr>
                    <th>Operation</th>
                    <th>Type</th>
                    <th>Records</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>User</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {filteredOperations.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dm-operation-name">
                          <div className="dm-table-icon">
                            {getOperationIcon(item.type)}
                          </div>

                          <div>
                            <strong>{item.operation}</strong>
                            <span>{item.description}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="dm-type">{item.type}</span>
                      </td>

                      <td>{item.records}</td>

                      <td>{item.size}</td>

                      <td>
                        <span className={getStatusClass(item.status)}>
                          {item.status === "Completed" && (
                            <CheckCircle2 size={14} />
                          )}

                          {item.status === "Processing" && (
                            <RefreshCw size={14} className="dm-spin" />
                          )}

                          {item.status === "Failed" && (
                            <X size={14} />
                          )}

                          {item.status}
                        </span>
                      </td>

                      <td>{item.date}</td>

                      <td>
                        <span className="dm-user">
                          <Users size={14} />
                          {item.user}
                        </span>
                      </td>

                      <td>
                        <button
                          className="dm-more-btn"
                          onClick={() => setShowDetailsModal(item)}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredOperations.length === 0 && (
                    <tr>
                      <td colSpan={8}>
                        <div className="dm-empty">
                          <Search size={30} />
                          <strong>No operations found</strong>
                          <span>
                            Try changing your search criteria.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ======================================================
            STORAGE TAB
        ====================================================== */}

        {activeTab === "storage" && (
          <>
            <div className="dm-storage-dashboard">
              <div className="dm-storage-big-card">
                <div className="dm-storage-circle">
                  <div>
                    <strong>68%</strong>
                    <span>Used</span>
                  </div>
                </div>

                <div className="dm-storage-big-content">
                  <h2>68.4 GB Used</h2>

                  <p>
                    Your platform currently uses 68.4 GB of the
                    available 100 GB storage allocation.
                  </p>

                  <div className="dm-storage-warning">
                    <Info size={16} />
                    31.6 GB storage remaining
                  </div>
                </div>
              </div>

              <div className="dm-panel">
                <div className="dm-panel-header">
                  <div>
                    <h2>Storage Breakdown</h2>
                    <p>Current storage distribution.</p>
                  </div>
                </div>

                <div className="dm-breakdown">
                  <div>
                    <span>
                      <i className="dm-breakdown-icon db">
                        <Database size={15} />
                      </i>
                      Database
                    </span>

                    <strong>42.8 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-breakdown-icon doc">
                        <FileText size={15} />
                      </i>
                      Documents
                    </span>

                    <strong>14.6 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-breakdown-icon backup">
                        <Archive size={15} />
                      </i>
                      Backups
                    </span>

                    <strong>8.2 GB</strong>
                  </div>

                  <div>
                    <span>
                      <i className="dm-breakdown-icon other">
                        <Layers3 size={15} />
                      </i>
                      Other Data
                    </span>

                    <strong>2.8 GB</strong>
                  </div>
                </div>
              </div>
            </div>

            <section className="dm-panel">
              <div className="dm-panel-header">
                <div>
                  <h2>Storage Recommendations</h2>
                  <p>
                    Recommended actions based on current platform usage.
                  </p>
                </div>

                <Sparkles size={20} />
              </div>

              <div className="dm-recommendations">
                <div>
                  <div className="dm-rec-icon">
                    <Trash2 size={19} />
                  </div>

                  <div>
                    <strong>Review old data</strong>
                    <span>
                      3.8 GB of potentially removable historical data
                      detected.
                    </span>
                  </div>

                  <button onClick={() => setShowCleanupModal(true)}>
                    Review
                  </button>
                </div>

                <div>
                  <div className="dm-rec-icon">
                    <FileArchive size={19} />
                  </div>

                  <div>
                    <strong>Optimize backups</strong>
                    <span>
                      Older backup versions can be archived to reduce
                      active storage.
                    </span>
                  </div>

                  <button onClick={() => setShowBackupModal(true)}>
                    Manage
                  </button>
                </div>

                <div>
                  <div className="dm-rec-icon">
                    <Zap size={19} />
                  </div>

                  <div>
                    <strong>Storage upgrade</strong>
                    <span>
                      Consider increasing storage allocation when usage
                      reaches 80%.
                    </span>
                  </div>

                  <button>View Plan</button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ======================================================
            FOOTER
        ====================================================== */}

        <div className="dm-footer">
          <div>
            <ShieldCheck size={15} />
            Data operations are protected and recorded in the audit log.
          </div>

          <span>
            Last system check: 2 minutes ago
          </span>
        </div>
      </div>

      {/* ========================================================
          IMPORT MODAL
      ======================================================== */}

      {showImportModal && (
        <div
          className="dm-modal-overlay"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="dm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dm-modal-header">
              <div>
                <div className="dm-modal-icon import">
                  <Upload size={21} />
                </div>

                <h2>Import Data</h2>

                <p>
                  Import structured platform data into the system.
                </p>
              </div>

              <button
                onClick={() => setShowImportModal(false)}
                className="dm-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <div className="dm-upload-area">
              <Upload size={30} />

              <strong>Drop your file here</strong>

              <span>
                Supported formats: CSV, XLSX, JSON
              </span>

              <button className="dm-secondary-btn">
                Browse Files
              </button>
            </div>

            <div className="dm-info-box">
              <Info size={17} />

              <span>
                Imported data will be validated before it is added to
                the platform.
              </span>
            </div>

            <div className="dm-modal-actions">
              <button
                className="dm-secondary-btn"
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </button>

              <button
                className="dm-primary-btn"
                onClick={() => {
                  setShowImportModal(false);

                  const newOperation: DataOperation = {
                    id: Date.now(),
                    operation: "Data Import",
                    description: "Data import completed successfully",
                    type: "Import",
                    records: "1,240",
                    size: "4.8 MB",
                    status: "Completed",
                    date: "Just now",
                    user: "Super Admin",
                  };

                  setOperations((prev) => [
                    newOperation,
                    ...prev,
                  ]);
                }}
              >
                <Upload size={16} />
                Start Import
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EXPORT MODAL
      ======================================================== */}

      {showExportModal && (
        <div
          className="dm-modal-overlay"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="dm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dm-modal-header">
              <div>
                <div className="dm-modal-icon export">
                  <Download size={21} />
                </div>

                <h2>Export Platform Data</h2>

                <p>
                  Select the data you want to export.
                </p>
              </div>

              <button
                onClick={() => setShowExportModal(false)}
                className="dm-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <div className="dm-export-options">
              {[
                "Companies",
                "Platform Users",
                "Subscriptions",
                "Invoices & Payments",
                "Audit Logs",
                "Support Tickets",
              ].map((item) => (
                <label key={item}>
                  <input type="checkbox" defaultChecked />

                  <span>{item}</span>

                  <FileCheck2 size={16} />
                </label>
              ))}
            </div>

            <div className="dm-info-box">
              <ShieldCheck size={17} />

              <span>
                Export files are generated securely and recorded in
                the administrative audit trail.
              </span>
            </div>

            <div className="dm-modal-actions">
              <button
                className="dm-secondary-btn"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </button>

              <button
                className="dm-primary-btn"
                onClick={handleExport}
              >
                <Download size={16} />
                Generate Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BACKUP MODAL
      ======================================================== */}

      {showBackupModal && (
        <div
          className="dm-modal-overlay"
          onClick={() => setShowBackupModal(false)}
        >
          <div
            className="dm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dm-modal-header">
              <div>
                <div className="dm-modal-icon backup">
                  <FileArchive size={21} />
                </div>

                <h2>Create Database Backup</h2>

                <p>
                  Create an immediate backup of the production
                  database.
                </p>
              </div>

              <button
                onClick={() => setShowBackupModal(false)}
                className="dm-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <div className="dm-confirm-card">
              <div>
                <Database size={20} />
              </div>

              <div>
                <strong>Production Database</strong>

                <span>
                  Estimated backup size: 2.8 GB
                </span>
              </div>
            </div>

            <div className="dm-info-box">
              <ShieldCheck size={17} />

              <span>
                Backup will be encrypted and stored using the
                platform's backup policy.
              </span>
            </div>

            <div className="dm-modal-actions">
              <button
                className="dm-secondary-btn"
                onClick={() => setShowBackupModal(false)}
              >
                Cancel
              </button>

              <button
                className="dm-primary-btn"
                onClick={handleBackup}
              >
                <FileArchive size={16} />
                Create Backup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CLEANUP MODAL
      ======================================================== */}

      {showCleanupModal && (
        <div
          className="dm-modal-overlay"
          onClick={() => setShowCleanupModal(false)}
        >
          <div
            className="dm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dm-modal-header">
              <div>
                <div className="dm-modal-icon cleanup">
                  <Trash2 size={21} />
                </div>

                <h2>Data Cleanup</h2>

                <p>
                  Review and remove unused or expired data.
                </p>
              </div>

              <button
                onClick={() => setShowCleanupModal(false)}
                className="dm-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <div className="dm-cleanup-list">
              <div>
                <span>Expired temporary records</span>
                <strong>1,842</strong>
              </div>

              <div>
                <span>Old audit cache</span>
                <strong>926</strong>
              </div>

              <div>
                <span>Unused attachments</span>
                <strong>660</strong>
              </div>
            </div>

            <div className="dm-warning-box">
              <Info size={17} />

              <span>
                Cleanup operations should be reviewed carefully.
                Permanent deletion cannot be reversed.
              </span>
            </div>

            <div className="dm-modal-actions">
              <button
                className="dm-secondary-btn"
                onClick={() => setShowCleanupModal(false)}
              >
                Cancel
              </button>

              <button
                className="dm-danger-btn"
                onClick={handleCleanup}
              >
                <Trash2 size={16} />
                Run Cleanup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DETAILS MODAL
      ======================================================== */}

      {showDetailsModal && (
        <div
          className="dm-modal-overlay"
          onClick={() => setShowDetailsModal(null)}
        >
          <div
            className="dm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dm-modal-header">
              <div>
                <div className="dm-modal-icon">
                  <Activity size={21} />
                </div>

                <h2>Operation Details</h2>

                <p>
                  Detailed information about this data operation.
                </p>
              </div>

              <button
                onClick={() => setShowDetailsModal(null)}
                className="dm-close-btn"
              >
                <X size={19} />
              </button>
            </div>

            <div className="dm-detail-list">
              <div>
                <span>Operation</span>
                <strong>{showDetailsModal.operation}</strong>
              </div>

              <div>
                <span>Type</span>
                <strong>{showDetailsModal.type}</strong>
              </div>

              <div>
                <span>Description</span>
                <strong>{showDetailsModal.description}</strong>
              </div>

              <div>
                <span>Records</span>
                <strong>{showDetailsModal.records}</strong>
              </div>

              <div>
                <span>Size</span>
                <strong>{showDetailsModal.size}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{showDetailsModal.status}</strong>
              </div>

              <div>
                <span>Performed By</span>
                <strong>{showDetailsModal.user}</strong>
              </div>

              <div>
                <span>Date</span>
                <strong>{showDetailsModal.date}</strong>
              </div>
            </div>

            <div className="dm-modal-actions">
              <button
                className="dm-primary-btn"
                onClick={() => setShowDetailsModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          PAGE STYLES
      ======================================================== */}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .dm-page {
          min-height: 100%;
          padding: 28px;
          background: #f6f8fb;
          color: #172033;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* HEADER */

        .dm-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 22px;
        }

        .dm-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8a94a6;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .dm-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .dm-title-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e9f1ff;
          color: #2864d7;
          border: 1px solid #dbe7fb;
        }

        .dm-title-row h1 {
          margin: 0 0 4px;
          font-size: 26px;
          line-height: 1.2;
          letter-spacing: -0.4px;
          color: #182238;
        }

        .dm-title-row p {
          margin: 0;
          color: #7d8798;
          font-size: 13px;
        }

        .dm-header-actions {
          display: flex;
          gap: 10px;
        }

        button {
          font-family: inherit;
        }

        .dm-primary-btn,
        .dm-secondary-btn,
        .dm-danger-btn {
          height: 40px;
          padding: 0 15px;
          border-radius: 9px;
          border: 1px solid transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 700;
          transition: 0.18s ease;
          white-space: nowrap;
        }

        .dm-primary-btn {
          background: #2563d9;
          color: white;
          box-shadow: 0 3px 8px rgba(37, 99, 217, 0.16);
        }

        .dm-primary-btn:hover {
          background: #1e55bd;
          transform: translateY(-1px);
        }

        .dm-secondary-btn {
          background: white;
          color: #344054;
          border-color: #dfe4ec;
        }

        .dm-secondary-btn:hover {
          background: #f8fafc;
          border-color: #cbd3df;
        }

        .dm-danger-btn {
          background: #d92d20;
          color: white;
        }

        .dm-danger-btn:hover {
          background: #b42318;
        }

        .dm-primary-btn:disabled,
        .dm-secondary-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* HEALTH */

        .dm-health-banner {
          min-height: 66px;
          background: white;
          border: 1px solid #e5e9f0;
          border-radius: 12px;
          padding: 13px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 20px;
        }

        .dm-health-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dm-health-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: #eaf8f0;
          color: #159447;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-health-left strong {
          display: block;
          font-size: 13px;
          color: #1f2937;
          margin-bottom: 3px;
        }

        .dm-health-left span {
          display: block;
          color: #8993a3;
          font-size: 12px;
        }

        .dm-health-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .dm-health-right span {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #637083;
          font-size: 11px;
          font-weight: 700;
        }

        .dm-health-right svg {
          color: #18a058;
        }

        /* TABS */

        .dm-tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          border-bottom: 1px solid #e1e6ed;
          margin-bottom: 20px;
        }

        .dm-tabs button {
          height: 44px;
          padding: 0 15px;
          background: transparent;
          border: 0;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #7c8797;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .dm-tabs button:hover {
          color: #2563d9;
        }

        .dm-tabs button.active {
          color: #2563d9;
          border-bottom-color: #2563d9;
        }

        /* STATS */

        .dm-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .dm-stat-card {
          min-height: 150px;
          padding: 18px;
          background: white;
          border: 1px solid #e4e8ef;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(31, 45, 61, 0.025);
        }

        .dm-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .dm-stat-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #f0f5ff;
          color: #2864d7;
        }

        .dm-stat-trend {
          font-size: 10px;
          font-weight: 800;
          color: #159447;
          background: #edf9f2;
          padding: 4px 7px;
          border-radius: 20px;
        }

        .dm-stat-value {
          font-size: 25px;
          font-weight: 800;
          color: #172033;
          letter-spacing: -0.5px;
        }

        .dm-stat-title {
          font-size: 12px;
          color: #687486;
          margin-top: 3px;
          font-weight: 700;
        }

        .dm-stat-subtitle {
          color: #9aa3b1;
          font-size: 11px;
          margin-top: 7px;
        }

        /* SECTION */

        .dm-section {
          margin-bottom: 22px;
        }

        .dm-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .dm-section-heading h2,
        .dm-panel-header h2 {
          margin: 0 0 4px;
          color: #1b2538;
          font-size: 15px;
          font-weight: 800;
        }

        .dm-section-heading p,
        .dm-panel-header p {
          margin: 0;
          color: #929baa;
          font-size: 11px;
        }

        .dm-secure-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #5e6a7b;
          font-size: 11px;
          font-weight: 700;
        }

        /* OPERATIONS */

        .dm-operation-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .dm-operation-card {
          text-align: left;
          border: 1px solid #e4e8ef;
          background: white;
          border-radius: 12px;
          padding: 17px;
          display: flex;
          gap: 12px;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .dm-operation-card:hover {
          border-color: #cbd8ef;
          transform: translateY(-2px);
          box-shadow: 0 7px 20px rgba(34, 54, 88, 0.06);
        }

        .dm-operation-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-operation-icon.import,
        .dm-modal-icon.import {
          background: #edf5ff;
          color: #2864d7;
        }

        .dm-operation-icon.export,
        .dm-modal-icon.export {
          background: #f2efff;
          color: #6853d6;
        }

        .dm-operation-icon.backup,
        .dm-modal-icon.backup {
          background: #edf9f4;
          color: #178c58;
        }

        .dm-operation-icon.cleanup,
        .dm-modal-icon.cleanup {
          background: #fff2ed;
          color: #d3542e;
        }

        .dm-operation-content strong {
          display: block;
          color: #253047;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .dm-operation-content > span {
          display: block;
          color: #929baa;
          line-height: 1.45;
          font-size: 10px;
        }

        .dm-operation-content small {
          margin-top: 9px;
          color: #2864d7;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        /* TWO COLUMNS */

        .dm-two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        .dm-panel {
          background: white;
          border: 1px solid #e4e8ef;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(31, 45, 61, 0.025);
          overflow: hidden;
        }

        .dm-panel-header {
          min-height: 66px;
          padding: 16px 18px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .dm-icon-btn,
        .dm-more-btn,
        .dm-close-btn {
          width: 34px;
          height: 34px;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8c96a5;
          border-radius: 7px;
          cursor: pointer;
        }

        .dm-icon-btn:hover,
        .dm-more-btn:hover,
        .dm-close-btn:hover {
          background: #f2f4f7;
          color: #344054;
        }

        /* DATABASE */

        .dm-database-health {
          padding: 18px;
        }

        .dm-db-status {
          display: flex;
          align-items: center;
          gap: 11px;
          padding-bottom: 18px;
          border-bottom: 1px solid #edf0f4;
        }

        .dm-db-status-icon {
          width: 40px;
          height: 40px;
          border-radius: 9px;
          background: #eef5ff;
          color: #2864d7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-db-status strong {
          display: block;
          font-size: 12px;
          color: #283248;
        }

        .dm-db-status span {
          display: block;
          font-size: 10px;
          color: #159447;
          font-weight: 700;
          margin-top: 3px;
        }

        .dm-operational-dot {
          margin-left: auto;
        }

        .dm-operational-dot span {
          display: block;
          width: 9px;
          height: 9px;
          background: #20a35a;
          border-radius: 50%;
          box-shadow: 0 0 0 4px #e8f8ef;
        }

        .dm-db-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 17px;
          padding-top: 17px;
        }

        .dm-db-grid span {
          display: block;
          color: #929baa;
          font-size: 10px;
          margin-bottom: 4px;
        }

        .dm-db-grid strong {
          font-size: 13px;
          color: #293348;
        }

        /* STORAGE */

        .dm-storage-main {
          padding: 18px 18px 11px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .dm-storage-value strong {
          font-size: 24px;
          color: #1b2538;
        }

        .dm-storage-value span {
          color: #9ba4b2;
          font-size: 11px;
          margin-left: 5px;
        }

        .dm-storage-percent {
          color: #2864d7;
          font-size: 13px;
          font-weight: 800;
        }

        .dm-progress {
          height: 8px;
          margin: 0 18px 15px;
          border-radius: 20px;
          background: #edf0f4;
          overflow: hidden;
        }

        .dm-progress div {
          height: 100%;
          border-radius: inherit;
          background: #2864d7;
        }

        .dm-storage-list {
          padding: 0 18px 16px;
        }

        .dm-storage-list > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 0;
          font-size: 11px;
          color: #6f7a8b;
        }

        .dm-storage-list span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .dm-storage-list strong {
          color: #354054;
          font-size: 11px;
        }

        .dm-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .dm-dot.database {
          background: #2864d7;
        }

        .dm-dot.files {
          background: #7357d9;
        }

        .dm-dot.backups {
          background: #1c9b60;
        }

        .dm-dot.other {
          background: #a8b0bc;
        }

        /* SECURITY */

        .dm-security-panel {
          background: white;
          border: 1px solid #e4e8ef;
          border-radius: 12px;
          padding: 17px 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .dm-security-icon {
          width: 43px;
          height: 43px;
          min-width: 43px;
          border-radius: 10px;
          background: #edf9f1;
          color: #168c50;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-security-content {
          flex: 1;
        }

        .dm-security-content h3 {
          margin: 0 0 4px;
          font-size: 13px;
          color: #273147;
        }

        .dm-security-content p {
          margin: 0 0 9px;
          font-size: 10px;
          color: #929baa;
        }

        .dm-security-items {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .dm-security-items span {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          color: #647084;
          font-weight: 700;
        }

        .dm-security-items svg {
          color: #159447;
        }

        .dm-outline-btn {
          height: 36px;
          padding: 0 11px;
          border: 1px solid #dfe4ec;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #566274;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .dm-outline-btn:hover {
          background: #f8fafc;
        }

        /* OPERATIONS PAGE */

        .dm-operations-panel {
          min-height: 500px;
        }

        .dm-search {
          height: 37px;
          min-width: 245px;
          border: 1px solid #dfe4ec;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 0 9px;
          color: #929baa;
        }

        .dm-search input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          font-size: 11px;
          color: #344054;
          min-width: 0;
        }

        .dm-search button {
          border: 0;
          background: transparent;
          color: #98a1ae;
          cursor: pointer;
          display: flex;
        }

        .dm-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .dm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 950px;
        }

        .dm-table th {
          height: 43px;
          padding: 0 17px;
          background: #fafbfc;
          border-bottom: 1px solid #e8ebf0;
          text-align: left;
          color: #7d8797;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          font-weight: 800;
        }

        .dm-table td {
          height: 67px;
          padding: 8px 17px;
          border-bottom: 1px solid #edf0f4;
          color: #566274;
          font-size: 11px;
          white-space: nowrap;
        }

        .dm-operation-name {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dm-table-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: #f0f5ff;
          color: #2864d7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-operation-name strong {
          display: block;
          color: #273147;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .dm-operation-name span {
          display: block;
          color: #9aa3b1;
          font-size: 9px;
        }

        .dm-type {
          padding: 4px 8px;
          background: #f4f6f9;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 800;
          color: #677386;
        }

        .dm-status {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 8px;
          border-radius: 20px;
          font-size: 9px;
          font-weight: 800;
        }

        .dm-status.completed {
          background: #eaf8f0;
          color: #178a50;
        }

        .dm-status.processing {
          background: #fff7e8;
          color: #ad7200;
        }

        .dm-status.failed {
          background: #fff0ef;
          color: #c43228;
        }

        .dm-user {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #667286;
          font-size: 10px;
        }

        .dm-more-btn {
          width: 30px;
          height: 30px;
        }

        .dm-empty {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 7px;
          color: #9aa3b1;
        }

        .dm-empty strong {
          color: #566274;
          font-size: 13px;
        }

        .dm-empty span {
          font-size: 10px;
        }

        /* STORAGE PAGE */

        .dm-storage-dashboard {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        .dm-storage-big-card {
          background: white;
          border: 1px solid #e4e8ef;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .dm-storage-circle {
          width: 150px;
          height: 150px;
          min-width: 150px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(
              circle at center,
              white 59%,
              transparent 60%
            ),
            conic-gradient(
              #2864d7 0deg 245deg,
              #edf0f4 245deg 360deg
            );
        }

        .dm-storage-circle div {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .dm-storage-circle strong {
          font-size: 26px;
          color: #1d2940;
        }

        .dm-storage-circle span {
          color: #929baa;
          font-size: 10px;
          margin-top: 1px;
        }

        .dm-storage-big-content h2 {
          margin: 0 0 7px;
          font-size: 18px;
          color: #202b40;
        }

        .dm-storage-big-content p {
          margin: 0 0 14px;
          color: #8c96a5;
          font-size: 11px;
          line-height: 1.6;
        }

        .dm-storage-warning {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0f6ff;
          color: #3566af;
          padding: 7px 9px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 700;
        }

        .dm-breakdown {
          padding: 9px 18px 15px;
        }

        .dm-breakdown > div {
          min-height: 47px;
          border-bottom: 1px solid #f0f2f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dm-breakdown > div:last-child {
          border-bottom: 0;
        }

        .dm-breakdown span {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #647084;
          font-size: 11px;
        }

        .dm-breakdown strong {
          font-size: 11px;
          color: #344054;
        }

        .dm-breakdown-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-style: normal;
        }

        .dm-breakdown-icon.db {
          color: #2864d7;
          background: #edf4ff;
        }

        .dm-breakdown-icon.doc {
          color: #6c57d7;
          background: #f1efff;
        }

        .dm-breakdown-icon.backup {
          color: #168b52;
          background: #eaf8f0;
        }

        .dm-breakdown-icon.other {
          color: #687486;
          background: #f1f3f5;
        }

        .dm-recommendations {
          padding: 4px 18px 15px;
        }

        .dm-recommendations > div {
          min-height: 65px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #edf0f4;
        }

        .dm-recommendations > div:last-child {
          border-bottom: 0;
        }

        .dm-rec-icon {
          width: 36px;
          height: 36px;
          min-width: 36px;
          border-radius: 8px;
          background: #f0f5ff;
          color: #2864d7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-recommendations > div > div:nth-child(2) {
          flex: 1;
        }

        .dm-recommendations strong {
          display: block;
          color: #334055;
          font-size: 11px;
          margin-bottom: 3px;
        }

        .dm-recommendations span {
          display: block;
          color: #929baa;
          font-size: 9px;
        }

        .dm-recommendations button {
          height: 31px;
          padding: 0 10px;
          background: white;
          border: 1px solid #dfe4ec;
          border-radius: 7px;
          color: #4c596d;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        .dm-recommendations button:hover {
          background: #f7f9fb;
        }

        /* FOOTER */

        .dm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #929baa;
          font-size: 10px;
          padding: 3px 2px 10px;
        }

        .dm-footer div {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dm-footer svg {
          color: #159447;
        }

        /* MODAL */

        .dm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.42);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .dm-modal {
          width: min(520px, 100%);
          background: white;
          border-radius: 14px;
          box-shadow: 0 25px 80px rgba(15, 23, 42, 0.22);
          overflow: hidden;
        }

        .dm-modal-header {
          padding: 20px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .dm-modal-header > div:first-child {
          display: grid;
          grid-template-columns: 42px 1fr;
          column-gap: 11px;
        }

        .dm-modal-icon {
          grid-row: span 2;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef4ff;
          color: #2864d7;
        }

        .dm-modal-header h2 {
          margin: 2px 0 3px;
          font-size: 16px;
          color: #202b40;
        }

        .dm-modal-header p {
          margin: 0;
          color: #929baa;
          font-size: 10px;
          line-height: 1.5;
        }

        .dm-close-btn {
          margin-left: auto;
        }

        .dm-upload-area {
          margin: 20px;
          padding: 30px 20px;
          border: 1px dashed #cfd7e4;
          background: #fafcff;
          border-radius: 11px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #8b96a7;
        }

        .dm-upload-area svg {
          color: #2864d7;
          margin-bottom: 4px;
        }

        .dm-upload-area strong {
          color: #344054;
          font-size: 13px;
        }

        .dm-upload-area span {
          font-size: 10px;
          margin-bottom: 6px;
        }

        .dm-upload-area .dm-secondary-btn {
          height: 34px;
        }

        .dm-info-box,
        .dm-warning-box {
          margin: 0 20px 18px;
          padding: 11px;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 10px;
          line-height: 1.5;
        }

        .dm-info-box {
          background: #f0f6ff;
          color: #52709f;
        }

        .dm-warning-box {
          background: #fff8eb;
          color: #8c681e;
        }

        .dm-info-box svg,
        .dm-warning-box svg {
          min-width: 16px;
          margin-top: 1px;
        }

        .dm-modal-actions {
          padding: 15px 20px;
          border-top: 1px solid #edf0f4;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
        }

        .dm-export-options {
          padding: 15px 20px 5px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .dm-export-options label {
          min-height: 44px;
          padding: 0 10px;
          border: 1px solid #e5e9ef;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #566274;
          font-size: 10px;
          cursor: pointer;
        }

        .dm-export-options label:hover {
          background: #fafcff;
        }

        .dm-export-options input {
          accent-color: #2864d7;
        }

        .dm-export-options svg {
          margin-left: auto;
          color: #8f99a8;
        }

        .dm-confirm-card {
          margin: 18px 20px;
          padding: 14px;
          border: 1px solid #e5e9ef;
          background: #fafbfc;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .dm-confirm-card > div:first-child {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #eef5ff;
          color: #2864d7;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dm-confirm-card strong {
          display: block;
          font-size: 12px;
          color: #344054;
        }

        .dm-confirm-card span {
          display: block;
          margin-top: 3px;
          font-size: 10px;
          color: #929baa;
        }

        .dm-cleanup-list {
          padding: 13px 20px;
        }

        .dm-cleanup-list > div {
          height: 43px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #647084;
        }

        .dm-cleanup-list strong {
          color: #344054;
        }

        .dm-detail-list {
          padding: 12px 20px;
        }

        .dm-detail-list > div {
          min-height: 42px;
          border-bottom: 1px solid #edf0f4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .dm-detail-list span {
          color: #929baa;
          font-size: 10px;
        }

        .dm-detail-list strong {
          color: #344054;
          font-size: 10px;
          text-align: right;
          max-width: 60%;
        }

        /* ANIMATION */

        .dm-spin {
          animation: dm-spin 1s linear infinite;
        }

        @keyframes dm-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* RESPONSIVE */

        @media (max-width: 1200px) {
          .dm-stats-grid,
          .dm-operation-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .dm-health-right {
            display: none;
          }
        }

        @media (max-width: 900px) {
          .dm-page {
            padding: 20px;
          }

          .dm-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dm-two-column,
          .dm-storage-dashboard {
            grid-template-columns: 1fr;
          }

          .dm-security-panel {
            align-items: flex-start;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 650px) {
          .dm-page {
            padding: 14px;
          }

          .dm-stats-grid,
          .dm-operation-grid {
            grid-template-columns: 1fr;
          }

          .dm-header-actions {
            width: 100%;
          }

          .dm-header-actions button {
            flex: 1;
          }

          .dm-title-row h1 {
            font-size: 21px;
          }

          .dm-tabs {
            overflow-x: auto;
          }

          .dm-tabs button {
            white-space: nowrap;
          }

          .dm-search {
            min-width: 0;
            width: 100%;
          }

          .dm-panel-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .dm-storage-big-card {
            flex-direction: column;
            text-align: center;
          }

          .dm-security-items {
            flex-direction: column;
            gap: 7px;
          }

          .dm-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 7px;
          }

          .dm-export-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}