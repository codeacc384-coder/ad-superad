
const GLOBAL_UI_STYLES = `
  /* =========================================================
     DESIGN TOKENS
     ========================================================= */

  :root {
    --hrms-bg: #d9dde3;
    --hrms-surface: #f1f3f5;
    --hrms-surface-soft: #e7e9ed;

    --hrms-border: #c3c9d2;
    --hrms-border-soft: #d3d7de;
    --hrms-border-hover: #aeb5c0;

    --hrms-text: #0f172a;
    --hrms-text-secondary: #475569;
    --hrms-text-muted: #64748b;

    --hrms-primary: #4f46e5;
    --hrms-primary-soft: #eef2ff;

    --hrms-success: #16a34a;
    --hrms-success-soft: #f0fdf4;

    --hrms-warning: #d97706;
    --hrms-warning-soft: #fffbeb;

    --hrms-danger: #dc2626;
    --hrms-danger-soft: #fef2f2;

    --hrms-info: #0284c7;
    --hrms-info-soft: #f0f9ff;

    --hrms-radius-sm: 8px;
    --hrms-radius-md: 12px;
    --hrms-radius-lg: 16px;

    --hrms-shadow-card:
      0 1px 2px rgba(15, 23, 42, 0.06),
      0 5px 14px rgba(15, 23, 42, 0.09),
      0 14px 30px rgba(15, 23, 42, 0.07);

    --hrms-shadow-card-hover:
      0 5px 10px rgba(15, 23, 42, 0.09),
      0 14px 30px rgba(15, 23, 42, 0.13),
      0 24px 45px rgba(15, 23, 42, 0.08);

    --hrms-transition:
      transform 200ms ease,
      box-shadow 200ms ease,
      border-color 200ms ease,
      background-color 200ms ease;
  }


  /* =========================================================
     PAGE BACKGROUND
     ========================================================= */

  body {
    background: #d9dde3;
  }

  ::selection {
    background: #c7d2fe;
    color: #1e1b4b;
  }


  /* =========================================================
     MAIN BODY ONLY
     ========================================================= */

  main {
    color: var(--hrms-text);

    background:
      linear-gradient(
        135deg,
        #d9dde3 0%,
        #e2e5e9 45%,
        #d7dbe1 100%
      );
  }

  main > div {
    min-width: 0;
  }


  /* =========================================================
     MAIN CONTENT CARDS
     ========================================================= */

  main [class*="rounded-xl"][class*="bg-white"],
  main [class*="rounded-2xl"][class*="bg-white"],
  main [class*="rounded-3xl"][class*="bg-white"] {
    border: 1px solid #c3c9d2;

    background:
      linear-gradient(
        180deg,
        #f4f5f7 0%,
        #e9ebee 100%
      );

    box-shadow: var(--hrms-shadow-card);

    transition: var(--hrms-transition);
  }

  main [class*="rounded-xl"][class*="bg-white"]:hover,
  main [class*="rounded-2xl"][class*="bg-white"]:hover,
  main [class*="rounded-3xl"][class*="bg-white"]:hover {
    border-color: #aeb5c0;

    background:
      linear-gradient(
        180deg,
        #f7f8f9 0%,
        #eceef1 100%
      );

    box-shadow: var(--hrms-shadow-card-hover);
  }


  /* =========================================================
     INTERACTIVE CARDS
     ========================================================= */

  main [class*="cursor-pointer"][class*="rounded-xl"][class*="bg-white"]:hover,
  main [class*="cursor-pointer"][class*="rounded-2xl"][class*="bg-white"]:hover,
  main [class*="cursor-pointer"][class*="rounded-3xl"][class*="bg-white"]:hover {
    transform: translateY(-3px);
  }


  /* =========================================================
     EXPLICIT HRMS CARD
     ========================================================= */

  main .hrms-card {
    position: relative;
    overflow: hidden;

    border: 1px solid #c3c9d2;
    border-radius: var(--hrms-radius-lg);

    background:
      linear-gradient(
        180deg,
        #f4f5f7 0%,
        #e7e9ed 100%
      );

    box-shadow: var(--hrms-shadow-card);

    transition: var(--hrms-transition);
  }

  main .hrms-card:hover {
    border-color: #aeb5c0;

    background:
      linear-gradient(
        180deg,
        #f7f8f9 0%,
        #eceef1 100%
      );

    box-shadow: var(--hrms-shadow-card-hover);
  }

  main .hrms-card-interactive {
    cursor: pointer;
  }

  main .hrms-card-interactive:hover {
    transform: translateY(-3px);
  }


  /* =========================================================
     CARD HEADER
     ========================================================= */

  main .hrms-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    padding: 18px 20px;

    border-bottom: 1px solid #cdd2d9;

    background:
      linear-gradient(
        180deg,
        #e7e9ed 0%,
        #dde1e6 100%
      );
  }

  main .hrms-card-title {
    margin: 0;

    color: var(--hrms-text);

    font-size: 15px;
    font-weight: 700;
    line-height: 1.4;
  }

  main .hrms-card-subtitle {
    margin-top: 4px;

    color: var(--hrms-text-muted);

    font-size: 13px;
    line-height: 1.5;
  }


  /* =========================================================
     CARD BODY
     ========================================================= */

  main .hrms-card-body {
    padding: 20px;
  }


  /* =========================================================
     CARD FOOTER
     ========================================================= */

  main .hrms-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;

    padding: 14px 20px;

    border-top: 1px solid #cdd2d9;

    background:
      linear-gradient(
        180deg,
        #e2e5e9 0%,
        #dce0e5 100%
      );
  }


  /* =========================================================
     METRIC CARDS
     ========================================================= */

  main .hrms-metric {
    position: relative;
    min-height: 124px;
    overflow: hidden;

    border: 1px solid #bcc3cd;
    border-radius: var(--hrms-radius-lg);

    background:
      linear-gradient(
        135deg,
        #f1f3f5 0%,
        #dfe3e8 100%
      );

    box-shadow: var(--hrms-shadow-card);

    transition: var(--hrms-transition);
  }

  main .hrms-metric::before {
    content: "";

    position: absolute;

    top: 0;
    left: 0;
    right: 0;

    height: 3px;

    background:
      linear-gradient(
        90deg,
        #6366f1,
        #818cf8
      );

    opacity: 0.9;
  }

  main .hrms-metric:hover {
    transform: translateY(-3px);

    border-color: #aeb5c0;

    box-shadow: var(--hrms-shadow-card-hover);
  }

  main .hrms-metric-value {
    color: #0f172a;

    font-size: 28px;
    font-weight: 800;

    line-height: 1.15;

    letter-spacing: -0.025em;
  }

  main .hrms-metric-label {
    margin-top: 6px;

    color: #64748b;

    font-size: 13px;
    font-weight: 500;
  }

  main .hrms-metric-change {
    margin-top: 8px;

    font-size: 12px;
    font-weight: 600;
  }


  /* =========================================================
     ICON CONTAINERS
     ========================================================= */

  main .hrms-icon-box {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 40px;
    height: 40px;

    flex-shrink: 0;

    border: 1px solid #c8cef0;
    border-radius: 11px;

    background:
      linear-gradient(
        135deg,
        #e4e7f8,
        #d5daf3
      );

    color: var(--hrms-primary);
  }

  main .hrms-icon-box-sm {
    width: 34px;
    height: 34px;
    border-radius: 9px;
  }

  main .hrms-icon-box-lg {
    width: 48px;
    height: 48px;
    border-radius: 13px;
  }


  /* =========================================================
     STATUS ICONS
     ========================================================= */

  main .hrms-icon-success {
    border-color: #bbf7d0;
    background: var(--hrms-success-soft);
    color: var(--hrms-success);
  }

  main .hrms-icon-warning {
    border-color: #fde68a;
    background: var(--hrms-warning-soft);
    color: var(--hrms-warning);
  }

  main .hrms-icon-danger {
    border-color: #fecaca;
    background: var(--hrms-danger-soft);
    color: var(--hrms-danger);
  }

  main .hrms-icon-info {
    border-color: #bae6fd;
    background: var(--hrms-info-soft);
    color: var(--hrms-info);
  }


  /* =========================================================
     BUTTONS
     ========================================================= */

  main button {
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      border-color 160ms ease,
      background-color 160ms ease;
  }

  main button:not(:disabled):hover {
    transform: translateY(-1px);
  }

  main button:not(:disabled):active {
    transform: translateY(0);
  }

  main button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }


  /* =========================================================
     INPUTS
     ========================================================= */

  main input,
  main textarea,
  main select {
    border-color: #c3c9d2;

    background: #f8f9fa;

    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background-color 160ms ease;
  }

  main input:hover,
  main textarea:hover,
  main select:hover {
    border-color: #aeb5c0;
    background: #ffffff;
  }

  main input:focus,
  main textarea:focus,
  main select:focus {
    border-color: #818cf8;

    outline: none;

    background: #ffffff;

    box-shadow:
      0 0 0 3px rgba(99, 102, 241, 0.10);
  }

  main input::placeholder,
  main textarea::placeholder {
    color: #94a3b8;
  }


  /* =========================================================
     TABLES
     ========================================================= */

  main table {
    width: 100%;

    border-collapse: separate;
    border-spacing: 0;

    overflow: hidden;
  }

  main thead th {
    background:
      linear-gradient(
        180deg,
        #dfe3e8 0%,
        #d7dbe1 100%
      );

    color: #475569;

    font-size: 11px;
    font-weight: 700;

    letter-spacing: 0.045em;
    text-transform: uppercase;

    border-bottom: 1px solid #c4cad2;
  }

  main tbody tr {
    transition: background-color 150ms ease;
  }

  main tbody tr:hover {
    background: #e9ebee;
  }

  main tbody td {
    border-bottom: 1px solid #dfe3e8;
  }

  main tbody tr:last-child td {
    border-bottom: none;
  }


  /* =========================================================
     TABLE CONTAINER
     ========================================================= */

  main .hrms-table {
    overflow: hidden;

    border: 1px solid #c3c9d2;
    border-radius: var(--hrms-radius-lg);

    background:
      linear-gradient(
        180deg,
        #f2f3f5 0%,
        #e8eaed 100%
      );

    box-shadow: var(--hrms-shadow-card);
  }

  main .hrms-table table {
    border: 0;
    box-shadow: none;
  }


  /* =========================================================
     BADGES
     ========================================================= */

  main .hrms-badge {
    display: inline-flex;

    align-items: center;
    gap: 6px;

    padding: 5px 9px;

    border: 1px solid transparent;
    border-radius: 999px;

    font-size: 11px;
    font-weight: 700;

    line-height: 1;
  }

  main .hrms-badge-success {
    border-color: #bbf7d0;
    background: var(--hrms-success-soft);
    color: #15803d;
  }

  main .hrms-badge-warning {
    border-color: #fde68a;
    background: var(--hrms-warning-soft);
    color: #b45309;
  }

  main .hrms-badge-danger {
    border-color: #fecaca;
    background: var(--hrms-danger-soft);
    color: #b91c1c;
  }

  main .hrms-badge-info {
    border-color: #bae6fd;
    background: var(--hrms-info-soft);
    color: #0369a1;
  }

  main .hrms-badge-neutral {
    border-color: #c3c9d2;
    background: #e3e6ea;
    color: #475569;
  }


  /* =========================================================
     DIVIDERS
     ========================================================= */

  main .hrms-divider {
    height: 1px;
    width: 100%;

    background: #cfd4db;
  }


  /* =========================================================
     PROGRESS BARS
     ========================================================= */

  main .hrms-progress {
    width: 100%;
    height: 7px;

    overflow: hidden;

    border-radius: 999px;

    background: #c8cdd4;
  }

  main .hrms-progress-bar {
    height: 100%;

    border-radius: inherit;

    background:
      linear-gradient(
        90deg,
        #6366f1,
        #818cf8
      );

    transition: width 400ms ease;
  }


  /* =========================================================
     AVATARS
     ========================================================= */

  main .hrms-avatar {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    overflow: hidden;

    border: 2px solid #ffffff;
    border-radius: 999px;

    background:
      linear-gradient(
        135deg,
        #d7dcef,
        #c3c9e5
      );

    color: #3730a3;

    font-weight: 700;

    box-shadow:
      0 1px 3px rgba(15, 23, 42, 0.18);
  }

  main .hrms-avatar-sm {
    width: 32px;
    height: 32px;
    font-size: 11px;
  }

  main .hrms-avatar-md {
    width: 40px;
    height: 40px;
    font-size: 13px;
  }

  main .hrms-avatar-lg {
    width: 52px;
    height: 52px;
    font-size: 16px;
  }


  /* =========================================================
     EMPTY STATES
     ========================================================= */

  main .hrms-empty-state {
    display: flex;

    flex-direction: column;

    align-items: center;
    justify-content: center;

    min-height: 220px;

    padding: 32px;

    text-align: center;

    border: 1px dashed #aeb5c0;
    border-radius: var(--hrms-radius-lg);

    background:
      linear-gradient(
        180deg,
        #eceef1,
        #dfe3e8
      );
  }

  main .hrms-empty-state-icon {
    display: flex;

    align-items: center;
    justify-content: center;

    width: 52px;
    height: 52px;

    margin-bottom: 14px;

    border-radius: 14px;

    background: #d3d7dd;

    color: #64748b;
  }


  /* =========================================================
     ALERTS
     ========================================================= */

  main .hrms-alert {
    display: flex;

    align-items: flex-start;

    gap: 12px;

    padding: 14px 16px;

    border: 1px solid;

    border-radius: var(--hrms-radius-md);
  }

  main .hrms-alert-info {
    border-color: #bae6fd;
    background: #f0f9ff;
    color: #075985;
  }

  main .hrms-alert-success {
    border-color: #bbf7d0;
    background: #f0fdf4;
    color: #166534;
  }

  main .hrms-alert-warning {
    border-color: #fde68a;
    background: #fffbeb;
    color: #92400e;
  }

  main .hrms-alert-danger {
    border-color: #fecaca;
    background: #fef2f2;
    color: #991b1b;
  }


  /* =========================================================
     DROPDOWNS / POPOVERS
     ========================================================= */

  main [role="menu"],
  main [role="listbox"] {
    border: 1px solid #c3c9d2;

    background: #f8f9fa;

    box-shadow:
      0 12px 28px rgba(15, 23, 42, 0.14),
      0 5px 12px rgba(15, 23, 42, 0.08);
  }


  /* =========================================================
     MODALS
     ========================================================= */

  main [role="dialog"] {
    border: 1px solid #c3c9d2;

    background:
      linear-gradient(
        180deg,
        #f7f8f9 0%,
        #eceef1 100%
      );

    box-shadow:
      0 24px 50px rgba(15, 23, 42, 0.18),
      0 10px 24px rgba(15, 23, 42, 0.09);
  }


  /* =========================================================
     LINKS
     ========================================================= */

  main a {
    transition:
      color 150ms ease,
      opacity 150ms ease;
  }


  /* =========================================================
     ACCESSIBILITY
     ========================================================= */

  main button:focus-visible,
  main a:focus-visible,
  main input:focus-visible,
  main textarea:focus-visible,
  main select:focus-visible {
    outline: 2px solid #818cf8;
    outline-offset: 2px;
  }


  /* =========================================================
     SKELETON
     ========================================================= */

  main .hrms-skeleton {
    overflow: hidden;

    border-radius: 8px;

    background:
      linear-gradient(
        90deg,
        #cfd4da 25%,
        #e7e9ec 37%,
        #cfd4da 63%
      );

    background-size: 400% 100%;

    animation: hrms-skeleton-loading 1.4s ease infinite;
  }

  @keyframes hrms-skeleton-loading {
    0% {
      background-position: 100% 0;
    }

    100% {
      background-position: -100% 0;
    }
  }


  /* =========================================================
     MAIN SCROLLBAR
     ========================================================= */

  main.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #9ca5b1 transparent;
  }

  main.custom-scrollbar::-webkit-scrollbar {
    width: 7px;
  }

  main.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  main.custom-scrollbar::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: #aeb5c0;
  }

  main.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #929ba8;
  }


  /* =========================================================
     RESPONSIVE
     ========================================================= */

  @media (max-width: 640px) {
    main .hrms-card-header {
      padding: 15px 16px;
    }

    main .hrms-card-body {
      padding: 16px;
    }

    main .hrms-card-footer {
      padding: 12px 16px;
    }

    main .hrms-metric {
      min-height: 112px;
    }

    main .hrms-metric-value {
      font-size: 24px;
    }
  }


  /* =========================================================
     REDUCED MOTION
     ========================================================= */

  @media (prefers-reduced-motion: reduce) {
    main *,
    main *::before,
    main *::after {
      scroll-behavior: auto !important;

      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;


/* =========================================================
   STYLE INJECTION
   ========================================================= */

let stylesInjected = false;

export function injectUiStyles(): void {
  if (stylesInjected) {
    return;
  }

  if (typeof document === "undefined") {
    return;
  }

  const existingStyle = document.getElementById(
    "corehr-global-ui-styles"
  );

  if (existingStyle) {
    stylesInjected = true;
    return;
  }

  const style = document.createElement("style");

  style.id = "corehr-global-ui-styles";
  style.setAttribute("data-source", "UiStyles.tsx");
  style.textContent = GLOBAL_UI_STYLES;

  document.head.appendChild(style);

  stylesInjected = true;
}


/* =========================================================
   INJECT STYLES WHEN IMPORTED
   ========================================================= */

if (typeof document !== "undefined") {
  injectUiStyles();
}


export default injectUiStyles;
