# Real Estate Expense Tracking — Project Audit

## 1. Executive Summary

This project is a real-estate expense tracking and expense normalization automation effort built around a Google Apps Script-based spreadsheet workflow and an HTML dashboard. The project uses a Google Sheet / workbook structure with anonymized data and multiple supplier-specific tabs, and it consolidates purchases from Home Depot, Temu, Amazon, Lowes, Floor & Decor, Mastercard, and Checks into a unified operational summary and project-level dashboard.

The strongest evidence in the project is the combination of:
- the Apps Script file `Code.gs`
- the dashboard file `Dashboard.html`
- the anonymized workbook `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx`
- the prompt documents for each extraction source in the project root

This is not a Power BI project, not a synthetic learning project, and not a hypothetical automation demo. It is a real client-style operational expense automation workflow with anonymized data and implementation evidence.

Important classification:
- OBSERVED IN IMPLEMENTATION: the Google Sheets workbook structure, Apps Script functions, dashboard HTML, and prompt assets are present in the folder.
- CLIENT-PROVIDED INFORMATION: the project explicitly describes anonymized data for a real client workflow.
- CREATOR-PROVIDED HISTORY: the project includes the extraction prompts and workbook naming conventions that show a hands-on operational process.
- INFERENCE: the original company name and exact client contract details are not exposed and are intentionally anonymized.
- UNKNOWN: the precise original implementation environment, production deployment details, and exact client business process documentation beyond the anonymized artifacts.

## 2. Client Engagement Context

### Finding
The project is a real client engagement centered on real estate expense tracking and data consolidation.

### Evidence
- The project folder contains a spreadsheet workbook named `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx` with explicit anonymization notices.
- The workbook includes sheets such as `Summary`, `Payment Summary`, `Home Depot`, `Temu`, `Amazon`, `Lowes`, `Floor and Decor`, `Mastercard`, `Checks`, `Project Settings`, and `Points to be fixed`.
- The code file names and menu structure show an operational dashboard for expense operations across supplier channels.
- Prompt files are named by supplier and process step, indicating multi-source data extraction and normalization work.

### Classification
- CLIENT-PROVIDED INFORMATION
- OBSERVED IN IMPLEMENTATION
- INFERENCE where exact contractual details are not visible

### Finding
The project is not a learning/practice project and should not be described as a synthetic portfolio exercise. It is a real-estate expense automation case with client-like expense structures and anonymized operational data.

### Evidence
- The analyst-facing workbook states: “THIS WORKSHEET HAS ANONYMIZED DATA - Names, properties, payment details, and amounts are synthetic and do not represent real client data.”
- The application is operational and built around real-estate project names and suppliers.

### Classification
- CLIENT-PROVIDED INFORMATION
- OBSERVED IN IMPLEMENTATION

## 3. Business Problem

### Finding
The underlying business problem is multi-source real estate expense tracking across multiple projects and suppliers, with a need to normalize and consolidate purchases into a single operational view.

### Evidence from implementation
- The Apps Script code defines project names:
  - `Ashford`
  - `Brookline`
  - `Cedarcrest`
  - `Elmsworth`
  - `Graystone`
  - `Hawthorne`
- The code also defines suppliers:
  - `Home Depot`
  - `Temu`
  - `Amazon`
  - `Lowes`
  - `Floor and Decor`
  - `Mastercard`
  - `Checks`
- The dashboard is built around summary metrics such as:
  - total spend
  - real-estate spend vs personal spend
  - untagged transactions
  - costs by project
  - costs by supplier
  - project and owner breakdowns

### Business issue reconstructed from the evidence
- The client had to aggregate expenditures from multiple suppliers and channels into a common operating picture.
- Vendor data had inconsistent project coding, payment attribution, department values, classification, and personal vs business classification.
- The workflow needed a single dashboard for review and validation.
- The system needed a way to distinguish real-estate operations from personal purchases, and to flag missing or ambiguous information.

### Classification
- OBSERVED IN IMPLEMENTATION
- INFERENCE
- UNKNOWN for the original client’s exact internal process and KPI definitions

