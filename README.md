# Real Estate Expense Intelligence

> **Public anonymization notice:** This repository is a public-safe demonstration of a real client engagement. All names, company identifiers, property/project names, addresses, payment-owner references, and other identifying details in the repository have been anonymized or replaced. The data shown here is synthetic/anonymized and does not represent real client data.

Real-estate expense automation and project-level review workflow built around Google Apps Script, Sheets, and an operational dashboard.

## Project Overview
This project consolidates supplier data, normalizes real-estate project assignments, and surfaces expense exceptions for review. The implementation centers on a spreadsheet-driven workflow and an HTML dashboard that summarize operational spending and review items.

## Business Context
This is a real client-style operational project, using anonymized/public-safe data. The project captures a multi-supplier expense workflow and is designed to improve visibility into project-level spend, ownership attribution, and unresolved exceptions.

## Problem
The workflow needed a consistent way to ingest supplier files, standardize project names and payment ownership, separate business and personal items where they were mixed, and expose review exceptions without losing accountability.

## Solution
The repository contains Google Apps Script logic, a dashboard UI, and an anonymized spreadsheet sample representing the operational workflow. It standardizes vendor and project naming, aggregates totals by project and owner, and highlights exceptions for manual review.

## Data
- Source type: supplier exports, statement-like records, and workbook-based operational data
- Data nature: anonymized/public-safe operational sample
- Key files: Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx, Code.gs, Dashboard.html, extraction prompt documents

## Technical Approach
- import supplier data into spreadsheet tabs
- normalize project, supplier, and payment fields
- summarize totals by project and owner
- flag unresolved or ambiguous items
- present KPI and exception views in an HTML dashboard

## Key Analytical Areas
- project spend review
- supplier-level aggregation
- payment attribution and ownership review
- exception tracking
- business vs personal classification logic

## Evidence / Scope
The repository contains the Apps Script implementation, dashboard UI, anonymized sample workbook, and extraction prompts. The evidence supports a semi-automated operational workflow with public-safe anonymized data, not a production system description or client-identifying information.

## Limitations
- public-safe anonymized sample only
- no live operational system integration evidence
- no production deployment claims beyond the implemented workflow design

## Repository Structure
- Code.gs — Apps Script logic
- Dashboard.html — dashboard UI
- Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx — anonymized sample workbook
- extraction prompt files — workflow and normalization details
- PROJECT_AUDIT.md — project evidence summary

## Tools & Technologies
- Google Apps Script
- Google Sheets / spreadsheet workflow
- HTML dashboard
- Excel workbook data

## Project Status
Real client-style project using anonymized operational data. The repository is intentionally public-safe and does not expose identifying client or property information.
