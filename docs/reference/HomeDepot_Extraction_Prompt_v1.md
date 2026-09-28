# HOME DEPOT PURCHASE HISTORY EXTRACTION -> V3 FORMATTED CSV (v2)

## SETUP
Inputs:
1. "Purchase History" export from Home Depot (.xlsx/.csv), uploaded by the user or placed in a working folder. Columns expected: Date, Transaction ID, Job Name, SKU Number, SKU Description, Quantity, Unit price, Department Name, Class Name, Subclass Name, Program Discount Amount, Other Discount Amount, Extended Retail (before discount), Net Unit Price.
2. "HD_Project_Mapping.csv" - reference file with columns "Raw Job Name / Project" and "Normalized Project Name" (a copy of the Home Depot rows from V3's Project Settings PROJECTS table, where Supplier Field Name = "Job Name (Purchase History CSV)"). Used for Project Mapping below.

Ask the user: what date range should be processed (From / To)? Process only rows with Date in that range.

Output: a single CSV file with the V3 Home Depot tab's 16 columns (A:P, see Column Mapping), one row per line item, ready for the user to paste into the V3 Google Sheet's Home Depot tab manually.

This prompt covers the CSV-derived columns only. Payment Instrument (col J) and Paid By (col P) are populated by a separate process (manual entry, or a future Chrome-based step against the Home Depot website), not from this file.

---

## GLOBAL RULES
- Process the file in full. Do not read partial rows.
- Every row in Purchase History = one row in V3 (one per line item).
- Transaction Type: if Extended Retail (before discount) is negative -> Return. If positive -> Purchase. (A return is a whole transaction with negative values across its line items, same formula applies to both.)
- Collect all rows for the date range first, then write them all to the output CSV in one pass, in date order.

---

## V3 HOME DEPOT TAB - COLUMN MAPPING (A:P)

| Col | Header | Source / Rule |
|---|---|---|
| A | Tranaction Date | Date, format M/D/YYYY |
| B | Order / PO # | Transaction ID |
| C | Item # / SKU | SKU Number |
| D | Item Description | SKU Description |
| E | Qty | Quantity (negative for Return rows, matching the sign of Extended Retail) |
| F | Unit Price | Total Paid (col G) / Qty (col E), derived |
| G | Total Paid (Sales Tax Inc.) | Extended Retail (before discount) x 1.06625, see Pricing Formula |
| H | Transaction Type | Purchase or Return |
| I | Project | From Job Name, via HD_Project_Mapping.csv lookup, see Project Mapping |
| J | Payment Instrument | Leave blank (populated by separate process) |
| K | Department | Normalized from Department Name, see Taxonomy |
| L | Class | Class Name, as exported |
| M | Subclass | Subclass Name, as exported |
| N | Reconciliatoin Status | Blank unless a genuine issue (see Edge Cases) |
| O | Purchasing Nature / Business / Personal | "Business" or "Personal", based on item description |
| P | Paid By | Leave blank (populated by separate process) |

---

## PRICING FORMULA

"Extended Retail (before discount)" is, despite its name, the amount AFTER Program Discount and Other Discount are applied (verified: Extended Retail = Unit price x Quantity + Program Discount Amount + Other Discount Amount, holds exactly across all rows, both positive and negative). It does not include sales tax.

For every row:
- Total Paid (col G) = Extended Retail (before discount) x 1.06625 (6.625% NJ sales tax, same rate used for Temu/F&D/Amazon), computed as a value
- Qty (col E) = Quantity, with the same sign as Extended Retail (negative for Return rows)
- Unit Price (col F) = Total Paid (col G) / Qty (col E)

---

## TAXONOMY (columns K/L/M)

Home Depot's export already provides Department/Class/Subclass per line, use Class Name and Subclass Name as-is for columns L and M. Normalize Department Name to our standard labels for column K:

| Department Name (export) | Department (col K) |
|---|---|
| BLDG. MATERIALS | Building Materials |
| LUMBER | Lumber |
| ELECTRICAL | Electrical |
| HARDWARE | Hardware |
| KIT/BATH | Kitchen & Bath |
| PLUMBING | Plumbing & HVAC |
| PAINT | Paint & Finishes |
| WALL&FLOOR COVER. | Wall & Floor |
| MILLWORK | Millwork |
| GARDEN/SEASONAL | Garden & Seasonal |
| FEES | Services (Class = Delivery, Subclass = Truck Delivery, regardless of what's in Class Name/Subclass Name for these rows) |
| Any other / blank | Record as-is, flag in col N: "Unrecognized Department Name, confirm taxonomy" |

If Class Name or Subclass Name is blank for a row (it happens even outside FEES), leave L/M blank, no flag needed for that alone.

---

## PROJECT MAPPING (column I)

Use "HD_Project_Mapping.csv" (columns: "Raw Job Name / Project", "Normalized Project Name"). This is a lookup of Raw Job Name -> Normalized Project Name, sourced from V3's Project Settings tab.

1. Match the row's Job Name against this file (case-insensitive, trim whitespace). If matched to a real project name (Ashford, Cedarcrest, Brookline, Graystone, Dunmore, Elmsworth, Foxglove, NYC, Hawthorne, etc.) -> use that as Project.
2. If matched to "? Needs confirmation" (currently "west orange" and "orion") -> Project = the raw Job Name text, flag in col N: "Project needs stakeholder confirmation (west orange/orion)"
3. If Job Name is blank, "ONLINE ORDER", or a WJ/WK/WH-prefixed code not found in the file, or any other value not found in the file -> leave Project blank, flag in col N: "No recognizable Job Name, confirm project"

Do not reference V2 or any historical ledger for project assignment, that file is the only source.

---

## BUSINESS / PERSONAL (column O)

Based on item description. Home Depot purchases are overwhelmingly construction/renovation materials -> Business by default, but still check each description, anything clearly non-construction (e.g. personal household items, gift cards for non-business use) -> Personal. FEES (delivery charges) -> Business (they relate to delivering business materials), unless the associated transaction's items are themselves Personal.

---

## OUTPUT

Produce one CSV file named "HomeDepot_V3_Output_{From}_{To}.csv" containing exactly 16 columns in this order, with these headers (matching V3's Home Depot tab exactly, including the existing typos):

Tranaction Date, Order / PO #, Item # / SKU, Item Description, Qty, Unit Price, Total Paid (Sales Tax Inc.), Transaction Type, Project, Payment Instrument, Department, Class, Subclass, Reconciliatoin Status, Purchasing Nature / Business / Personal, Paid By

One row per line item as defined above, sorted by Tranaction Date. Leave cells blank (empty string) where the rules say to leave a column blank (including J and P for every row), do not write "N/A" or "0" as placeholders.

---

## EDGE CASES - Note in column N for the specific row, or report at the end

- No recognizable Job Name (blank, ONLINE ORDER, WJ/WK/WH-prefixed code, or anything not in HD_Project_Mapping.csv)
- Job Name maps to "? Needs confirmation" (west orange, orion)
- Unrecognized Department Name not in the normalization table
- A return (negative Extended Retail) whose Job Name doesn't match any project, same flagging as purchases
- Any item description that is ambiguous between Business and Personal