### Finding
The client needed a way to answer operational questions such as:
- Which project spent what?
- Which supplier contributed the largest amount?
- Which costs were personal vs business-related?
- Which expenses were untagged or missing project or payment data?
- Who paid for each transaction?
- Which periods were the heaviest spending periods?

### Classification
- OBSERVED IN IMPLEMENTATION
- INFERENCE from the dashboard and summary design

## 4. Project Inventory

The exact project folder is:
- `D:\Power BI\Real Estate expense tracking`

The following files were verified inside this project folder:

- `Amazon_Extraction_Prompt_v1 (1) (1).md`
- `Code.gs`
- `Dashboard.html`
- `Floor_and_Decor_Extraction_Prompt_v1.md`
- `HomeDepot_Extraction_Prompt_v1 (1) (1).md`
- `Lowes_Extraction_Prompt_v2(1).md`
- `Mastercard_Processing_Prompt (1) (1).md`
- `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx`
- `Schwab_Fairmount_Processing_Prompt (1).md`
- `Temu_Extraction_Prompt_v7 (1).md`

### Folder-level interpretation
- The project is a Google Apps Script / Google Sheets-based operational automation layer.
- The data is represented in an anonymized workbook with multiple supplier tabs and summary tabs.
- The prompts provide extraction logic for each vendor workflow.
- The dashboard is built as a local HTML interface served within the Google Apps Script environment.

### Classification
- OBSERVED IN IMPLEMENTATION

## 5. Source Data Landscape

### Finding
The source landscape is multi-vendor and multi-channel. The workbook consolidates multiple supplier datasets into one common structure.

### Verified source families

1. Home Depot
- Format: Excel/CSV-style structured purchase history export
- Purpose: capture item-level purchase and return details
- Observed data: transaction date, transaction ID, job name, SKU, item description, quantity, unit price, department, class, subclass, discount, extended retail, net price
- Evidence: `HomeDepot_Extraction_Prompt_v1 (1) (1).md`

2. Temu
- Format: order detail export / website-based extraction
- Purpose: itemized purchase and return records with shipping-address-based project assignment
- Observed data: transaction date, order ID, item description, quantity, unit price, total paid, payment instrument, department, class, subclass, project, paid by
- Evidence: `Temu_Extraction_Prompt_v7 (1).md`

3. Amazon
- Format: order history / refund details export
- Purpose: line-item purchases and refund entries, with project assignment from shipping address
- Observed data: order ID, ASIN/SKU, product name, quantity, total amount, refund amount, payment method, project, department/class/subclass, paid by
- Evidence: `Amazon_Extraction_Prompt_v1 (1) (1).md`

4. Lowes
- Format: browser-based extracted order history data
- Purpose: purchase and return entries with PO/job mapping, payment details, and category assignment
- Observed data: order date, order number, item number, product description, quantity, unit price, total paid, project, payment instrument, department, class, subclass, return logic, paid by
- Evidence: `Lowes_Extraction_Prompt_v2(1).md`

5. Floor & Decor
- Format: order detail extraction from website / order history
- Purpose: order-line purchase and return records with project mapping, tax calculations, payment instruments, and item taxonomy
- Observed data: transaction date, order / PO number, item SKU, item description, quantity, unit price, total paid, project, payment type, department, class, subclass, business/personal flag, paid by
- Evidence: `Floor_and_Decor_Extraction_Prompt_v1.md`

6. Mastercard
- Format: credit card statement export (CSV-like transactional data)
- Purpose: bank statement line items, categorized as supplier or personal/real-estate-related transactions
- Observed data: status, date, description, debit, credit, vendor, category, payment instrument, department/class subtype classification
- Evidence: `Mastercard_Processing_Prompt (1) (1).md`

7. Checks
- Format: checks / disbursement statement data
- Purpose: direct cash/check-based expenditures requiring review and classification
- Evidence: the workbook includes a `Checks` sheet and prompt references to checks activity

8. Schwab (Fairmount)
- Format: bank statement CSV
- Purpose: Fairmount-specific bank transactions, including deposits, transfers, passes, and purchases
- Evidence: `Schwab_Fairmount_Processing_Prompt (1).md`

### Summary of data grain
The project appears to operate at transaction-line level, with one row per purchase / return / card statement line in the final source tabs. This is consistent with the project’s need to summarize by supplier, project, owner, and period.

