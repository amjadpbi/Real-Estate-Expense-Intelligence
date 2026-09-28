# Real Estate Expense Tracking

## Project Overview
This project is a real-estate expense tracking and automation workflow built around a Google Apps Script-driven dashboard and spreadsheet-based operational model. It consolidates multi-source expense data, normalizes project assignments, and surfaces exceptions for review.

## Project Nature
Real client engagement using anonymized/public-safe project data.

## Business Context
The workflow was designed to consolidate spending from multiple supplier channels and real-estate project sources into a shared operational view. The project includes supplier-specific import logic, project classification, and payment-owner review.

## Data
- Source type: supplier exports, statement-like transaction records, and workbook-based operational data
- Data format: Excel/Sheets workbook plus supplier extraction files
- Data nature: anonymized/public-safe sample data
- Included evidence: `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx`, `Code.gs`, `Dashboard.html`, and supplier prompt files

## Solution
The project uses Google Sheets and Google Apps Script to:
- read supplier data
- normalize project names
- identify personal vs business spend
- attribute payment ownership
- aggregate by project and vendor
- surface unresolved items
- display KPI results in a dashboard

## Architecture / Workflow
1. Supplier data is ingested into workbook tabs.
2. Normalization rules standardize project, supplier, and payment fields.
3. Summary tabs aggregate totals by project and owner.
4. Missing or ambiguous records are highlighted for review.
5. The dashboard renders KPI and breakdown views.

## Key Features
- real-estate project consolidation
- multi-supplier spend normalization
- payment attribution review
- business/personal classification logic
- dashboard-based review layer
- exception tracking for unresolved records

## Project Status
This repository contains the public-safe implementation artifacts and anonymized evidence for the project. Client-sensitive identifiers and confidential metadata were excluded from the public-facing repository.

## Limitations
- The public repo uses anonymized data only.
- Client-specific private identifiers are intentionally excluded.
- The public-facing materials reflect the workflow implementation and not the full private operational environment.

## Repository Structure
- `Code.gs` — Apps Script logic
- `Dashboard.html` — dashboard UI
- `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx` — anonymized sample workbook
- supplier prompt files — extraction and normalization details

## Technologies
- Google Apps Script
- Google Sheets / spreadsheet workflow
- HTML dashboard
- Excel-based source workbook
