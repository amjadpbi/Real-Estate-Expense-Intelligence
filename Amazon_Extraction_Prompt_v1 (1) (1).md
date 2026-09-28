# AMAZON ORDER/REFUND EXPORT EXTRACTION -> V3 FORMATTED CSV (v2)

## SETUP
Inputs (uploaded by the user, or placed in a working folder):
- "Amazon Order History.csv" (or .xlsx) - line-item level purchase data
- "Amazon Refund Details.csv" (or .xlsx) - refund/return data

Ask the user: what date range should be processed (From / To)? Process only Order Date (purchases) or Refund Date (refunds) within that range, per the rules below.

Output: a single CSV file with the V3 Amazon tab's 16 columns (A:P, see Column Mapping), one row per Purchase or Return, ready for the user to paste into the V3 Google Sheet's Amazon tab manually.

---

## GLOBAL RULES
- Process the files in full. Do not read partial rows.
- If Amazon Order History has an Order Status (or similar) column, skip any row with status Cancelled. No Purchase row for these.
- Every row in Amazon Order History (excluding Cancelled) = one Purchase row in V3 (one per line item).
- Every (deduplicated) row in Amazon Refund Details = one separate negative Return row in V3. Do not also create a negative adjustment on the original Purchase row, both rows exist independently (same principle used for Temu).
- Collect all rows for the date range first, then write them all to the output CSV in one pass, in date order.

---

## V3 AMAZON TAB - COLUMN MAPPING (A:P)

| Col | Header | Source / Rule |
|---|---|---|
| A | Tranaction Date | Order Date (Purchase rows) / Refund Date (Return rows), format M/D/YYYY |
| B | Order / PO # | Order ID |
| C | Item # / SKU | ASIN |
| D | Item Description | Product Name / Title |
| E | Qty | Original Quantity (Purchase). For Return, Quantity from Refund Details (negative) |
| F | Unit Price | Total Paid (col G) / Qty (col E), derived, not from export's Unit Price columns |
| G | Total Paid (Sales Tax Inc.) | Total Amount (Purchase, as exported). For Return, -Refund Amount |
| H | Transaction Type | Purchase or Return |
| I | Project | From shipping address, see Project Mapping |
| J | Payment Instrument | From "Payment Method Type" column, as shown in the export |
| K | Department | From Taxonomy, blank if Personal |
| L | Class | From Taxonomy, blank if Personal |
| M | Subclass | From Taxonomy, blank if Personal |
| N | Reconciliatoin Status | Blank unless a genuine critical issue (see Edge Cases) |
| O | Purchasing Nature / Business / Personal | "Business" or "Personal", based on product description (see below) |
| P | Paid By | Full name from Payment Mapping table, based on column J |

---

## PRICING FORMULA (line-item level)

Use "Total Amount" directly from Amazon Order History as the per-line tax-inclusive total. Do not use "Unit Price", "Unit Price Tax", "Shipment Item Subtotal", "Shipment Item Subtotal Tax", or "Total Discounts" for any calculation (Shipment Item Subtotal/Tax are shipment-level fields that repeat across line items in the same shipment and would double/triple count if summed; an earlier ~$680 discrepancy across 58 rows came from comparing those shipment-level fields against the per-line Total Amount, an apples-to-oranges comparison that does not indicate a problem with Total Amount itself).

For each Purchase row:
- Qty (col E) = Original Quantity
- Total Paid (col G) = Total Amount (as exported, already tax-inclusive)
- Unit Price (col F) = Total Paid (col G) / Qty (col E)

This keeps F x E = G exactly by construction, and uses Amazon's own final charged figure directly, the same "use the displayed final number" approach that worked for Temu and Floor & Decor.

---

## REFUND HANDLING (Return rows)

Source file: Amazon Refund Details.csv. Relevant columns: Order ID, Refund Date, Refund Amount, Quantity, Disbursement Type. Ignore the "Refine Date" column entirely, it is not used for any logic.

1. Filter to Disbursement Type = "Refund" only. Rows with Disbursement Type = "Disbursement" are internal account adjustments (not customer returns), skip these.
2. Deduplicate the remaining rows. Dedup key = Order ID + Refund Date + Refund Amount (the export has join-artifact duplicates, often the majority of rows).
3. Each remaining refund record = one Return row:
   - Tranaction Date = Refund Date
   - Order / PO # = Order ID
   - Qty (col E) = -Quantity (from Refund Details)
   - Total Paid (col G) = -Refund Amount
   - Unit Price (col F) = Refund Amount / Quantity