### Classification
- OBSERVED IN IMPLEMENTATION
- PROMPT / DEVELOPMENT EVIDENCE

## 6. Data Inconsistencies and Quality Challenges

### Finding
The project explicitly addresses multiple data-quality issues across source datasets.

### Confirmed inconsistencies from evidence

1. Inconsistent project coding
- Different sources use different project references and raw job names.
- Example: Home Depot uses job names; Amazon uses shipping address; Lowes uses PO/job names; Floor & Decor uses PO/Job fields.
- The prompts explicitly instruct project mapping logic based on source-specific values.
- Evidence: supplier prompts and `Project Settings` tab in the workbook.

2. Mixed business and personal spending
- Product descriptions and transaction categories must be classified as Business or Personal.
- The prompts repeatedly warn against using the shipping address as the determinant for business/personal classification.
- Evidence: Amazon and Temu prompts explicitly say address is not the deciding factor.

3. Missing project assignment / missing paid-by mapping
- Several prompts specify rules for blank project names, unknown job names, and missing paid-by mapping.
- Evidence: `No recognizable Job Name`, `Payment Method Type has no card detail`, `Card [last4] not in Paid By mapping`, and the `Points to be fixed` sheet in the workbook.

4. Different supplier naming conventions
- Suppliers use different naming styles, such as `Home Depot`, `Floor and Decor`, `LOWES`, `TEMU`, `AMZN`, and `MasterCard`.
- Standardization rules map to common normalized names or maintain raw vendor names for reconciliation.

5. Different date and tax conventions
- Several prompts specify formulaic tax inclusion at 6.625% NJ sales tax.
- Some uploads use unit price, some extended retail, some refund data; the project normalizes all to a consistent V3 output structure.

6. Return handling complexity
- Return records are not always straightforward; some prompts describe return matching across original purchase orders and standalone return entry flows.
- Example: Lowes return handling requires matching a standalone return order to the original purchase order and refund issuance.

7. Payment attribution ambiguity
- Some card numbers are mapped to named owners; others remain unresolved and require stakeholder confirmation.
- Evidence: `Code.gs` has `Paid By` and `Missing project/nature/paidBy` checks.

### Handling mechanism
- The workflow standardizes to a fixed template with columns:
  - Tranaction Date
  - Order / PO #
  - Item # / SKU
  - Item Description
  - Qty
  - Unit Price
  - Total Paid (Sales Tax Inc.)
  - Transaction Type
  - Project
  - Payment Instrument
  - Department
  - Class
  - Subclass
  - Reconciliatoin Status
  - Purchasing Nature / Business / Personal
  - Paid By

### Classification
- OBSERVED IN IMPLEMENTATION
- PROMPT / DEVELOPMENT EVIDENCE
- INFERENCE for exact automation rules across every edge case

## 7. Multi-Source Consolidation

### Finding
The system is designed to take multiple supplier datasets and normalize them into a common V3 structure before feeding a unified summary and dashboard.

### Consolidation flow in the evidence

Multiple supplier exports
↓
Supplier-specific extraction prompts
↓
Normalization to standard V3 columns
↓
Consolidated tabs in the anonymized workbook
↓
Summary and payment aggregation
↓
Dashboard reporting

### Evidence
- `Code.gs` reads all supplier sheets using `SpreadsheetApp` and builds summary outputs.
- `readAllRows(fromDate, toDate)` reads data from each supplier sheet and standardizes row objects.
- The script aggregates by project, department, class, subclass, supplier, and ownership.
- The summary dashboard displays totals by project and by supplier after filtering and normalization.

### Source-specific standardization examples
- `normalizeProject(raw)` maps raw project values to canonical project names.
- `isPersonal(row)` identifies personal spending using the `nature` field.
- `groupBySupplier(rows)` aggregates spend by supplier.
- `getProjectBreakdown(project, filters)` rolls up by department/class/subclass for a given project.

### Classification
- OBSERVED IN IMPLEMENTATION
- PROMPT / DEVELOPMENT EVIDENCE

## 8. Unified Database / Data Layer

### Finding
The unified storage layer is a Google Sheets workbook and a script-driven operational data layer, not a relational database server or enterprise warehouse.

