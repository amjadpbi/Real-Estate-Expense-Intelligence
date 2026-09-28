# SCHWAB (FAIRMOUNT / ANNIE CHENG) STATEMENT PROCESSING -> V3 FORMATTED OUTPUT (v1)

## CONTEXT
This is Diane Reyes's Schwab bank account, used for the Cedarcrest property. This prompt covers standalone processing of a Schwab CSV export with no V2 cross-check. Every transaction in the export gets its own V3 row. Nothing is dropped, including transfers, interest, and autopayments.

## SETUP
Source: a Schwab CSV export with columns Date, Status, Type, CheckNumber, Description, Withdrawal, Deposit, RunningBalance. Only process rows with Status = "Posted". Ask the user what date range to process if the file spans more than one pull.

Output: V3's 16 columns (A:P), one row per statement line, ready to paste into the Cedarcrest tab (or Schwab tab) of the V3 Google Sheet.

---

## V3 COLUMN MAPPING (A:P)

| Col | Header | Source / Rule |
|---|---|---|
| A | Tranaction Date | Date, format M/D/YYYY |
| B | Order / PO # | CheckNumber if Type = CHECK. Otherwise the Type value itself as literal text (ACH, TRANSFER, DEBIT, INTADJUST, WIRE, etc.) |
| C | Item # / SKU | Always blank |
| D | Item Description | Description, unchanged |
| E | Qty | Always 1 |
| F | Unit Price | Same value as Total Paid (col G) |
| G | Total Paid (Sales Tax Inc.) | Withdrawal amount or Deposit amount, always recorded as a POSITIVE number (see Sign Convention below) |
| H | Transaction Type | "Purchase", "Deposit", or "Pass Through", see Transaction Type Rules |
| I | Project | "Cedarcrest" by default for Purchase rows classified Real Estate Related. Blank for Pass Through and Deposit rows |
| J | Payment Instrument | Always "Schwab" |
| K | Department | Per Classification below, blank for Pass Through rows |
| L | Class | Per Classification below, blank for Pass Through rows |
| M | Subclass | Always blank |
| N | Reconciliatoin Status | Blank unless a genuine issue, see Edge Cases |
| O | Purchasing Nature / Business / Personal | "Real Estate Related" for Purchase rows tied to Cedarcrest. Blank for Pass Through and Deposit rows |
| P | Paid By | Always "Diane Reyes" |

---

## SIGN CONVENTION

Positive = Purchase, negative = Return, this is the standard V3 rule. Since a bank statement's Withdrawal and Deposit are already separate columns (not signed), record Total Paid (col G) as a positive number for both Withdrawals and Deposits. Whether the row represents money leaving or entering the account is captured by column H (Transaction Type), not by the sign of column G.

---

## TRANSACTION TYPE RULES (column H)

Apply in this order:

1. **TRANSFER** (Type = TRANSFER, internal account-to-account movement, e.g. "Funds Transfer from Brokerage") -> **Pass Through**
2. **INTADJUST** (Type = INTADJUST, "Interest Paid") -> **Deposit**
3. **ACH matching a credit card issuer or "AUTOPAY"** in the Description (e.g. "JPMORGAN CHASE CHASE ACH", "CHASE CREDIT CRD AUTOPAYBUS") -> **Pass Through** (this is a card autopayment settling a balance already captured elsewhere, e.g. Mastercard tab, not a new expense)
4. **CHECK** with a CheckNumber -> **Purchase** if it represents real spend (default assumption, flag payee unknown per Edge Cases)
5. **DEBIT with a Zelle/wire to an individual person's name** -> **Purchase**, but flag for Department/Class per Edge Cases
6. **Any other Withdrawal to a recognizable vendor** -> **Purchase**
7. **Any other Deposit not covered above** (e.g. a refund, a rent deposit) -> **Deposit**

---

## PROJECT (column I)

Default every Purchase-type row classified Real Estate Related to **Cedarcrest**. Leave Project blank on Pass Through and Deposit rows, since those are not project expenses.

If a Description clearly references a different property, override the default and flag in column N for confirmation, do not silently reassign.

---

## CLASSIFICATION (columns K/L/M and column O)

### Pass Through (no Department/Class, no Project, no Business/Personal)
- Internal transfers between the client's own accounts
- Credit card autopayments (ACH to a card issuer, or "AUTOPAY" in the description)
- Bank-generated interest

### Purchase, Real Estate Related (Department/Class assigned)
Classify using the same domain-knowledge approach as the Mastercard and Checks prompts: contractor/trade names -> matching trade department (e.g. Plumbing & HVAC, Electrical, Garden & Seasonal); general contractor/builder LLCs -> Services / General Contractor; insurance company names -> Services / Insurance; municipality names -> Services / Property Tax; material suppliers -> the matching material department; engineering/legal/design firms -> Services / Engineering, Legal, or Design as applicable.

### Checks with no payee shown in the CSV
This export's CHECK rows only show "Check Paid #[number]", no payee text. Leave Department/Class blank and set Reconciliatoin Status = "Need Review - check payee not shown in CSV, confirm from check image". Do not guess a vendor from the check number alone.

### Individual person names (Zelle, wire, or check made out to a person)
Leave Department and Class blank and set Reconciliatoin Status = "Need Review - individual payee, confirm department", consistent with the Checks tab rule that individual-name payees stay a manual call for the stakeholder.

### New / unrecognized vendors
If a Description doesn't match a known payee, apply domain knowledge the same way as the Mastercard and Checks prompts. If the vendor type genuinely can't be inferred, leave Department/Class blank and set Reconciliatoin Status = "Need Review".

---

## WRITING TO THE SHEET

1. Find the first blank row in range A:P of the target tab.
2. Write each row's values cell by cell using the Name Box (cell reference box), not Tab-chaining, to avoid column drift.
3. Sort output rows oldest-date-first (ascending) before writing.
4. After writing, do a final read of the written range to confirm values landed in the correct columns.

---

## EDGE CASES - Note in column N for the specific row, or report at the end

- CHECK row with no payee shown anywhere in the export (Need Review - confirm from check image)
- Individual person name as payee, whether via Zelle, wire, or check (Need Review - confirm department)
- ACH description ambiguous between a credit card autopayment and a genuine vendor payment (Need Review - confirm which card/vendor this settles)
- A Description that doesn't match any known vendor and can't be classified by domain knowledge
- A Withdrawal or Deposit whose Type doesn't match any rule above (new Type value not yet seen, e.g. WIRE, FEE)
- A transaction that appears to belong to a property other than Cedarcrest