4. To fill in Item Description, SKU, Project, Department/Class/Subclass, Business/Personal, Payment Instrument, Paid By for the Return row, match back to the Purchase row(s) for the same Order ID:
   - If the order has only ONE line item, copy Item Description, SKU, Project, Department/Class/Subclass, Business/Personal, Payment Instrument, Paid By from that Purchase row.
   - If the order has MULTIPLE line items, there is no item-level identifier in Refund Details to match on. Record the Return row with Order/PO#, date, Qty, Unit Price, and Total Paid only, leave Item Description/SKU/Department/Class/Subclass blank, and flag in col N: "Multi-item order, refund item unclear, confirm allocation"
5. Orphan refunds: if a refund's Refund Date falls within the current processing date range but its Order Date does not (the order was placed in an earlier period already processed), still record the Return row in this run, dated by Refund Date. Do not skip it and do not re-process the original Purchase row.

---

## PROJECT MAPPING (column I)

Amazon has no PO/Job-equivalent field, so Project is derived from the shipping address on the order.

| Shipping Address | Project |
|---|---|
| Mountain Ave, Westfield NJ | Mountain |
| Franklin Pl, South Orange NJ | Franklin |
| Vose Ave, South Orange NJ | Vose |
| Fairmount Ave, Chatham or Cranford NJ | Fairmount |
| Circle View Dr or Berkeley Heights NJ | Circleview |
| Ridgewood NJ | Ridgewood |
| Joan St, Kendall Park NJ | Joan |
| Preston Ave, Cranford NJ | Preston |
| 350 W 42nd St, New York NY (or other NYC address) | NYC, and flag in col N: "NYC address, confirm project/ownership" |
| 7 Dahlia Rd, Somerset NJ | record as "Dahlia Rd" and flag in col N: "Dahlia Rd, confirm project classification" |
| Any other address | Record the raw shipping address as text, do not write "Personal" here |

---

## BUSINESS / PERSONAL (column O)

Based on product description ONLY, never on shipping address. This was a confirmed prior mistake (an earlier pass defaulted everything to Business by address, Preston in particular receives both construction supplies and personal household items like food, pet treats, kids' workbooks, personal care, so address cannot decide this).

- Construction, renovation, home improvement, tools, fixtures -> Business
- Food, household consumables, clothing, toys, personal care, electronics for personal use, gifts -> Personal

---

## PAYMENT INSTRUMENT (column J) AND PAID BY (column P)

Column J = the value from the export's "Payment Method Type" column, recorded as-is (e.g. "Visa", "MasterCard", or however it's formatted, including last 4 digits if present).

Map to column P using the table below (last-4 based, consistent with other suppliers):

| Card | Paid By |
|---|---|
| Mastercard ...2586 | Jerry Cheng |
| Mastercard ...3520 | Jerry Cheng |
| Visa ...0565 | Annie Cheng |
| Visa ...9117 | Annie Cheng |
| Visa ...9725 | Annie Cheng |
| Visa ...4086 | Annie Cheng |
| Visa ...1816 | Annie Cheng |
| Visa ...9476 | Unconfirmed (Jerry vs Annie conflict), leave P blank, flag in col N |
| Any other card | Leave P blank, flag in col N with the card's last-4 for stakeholder confirmation |

If the export's Payment Method Type does not include a last-4 (e.g. just "Visa" with no digits), leave column J as exported, leave P blank, and flag in col N: "Payment Method Type has no card detail, confirm Paid By"

---

## TAXONOMY (Department, columns K/L/M)
Personal rows: leave K, L, M blank.

Departments: Building Materials, Electrical, Hardware, Kitchen & Bath, Lumber, Millwork, Paint & Finishes, Plumbing & HVAC, Wall & Floor, Window & Wall, Garden & Seasonal.

Classify each item by reading its description and applying domain knowledge to pick the closest Department, Class, and Subclass. Flag only genuine ambiguity as an edge case.

---

## OUTPUT

Produce one CSV file named "Amazon_V3_Output_{From}_{To}.csv" containing exactly 16 columns in this order, with these headers (matching V3's Amazon tab exactly, including the existing typos):

Tranaction Date, Order / PO #, Item # / SKU, Item Description, Qty, Unit Price, Total Paid (Sales Tax Inc.), Transaction Type, Project, Payment Instrument, Department, Class, Subclass, Reconciliatoin Status, Purchasing Nature / Business / Personal, Paid By

One row per Purchase or Return as defined above, sorted by Tranaction Date. Leave cells blank (empty string) where the rules say to leave a column blank, do not write "N/A" or "0" as placeholders.

---

## EDGE CASES - Note in column N for the specific row, or report at the end

- Multi-item order with an unallocated refund (see Refund Handling step 3)
- NYC or Dahlia Rd shipping addresses (see Project Mapping)
- Card not in Payment Mapping table, or Payment Method Type missing card detail
- A product description that is ambiguous between Business and Personal (e.g. generic tools/supplies that could be for either)
- Order Status = Cancelled (skipped, no Purchase row, but worth noting in the final report if volume is unexpectedly high)