### Verified artifacts
- `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx` contains supplier tabs and summary tabs.
- `Code.gs` reads the sheets directly with `SpreadsheetApp`, builds summary data, and serves it to the dashboard.

### Observed workbook structure
- `Summary`
- `Payment Summary`
- `Home Depot`
- `Temu`
- `Amazon`
- `Lowes`
- `Floor and Decor`
- `Mastercard`
- `Checks`
- `Project Settings`
- `Points to be fixed`

### Apparent data model
The workbook uses a tabular data model with each supplier stored as a tab, then summarized into:
- supplier totals
- project totals
- payment-owner totals
- untagged transaction views
- project breakdowns

### Grain
- Supplier tab grain: transaction line-level purchases and returns
- Summary tab grain: project-by-supplier totals and last pull dates
- Payment Summary tab grain: paid-by totals by project

### Duplicate prevention or reconciliation
The evidence shows handling of duplicates and reconciliation via:
- `Points to be fixed` tab
- explicit `Reconciliatoin Status` column
- data-quality flags like missing project, missing natural classification, or missing payment attribution
- summary audit checks

### Classification
- OBSERVED IN IMPLEMENTATION
- INFERENCE for whether this was intended as a permanent database layer vs an operational workbook model

## 9. Data Transformation and Normalization

### Finding
The system standardizes all source data into a common transaction schema and then groups it for reporting.

### Observed transformation steps
1. Raw supplier data from source exports is read and mapped.
2. Project values are normalized to canonical names.
3. Payment method and payment owner mapping is applied.
4. Business/personal classification is assigned using item descriptions or classification rules.
5. Department/class/subclass values are normalized by taxonomy.
6. Summary rows are aggregated by project, owner, and supplier.
7. Missing information is flagged rather than silently dropped or normalized incorrectly.

### Examples from implementation
- `normalizeProject(raw)` removes case and normalizes project names.
- `isPersonal(row)` uses `nature` field and `personal` pattern detection.
- `readAllRows(fromDate, toDate)` filters by date range, excludes blank/invalid rows, and builds a standardized object.
- `getProjectBreakdown(project, filters)` groups values by department/class/subclass.

### Important data quality rules observed
- `Untagged` transactions are tracked when project, nature, or paid-by values are missing.
- `Audit Check` logic is present in the summary layer.
- The workbook includes a `Points to be fixed` sheet, implying manual reconciliation or review work remained.

### Classification
- OBSERVED IN IMPLEMENTATION

## 10. Automation Architecture

### Finding
The core automation is a combination of Google Apps Script and Google Sheets-based data processing.

### Actual workflow captured in code
- `onOpen()` adds a custom menu: `Meridian Tools` and `Dashboard`.
- `openDashboard()` opens a dashboard HTML UI.
- `readAllRows(fromDate, toDate)` reads all supplier tabs and standardizes rows.
- `getDashboardData(filters)` calculates KPIs and grouped totals.
- `getProjectBreakdown(project, filters)` aggregates project-level departmental detail.
- `getSummaryTable()` reads the `Summary` sheet directly and formats dates server-side.

### Trigger mechanism
- The menu-based script is manually invoked by user action from the Google Sheet UI.
- No recurring scheduler is visible in the code snippet itself.
- The automation is therefore not proven to be fully scheduled or event-driven as implemented in the visible code.

### Classification
- OBSERVED IN IMPLEMENTATION
- UNKNOWN for actual deployment scheduling beyond the local script UI

## 11. Google Apps Script Implementation

### Files and functions observed
- `Code.gs`
- `Dashboard.html`

### Functions in `Code.gs`
- `onOpen()`
- `openDashboard()`
- `getProjectList()`
- `normalizeProject(raw)`
- `isPersonal(row)`
- `groupBySupplier(rows)`
- `readAllRows(fromDate, toDate)`
- `getLastUpdated()`
- `getAuditCheckValue()`
- `getSummaryTable()`
- `getDashboardData(filters)`
- `getProjectBreakdown(project, filters)`

### What the script does
- Reads data from supplier tabs
- Filters dates
- Normalizes project names
- Determines whether a row is personal or business-related
- Aggregates totals by project and owner
- Produces KPI values for the dashboard
- Reads the `Summary` sheet and serves it to the HTML dashboard

