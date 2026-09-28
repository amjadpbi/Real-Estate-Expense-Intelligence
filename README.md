# Real Estate Expense Intelligence

> **Public anonymization notice:** This repository is a public-safe demonstration of a real client engagement. All names, company identifiers, property/project names, addresses, payment-owner references, and other identifying details in the repository have been anonymized or replaced. The data shown here is synthetic/anonymized and does not represent real client data.

> **Project type:** Real client engagement · Multi-source data consolidation · Expense automation · Data quality engineering

## Project Overview

This project was not simply a Google Sheet or an HTML dashboard.

It was an end-to-end **multi-source expense consolidation and reporting workflow** built for a real-estate investment operation. The core challenge was bringing together inconsistent transaction data from multiple suppliers, e-commerce sources, card statements, checks, and bank activity; standardizing it into a common structure; applying project, payment-owner, business/personal, and category classification; and then making the resulting data usable for operational review.

The implementation combines:

**Source extraction → normalization → data quality rules → unified transaction layer → reconciliation → aggregation → operational dashboard**

Google Sheets provided the operational data layer, Google Apps Script handled transformation and reporting logic, and an HTML dashboard exposed the resulting information for review.

## Why This Project Is More Than a Dashboard

The difficult part was not building a dashboard.

The difficult part was **making fundamentally different source datasets behave like one reporting system**.

Different sources represented the same business concepts in different ways:

- Home Depot used job/project references and item-level purchase data.
- Amazon required order and refund handling, with project assignment based on shipping information.
- Temu used order-level purchase information and payment details.
- Lowes required purchase/return handling and PO/job mapping.
- Floor & Decor required order, project, payment, tax, and classification processing.
- Mastercard provided statement-style transactions.
- Checks represented direct disbursements requiring classification.
- Schwab-style bank transactions represented another transaction source requiring project-specific processing.

Each source had its own structure, naming conventions, missing values, return behavior, payment representation, and classification challenges.

The core work was therefore much broader than dashboard creation: **source handling, normalization, classification, reconciliation, automation, and operational reporting**.

## Business Problem

The operation needed a consistent way to answer questions such as:

- How much was spent on each property/project?
- Which suppliers contributed to project spend?
- Who paid for each transaction?
- Which expenses were business versus personal?
- Which transactions were missing project or payment information?
- Which records required reconciliation or manual review?
- How did spending break down by department, class, and subclass?

The source data did not arrive in one clean dataset. It had to be extracted, interpreted, standardized, reconciled, and consolidated.

## Solution Architecture

```
Multiple Operational Sources
        ↓
Source-Specific Extraction Rules
        ↓
Normalization to Common V3 Structure
        ↓
Project / Supplier / Payment Mapping
        ↓
Business vs Personal Classification
        ↓
Reconciliation & Data-Quality Checks
        ↓
Unified Transaction Data Layer
        ↓
Summary & Payment Aggregations
        ↓
Google Apps Script Reporting Logic
        ↓
HTML Operational Dashboard
```

The important design principle was to **normalize first and report second**.

Rather than building separate reporting logic for every supplier, source-specific data was transformed toward a common transaction structure so that downstream analysis could operate consistently.

## Data Processing & Transformation

The workflow standardized transaction records around fields such as:

- Transaction Date
- Order / PO #
- Item / SKU
- Item Description
- Quantity
- Unit Price
- Total Paid
- Transaction Type
- Project
- Payment Instrument
- Department
- Class
- Subclass
- Reconciliation Status
- Purchasing Nature — Business / Personal
- Paid By

Transformation and quality rules handled issues including:

- inconsistent project names and job references
- different supplier naming conventions
- missing project assignments
- missing payment-owner mappings
- business versus personal purchases
- different tax and price representations
- purchase and return matching
- unresolved transactions
- supplier-specific extraction differences

The system deliberately surfaced ambiguous records instead of silently forcing them into a category.

## Source-Specific Processing

The repository contains dedicated extraction and processing prompts for the major source workflows.

Examples include:

- Home Depot
- Amazon
- Temu
- Lowes
- Floor & Decor
- Mastercard
- Checks
- Schwab-style bank transactions

