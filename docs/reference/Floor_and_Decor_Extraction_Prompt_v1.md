# FLOOR & DECOR ORDER EXTRACTION & V3 GOOGLE SHEET UPDATE (v1)

## SETUP
Ask the user: what date range should be processed (From / To)?
Go to https://www.flooranddecor.com/order-history#/orders and work only on orders within that date range. Only process orders with Status = "Completed". Skip any other status for now, it will be picked up in a future pull.

---

## GLOBAL RULES
- Read all data as text directly from the order detail page. Do not take screenshots for data extraction.
- Each order entry in the list (whether a Purchase or a Return) is self-contained, it has its own date, its own Store Order #, its own item(s), and its own PO/Job field. No cross-referencing between orders is needed.
- Collect ALL rows for the date range first. Write to the Google Sheet only once, at the end, in one pass.
- Item # / SKU IS available on Floor & Decor (unlike Temu). Always record it.

---

## V3 FLOOR AND DECOR TAB - COLUMN MAPPING (A:P)

| Col | Header | Source / Rule |
|---|---|---|
| A | Tranaction Date | "Order Placed" date on the order detail page, format M/D/YYYY |
| B | Order / PO # | Store Order # (e.g. 1029509610192049) |
| C | Item # / SKU | SKU shown under each item |
| D | Item Description | Item name as shown (e.g. "POR SATIN WHITE MATTE 2IN HEX") |
| E | Qty | The "Ordered" (or "Returned" for return orders) quantity, in pieces |
| F | Unit Price | The "$X.XX / piece" value shown for that item, x 1.06625 (see Pricing Formula). Exception: CHARITY CHECKOUT, see below |
| G | Total Paid (Sales Tax Inc.) | Unit price (before tax) x Qty x 1.06625. Exception: CHARITY CHECKOUT, see below |
| H | Transaction Type | Purchase or Return |
| I | Project | Parsed from PO/Job field, see Project Mapping |
| J | Payment Instrument | "CardType ...last4" read from the order's receipt, see Payment Step below |
| K | Department | From Taxonomy, blank if Personal |
| L | Class | From Taxonomy, blank if Personal |
| M | Subclass | From Taxonomy, blank if Personal |
| N | Reconciliatoin Status | Blank unless a genuine critical issue (see Edge Cases) |
| O | Purchasing Nature / Business / Personal | "Business" or "Personal" |
| P | Paid By | Full name from Payment Mapping table, based on card from receipt |

---

## PRICING FORMULA (validated against real orders)

For each line item: Total Paid = (price per piece) x Qty x 1.06625 (NJ sales tax, 6.625%)
Unit Price (col F) = price per piece x 1.06625

Verified: 40 x $2.89 x 1.06625 = $123.26 (exact). 70 x $3.09 x 1.06625 + other lines also reconciled to the order total.

### Exception: CHARITY CHECKOUT line item
A line item named "CHARITY CHECKOUT" (SKU 101019024 in samples seen, typically ~$0.94-$1.00, qty 1) is NOT taxed. For this line only:
- Unit Price (col F) = price per piece as shown, no tax multiplier
- Total Paid (col G) = same value (qty is always 1)
- Department/Class/Subclass = blank
- Business/Personal (col O) = Personal

(Confirmed: order subtotal $305.80 included a $0.94 charity line, but tax of $20.20 = 6.625% of $304.86, i.e. subtotal minus the charity line.)

---

## ORDER TYPES

### Purchase
Section header on the order detail page = "ITEMS TO BE PICKED UP" (or similar, for non-pickup orders it may read differently, e.g. shipped). Qty = "Ordered" value. One Purchase row per item line.