### What is not visible in the code
- Direct external database connections
- API integrations beyond the Google Sheets environment
- scheduled job definitions
- production auth system
- deployed web application backend

### Classification
- OBSERVED IN IMPLEMENTATION
- UNKNOWN regarding broader production orchestration beyond Google Apps Script environment

## 12. Dashboard Implementation

### Finding
The dashboard is implemented as a Google Apps Script HTML UI in `Dashboard.html`.

### Observed technology
- Google Apps Script HTMLService
- client-side JavaScript
- CSS and table-based UI
- no external framework is visible in the file content reviewed

### Observed capabilities
- Executive summary view
- project breakdown view
- supplier summary table
- owner/project spending table
- personal spending table
- untagged transactions panel
- filters by date and project
- KPI cards and summary panels

### Data flow
Google Sheets workbook
→ Apps Script `readAllRows` / `getDashboardData`
→ HTML dashboard data object
→ JavaScript rendering in `Dashboard.html`
→ executive summary / project drilldown UI

### Classification
- OBSERVED IN IMPLEMENTATION

## 13. Google Sheet / Operational Layer

### Finding
The workbook acts as the operational system of record for this project rather than a Power BI semantic model.

### Verified workbook structure
- `Summary`
- `Payment Summary`
- `Home Depot`
- `Temu`
- `Amazon`
- `Lowes`
- `Floor and Decor`
- `Mastercard`
- `Checks`
- `Project Settings`
- `Points to be fixed`

### Observed workbook characteristics
- Contains explicit project and supplier rollups.
- Contains supplier-specific tabs with transaction history.
- Contains summary tabs that aggregate spend across multiple sources.
- Contains a `Points to be fixed` tab that indicates unresolved or review-needed items.
- Contains anonymized data and project labels.

### Evidence from workbook sample
The workbook includes rows such as:
- `Ashford`, `Brookline`, `Cedarcrest`, `Elmsworth`, etc. as project names
- `Marcus Reyes`, `Diane Reyes` as anonymized paid-by names
- supplier-specific rows with transaction values and project code assignments

### Classification
- OBSERVED IN IMPLEMENTATION
- CLIENT-PROVIDED INFORMATION (anonymized data within workbook)

## 14. AI-Assisted Development Evidence

### Finding
The project contains explicit prompt files for supplier extraction workflows and normalization logic, which is strong evidence of AI-assisted development and iterative prompt-driven work.

Examples of prompt files:
- `Amazon_Extraction_Prompt_v1 (1) (1).md`
- `Floor_and_Decor_Extraction_Prompt_v1.md`
- `Lowes_Extraction_Prompt_v2(1).md`
- `HomeDepot_Extraction_Prompt_v1 (1) (1).md`
- `Mastercard_Processing_Prompt (1) (1).md`
- `Schwab_Fairmount_Processing_Prompt (1).md`
- `Temu_Extraction_Prompt_v7 (1).md`

### What the prompts reveal
- They are structured extraction and classification instructions for each data source.
- They specify project mapping logic, tax rules, payment rules, and category mappings.
- They define how specific supplier data should be normalized into the V3 output schema.
- They outline edge cases and quality reviews.

### Important distinction
- AI-assisted development is clearly evidenced.
- The project does not show proof that the entire system was AI-generated without human oversight.
- The code and workbook still show real operational logic and manual review patterns that are part of the implemented system.

### Classification
- PROMPT / DEVELOPMENT EVIDENCE
- OBSERVED IN IMPLEMENTATION
- UNKNOWN for precise division of human vs AI work in individual steps

## 15. End-to-End Data Lineage

### Verified lineage

Multiple supplier exports
↓
Supplier extraction prompts / source-data handling
↓
Normalization to V3 structure
↓
Supplier tabs in anonymized workbook
↓
Summary and payment aggregation tabs
↓
Apps Script summary logic
↓
HTML dashboard view
↓
Operational reporting for project and owner analysis

### Important lineage paths
- Transaction → Supplier tab → Summary → Dashboard KPI
- Project / job name → `normalizeProject` → rolled up project totals
- Payment method → `Paid By` mapping → Payment Summary
- Business vs personal classification → `isPersonal` logic → real-estate vs personal segmentation
- Department/class/subclass → project breakdown → operational review