These prompts encode source-specific extraction rules, project mapping, payment mapping, classification logic, tax handling, and edge cases.

This is an important part of the project: the extraction layer was not treated as generic copy/paste work. Each source required its own interpretation before the data could enter the common reporting structure.

## Unified Data Layer

The Google Sheets workbook acts as the operational data layer.

It contains separate source tabs and downstream summary structures, including:

- supplier transaction tabs
- Summary
- Payment Summary
- Project Settings
- Points to be fixed

The Apps Script layer then reads the source tabs and produces standardized reporting structures.

Key logic includes:

- project normalization
- personal/business classification
- supplier aggregation
- date filtering
- payment-owner aggregation
- project breakdowns
- audit checks
- unresolved-item identification

This is why the project is better understood as a **small operational data pipeline with a reporting layer**, rather than simply a spreadsheet dashboard.

## Automation Layer

Google Apps Script provides the processing and reporting logic.

The implementation includes functions for:

- reading and standardizing source rows
- normalizing project names
- identifying personal transactions
- grouping supplier spend
- calculating dashboard KPIs
- generating project-level breakdowns
- reading summary information
- serving data to the dashboard

The workflow is **semi-automated**. Automated processing handles standardization, aggregation, and reporting, while source extraction and ambiguous transactions can still require human review.

No claim is made here that the system was fully scheduled or completely zero-touch.

## Operational Dashboard

The HTML dashboard turns the consolidated data into an operational review interface.

It includes views for:

- executive summary
- project breakdown
- supplier spending
- owner/project spending
- personal spending
- untagged transactions
- date filtering
- project filtering
- KPI and summary panels

The dashboard is therefore the final layer of the pipeline, not the project itself.

## Data Quality & Reconciliation

Data quality was a core part of the implementation.

The workflow tracks conditions such as:

- missing project
- missing purchasing nature
- missing payment owner
- unresolved payment mapping
- reconciliation status
- ambiguous source records

A dedicated **Points to be fixed** area provides a review boundary for records that still require human attention.

This is important because the goal was not simply to produce numbers. The goal was to produce numbers that could be **traced, reviewed, and corrected**.

## What This Project Demonstrates

This project demonstrates practical experience with:

- multi-source data ingestion
- source-specific extraction logic
- data normalization
- schema standardization
- data quality and reconciliation
- entity/project mapping
- payment attribution
- business/personal classification
- reconciliation workflows
- aggregation and reporting logic
- Google Apps Script automation
- operational dashboard development
- AI-assisted extraction and transformation workflows

It shows the transition from **messy operational data → structured reporting data → decision-ready information**.

## Evidence / Scope

The repository contains:

- Google Apps Script implementation
- HTML dashboard
- anonymized workbook
- supplier-specific extraction/processing prompts
- project audit documentation

The strongest implementation evidence is the combination of the workbook structure, Apps Script functions, dashboard logic, and source-specific processing instructions.

## Important Boundaries

This repository is intentionally public-safe.

It does **not** expose:

- original client identity
- original property names
- original addresses
- original payment-owner identities
- private client credentials or URLs

The repository should also not be interpreted as:

- a Power BI project
- an enterprise data warehouse
- a fully scheduled zero-touch production platform
- an entirely AI-generated system
- a project with quantified ROI or time savings that are not explicitly documented

## Repository Structure

- `Code.gs` — Google Apps Script processing and reporting logic
- `Dashboard.html` — operational dashboard UI
- `Real_Estate_Expense_ANONYMIZED_SAMPLE.xlsx` — public-safe anonymized workbook
- `docs/reference/` — source-specific extraction and processing prompts
- `docs/PROJECT_AUDIT.md` — detailed evidence and implementation audit

## Tools & Technologies

- Google Apps Script
- Google Sheets
- HTML / CSS / JavaScript
- Excel / CSV data
- Source-specific extraction workflows
- Data normalization and classification logic
- Reconciliation and data-quality checks

## Project Status

Real client engagement represented with anonymized/public-safe data.

The repository is intended to demonstrate the **data engineering, automation, normalization, reconciliation, and reporting work behind the solution**, rather than only the final dashboard.