### Return
Section header = "ITEMS RETURNED". Qty = "Returned" value, recorded as a NEGATIVE number. Price per piece is shown as negative (e.g. "$-3.09 / piece"). Transaction Type = Return. This is its own self-contained order entry (own date, own Store Order #, own PO/Job), do not look up the original purchase order.

---

## PROJECT MAPPING (from PO/Job field)

The PO/Job field on the order detail page (right sidebar, under "PO/Job:") is free text entered by the purchaser. It may be blank.

1. If PO/Job is blank -> leave Project (col I) blank and flag in col N: "No PO/Job set, confirm project"
2. If PO/Job contains one of the known project names below (case-insensitive, as a whole word) -> Project = that name
3. If PO/Job has text but matches none of the known names -> record the PO/Job text as-is in Project, and flag in col N for review

Known project names: Mountain, Vose, Franklin, Fairmount, Circleview, Ridgewood, Joan, Preston, NYC

Examples seen: "336 Mountain" -> Mountain. "Mountain" -> Mountain.

---

## BUSINESS / PERSONAL (column O)
- CHARITY CHECKOUT -> Personal (always, per rule above)
- All flooring/building materials -> Business
- Any clearly non-construction product -> Personal (based on description, same rule as other suppliers)

---

## PAYMENT STEP - STANDARD FOR EVERY ORDER

After reading the item details and PO/Job for an order, click "Download Receipt" (in the Order Information panel, below ORDER TOTAL). This opens the receipt PDF directly, no searching required.

On the receipt, find the "Payment Info" section. It shows the card type and a masked number ending in the last 4 digits, e.g.:
"MasterCard 542418******3520, Auth #: 86344P, $326.00"

Record the card as "CardType ...last4" (e.g. "Mastercard ...3520") for column J.

Then map to column P using the table below. Close the receipt tab/PDF after reading before moving to the next order.

### Payment Mapping (column P)

| Card | Paid By |
|---|---|
| Mastercard ...3520 | Jerry Cheng |
| Any other card | Leave P blank, flag in column N with the card's last-4 for stakeholder confirmation |

---

## TAXONOMY (Department, columns K/L/M)
Personal rows: leave K, L, M blank.

Departments: Building Materials, Electrical, Hardware, Kitchen & Bath, Lumber, Millwork, Paint & Finishes, Plumbing & HVAC, Wall & Floor, Window & Wall, Garden & Seasonal.

Most Floor & Decor items will fall under Wall & Floor (tile, hardwood, laminate, grout, underlayment, etc.). Classify each item by reading its description and applying domain knowledge to pick the closest Department, Class, and Subclass. Flag only genuine ambiguity as an edge case.

---

## WRITING TO THE SHEET

1. Navigate directly to: https://docs.google.com/spreadsheets/d/14yTUR4PAUZgM-l3YZ2Zl22yCLI1n4AYJqZjQGR0vYTg/edit#gid=0 (V3 Google Sheet), then click the "Floor and Decor" sheet tab at the bottom. Do not ask the user to open the sheet, this link opens it directly.
2. Find the first blank row in range A:P (select cell A3, press Ctrl+Down to jump to the last filled row, the next row is the first blank row).
3. Write each row's values cell by cell using the Name Box (cell reference box), not Tab-chaining:
   - Click the Name Box, type the cell reference (e.g. "A84"), press Enter
   - Type the value
   - Press Delete (clears any autocomplete suggestion), then press Enter
   - Skip columns that should remain blank entirely
4. After writing all rows, do a final screenshot/read of the written range to confirm values landed in the correct columns before ending the session.

---

## EDGE CASES - Note in column N for the specific row, or report at the end

- PO/Job blank or unrecognized (see Project Mapping)
- A line item that is neither a recognizable flooring/building product nor "CHARITY CHECKOUT" (unclear classification)
- Tax computed via formula differs from the order's stated Tax by more than $0.02 (after excluding any CHARITY CHECKOUT line)
- Order status is not "Completed" (skipped, but worth noting if it's sat in a non-terminal status a long time)
- Card on receipt not in Payment Mapping table (col N: "Card [last4] not in Paid By mapping, confirm owner")