### Classification
- OBSERVED IN IMPLEMENTATION
- INFERENCE for the exact client-side operational workflow beyond the visible files

## 16. Manual vs Automated Boundary

### Automated
- Reading supplier sheets in Google Apps Script
- Standardizing project names via `normalizeProject`
- Identifying personal vs business rows via `isPersonal`
- Grouping supplier totals
- Building KPI outputs and summary tables
- Serving dashboard data to the HTML UI

### Semi-automated
- Extraction of item-level details from supplier portals and emails is guided by prompts and source-specific rules but may still require manual browser work.
- Payment attribution and project classification in edge cases remain review-driven.

### Manual
- Review of ambiguous transactions and `Points to be fixed`
- Resolution of missing project values and missing payment attribution
- Final stakeholder confirmation for edge-case classification
- Supplier-specific data extraction from external portals using the defined prompts

### Unknown
- Whether the workflow was set to run on a schedule in a production environment
- Whether the process was integrated with external APIs beyond the visible workbook and script

### Classification
- OBSERVED IN IMPLEMENTATION
- UNKNOWN

## 17. Implemented vs Partially Implemented vs Planned

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Multi-source expense consolidation | IMPLEMENTED | Workbook tabs, `Code.gs`, dashboard summary logic | Supplier tabs are consolidated into summary views |
| Project normalization | IMPLEMENTED | `normalizeProject` in `Code.gs` | Canonical project names are normalized |
| Personal vs business classification | IMPLEMENTED | `isPersonal()` and prompt rules | Explicitly operationalized |
| Payment owner mapping | IMPLEMENTED | `Paid By` logic and payment summary tab | Some unresolved rows require manual follow-up |
| Supplier-specific extraction prompts | IMPLEMENTED | Supplier prompt files | Strong evidence of source-by-source workflow |
| Dashboard UI | IMPLEMENTED | `Dashboard.html` | Executive and project views present |
| Data-quality review and unresolved item tracking | IMPLEMENTED | `Points to be fixed`, `Reconciliatoin Status` | Evident review mechanism |
| Full automation scheduling | UNKNOWN | No visible scheduler in code | Not proven from this folder |
| Fully productionized database layer | UNKNOWN | Google Sheets workbook not a formal DB | Operational workbook storage, not enterprise warehouse |
| End-to-end external system integration | UNKNOWN | No direct API/DB evidence in visible files | Likely workbook-centric implementation |
| Final client deployment / live hosting | UNKNOWN | No deployment evidence in the folder | Not enough visible evidence to claim live production operation |

## 18. Client Impact and Outcomes

### Finding
The project contains evidence of an operational workflow intended to reduce manual expense consolidation and improve repeatability, but the exact client impact is not fully evidenced.

### Verified metrics from artifacts
- The workbook includes summary totals across supplier and project dimensions.
- The workbook includes `Last Pull Date` fields by supplier.
- There are multiple project names and supplier totals, showing actual aggregation volume.
- `Summary` tab and `Payment Summary` tab show multi-project, multi-supplier consolidated totals.

### Creator-reported or operationally implied metrics
- The system consolidates data across multiple vendors and properties.
- It reduces manual spreadsheet work and standardizes classification.
- It exposes untagged transactions and missing owner information for review.

### Classification
- VERIFIED FROM ARTIFACTS: project totals, project names, summary tabs, supplier rollups
- CREATOR-REPORTED: repeatability and workflow efficiency improvements
- UNKNOWN: quantified time saved, ROI, or exact business KPIs beyond the observed artifact values

### Important boundary
The project supports a credible claim of operational efficiency and data consolidation, but not a quantified business outcome unless the project includes explicit metrics or client reporting artifacts.

## 19. Security and Privacy Observations

### Finding
The project contains anonymized data and intentionally removes client identifiers, but the visible code and workbook also show operational fields that may require careful handling.

### Observed privacy measures
- The workbook explicitly states its data is anonymized and synthetic.
- Actual client names, property names, and payment details are obscured.
- The project does not expose raw private URLs or credentials in the reviewed files.

### Sensitive data caution
- The script uses sheet names and project/payment references; no obvious secret values were exposed in the reviewed code.
- The project can still contain sensitive operational patterns and transaction values, which should be treated as managed operational data even though anonymized.

### Classification
- OBSERVED IN IMPLEMENTATION
- CLIENT-PROVIDED INFORMATION

## 20. Portfolio-Relevant Capabilities

This project genuinely demonstrates:
- real-world expense reconciliation across multiple sources
- source-specific extraction and normalization
- data quality engineering
- project and supplier mapping
- standardization of inconsistent data formats
- spreadsheet and Google Apps Script automation
- operational dashboarding
- multi-source reporting and review workflows
- AI-assisted prompt-driven transformation work

This is relevant to a portfolio because it shows the ability to build a repeatable operational reporting system around messy real-world data rather than a synthetic academic example.

## 21. Case-Study-Ready Facts

### Verified facts
- The project consolidates expenses across multiple supplier channels and project names.
- It standardizes data from Home Depot, Amazon, Temu, Lowes, Floor & Decor, Mastercard, Checks, and Schwab-like bank transactions.
- It assigns project names and payment owners, and separately flags missing or ambiguous data.
- The workbook includes summary and payment rollups, plus unresolved-review tabs.
- The workflow is implemented through Google Apps Script and an HTML dashboard.
- The project uses anonymized operational data to protect client identity.

### Creator-provided history
- The project was built as a real client expense automation workflow.
- The prompting and extraction instructions reflect a client-facing operational solution rather than a classroom assignment.

### Classification
- VERIFIED FROM ARTIFACTS
- CREATOR-PROVIDED HISTORY

## 22. Claims That Should NOT Be Made

The evidence does not support the following claims:
- “This was a Power BI project.”
- “This was a learning exercise.”
- “This is a fully automated production system with no manual review.”
- “This was entirely AI-generated.”
- “This achieved measured ROI or time savings without explicit proof.”
- “This is a live production deployment with complete client integration evidence.”
- “This is an enterprise warehouse solution.”

## 23. Technical Limitations and Unknowns

### Unknowns
- Original client identity and exact project name cannot be disclosed because the data is anonymized.
- Exact production deployment details are not present in the project folder.
- Whether all workflow stages were executed in live automation or manually during project delivery is not fully visible.
- The full live business process and approval chain is not fully documented in the folder.
- The exact number of live client users and ongoing operational adoption cannot be verified from the project artifacts alone.

### Boundaries of evidence
The audit is based on the artifacts within the project folder only and does not assume hidden systems or undocumented workflows.

## 24. Audit Method and Evidence Boundaries

This audit was conducted using read-only forensic inspection of the exact project folder:
- `D:\Power BI\Real Estate expense tracking`

The evidence includes:
- `Code.gs`
- `Dashboard.html`
- `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx`
- supplier extraction prompts
- workbook structure and sheet names
- visible summary logic and data patterns

The audit intentionally distinguishes between:
- OBSERVED IN IMPLEMENTATION
- CLIENT-PROVIDED INFORMATION
- CREATOR-PROVIDED HISTORY
- PROMPT / DEVELOPMENT EVIDENCE
- INFERENCE
- UNKNOWN

This prevents unsupported assumptions from being converted into facts.

## 25. Final Factual Project Summary

The actual project truth is:
- This is a real-estate expense tracking and consolidation engagement built around a Google Sheets + Google Apps Script operational system.
- The project consolidates supplier data into a common transaction structure and summary dashboard.
- The implementation is built around an anonymized workbook with supplier tabs, summary rollups, and unresolved items tracking.
- The system uses project normalization, supplier mapping, payment attribution, and classification rules to standardize operational spend.
- The dashboard and Apps Script provide reporting and review functions that support real-estate portfolio expense analysis.
- The project is evidence of real-world multi-source data consolidation and repeatable operational reporting, not a synthetic learning exercise.
- The strongest honest portfolio description is: a real-estate expense automation and data consolidation implementation with anonymized client data, built in Google Apps Script and Google Sheets, and supported by supplier extraction prompts and summary dashboard logic.

This project should be represented honestly as an operational expense automation case study with anonymized data, not as a Power BI project or a classroom exercise.
