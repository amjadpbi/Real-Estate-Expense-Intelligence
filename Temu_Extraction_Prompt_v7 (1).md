TEMU ORDER EXTRACTION & V3 GOOGLE SHEET UPDATE (v7 - Production)
SETUP

Ask the user: what date range should be processed (From / To)? Work only on Temu orders within that date range, on the "All orders" page.

GLOBAL RULES
Read all data as text directly from the page. Do not take screenshots for data extraction.
Open each order's "View order details" to read item-level price and quantity. Do not rely on the All Orders list summary figures (struck-through "list price" vs final price shown there is not the number we need).
Collect ALL rows for the date range first. Write to the Google Sheet only once, at the end, in one pass.
Item # / SKU does not exist on Temu. Column C is always left blank.
V3 TEMU TAB - COLUMN MAPPING (A:P, exact headers as they appear in the sheet)
Col	Header	Source / Rule
A	Tranaction Date	Order Time (purchases) / "Requested on" date (returns), format M/D/YYYY
B	Order / PO #	Order ID exactly as shown on the order's detail page (e.g. PO-211-XXXXXXXXXXXXXXXXX)
C	Item # / SKU	Always blank (not available on Temu)
D	Item Description	Full product name from the order detail page
E	Qty	The number shown as "xN" next to the item. Never use a quantity mentioned inside the product name (e.g. "6-pack", "Set of 4")
F	Unit Price	See Pricing Formula below
G	Total Paid (Sales Tax Inc.)	See Pricing Formula below
H	Transaction Type	Purchase or Return
I	Project	From shipping address, see Project Mapping
J	Payment Instrument	"CardType ...last4" exactly as shown, e.g. "Mastercard ...3520"
K	Department	From Taxonomy, blank if Personal
L	Class	From Taxonomy, blank if Personal
M	Subclass	From Taxonomy, blank if Personal
N	Reconciliatoin Status	Blank unless a genuine critical issue (see Edge Cases)
O	Purchasing Nature / Business / Personal	"Business" or "Personal", based on product description only
P	Paid By	Full name ("Jerry Cheng" / "Annie Cheng") from Paid By Mapping. Blank if card not mapped
PRICING FORMULA (validated against real orders)

On the order detail page, each item shows its own price and "xQty" (e.g. "$18.94 x2").

Total Paid (col G) = item price x Qty x 1.06625 (NJ sales tax, 6.625%)
Unit Price (col F) = item price x 1.06625

Round to 2 decimals. This formula held exactly across both single-item and multi-item sub-orders tested (e.g. $18.14x1x1.06625=$19.34, $150.15x1x1.06625=$160.10).

Do not use the "Item total" vs final-price figures shown on the All Orders LIST view, those are a different (marketing/reference) comparison and do not feed this formula.

ORDER STATUS RULES

Canceled (status = "Canceled", "Order total: $0.00", "You were not charged") -> Skip entirely. No rows.

Delivered / Shipped, no refund -> One Purchase row per item.

Refunded (status = "Refunded", with a refund details block showing "Requested on [date]", refund amount, and card) -> Record BOTH:

Purchase row(s) for the item(s), using the Pricing Formula on the original price/qty
Return row using the refund amount, with Transaction Date = "Requested on" date, Qty and Total Paid negative, Transaction Type = Return, Order/PO# = same order's ID, and Project/Payment Instrument/Department/Class/Subclass/Business-Personal/Paid By copied from the matching Purchase row

Processing / not yet Delivered or Canceled -> Skip for this run. Will be picked up in a future pull once it reaches a final status.

Returns tab cross-check (after main extraction, open the Returns tab for the date range)

Entries with status "Refunded" should already be covered by the rule above, no extra action.
Entries with status "Return canceled" -> no action. The item stays as a normal Purchase, no Return row.
MASTER ORDERS

Multiple sub-orders can be placed together under one payment (shown as "This order was placed with N other order(s)..." on the detail page). Each sub-order already appears as its OWN entry in the All Orders list with its own status, item(s), Order ID, and detail page. Process each sub-order entry independently as described above. No pro-rata or parent-total math is needed, the Pricing Formula above is applied per item directly.

PROJECT MAPPING

Derived from the shipping address on the order detail page.

Shipping Address	Project
Mountain Ave, Westfield NJ	Mountain
Franklin Pl, South Orange NJ	Franklin
Vose Ave, South Orange NJ	Vose
Fairmount Ave, Chatham or Cranford NJ	Fairmount
Circle View Dr or Berkeley Heights NJ	Circleview
Ridgewood NJ	Ridgewood
Joan St, Kendall Park NJ	Joan
Preston Ave, Cranford NJ	Preston
New York NY	NYC
Any other address	Record the raw shipping address as text (do not write "Personal" here)
BUSINESS / PERSONAL (column O)

Based on product description only. Address is not a factor (Preston in particular receives both business supplies and personal items).

Construction, renovation, home improvement product -> Business
Clothing, food, toys, personal care, hobby/gift items, accessories -> Personal
PAID BY MAPPING (column P)

Match the card last-4 shown as Payment Instrument (col J) against this list. Value written to col P is the full name.

Card	Paid By
Mastercard ...2586	Jerry Cheng
Mastercard ...3520	Jerry Cheng
Mastercard ...2897	Annie Cheng
Visa ...0565	Annie Cheng
Visa ...0714	Annie Cheng
Visa ...9117	Annie Cheng
Visa ...9725	Annie Cheng
Mastercard ...3842	Unconfirmed - leave P blank
Mastercard ...9781	Unconfirmed - leave P blank
Any other card	Leave P blank, flag in column N with the card's last-4 for stakeholder confirmation
TAXONOMY (Department, columns K/L/M)

Personal rows: leave K, L, M blank.

Departments: Building Materials, Electrical, Hardware, Kitchen & Bath, Lumber, Millwork, Paint & Finishes, Plumbing & HVAC, Wall & Floor, Window & Wall, Garden & Seasonal.

Classify each item by reading its description and applying domain knowledge to pick the closest Department, then a reasonable Class and Subclass. Flag only genuine ambiguity as an edge case, do not guess wildly or leave blank for business items.

WRITING TO THE SHEET
Navigate directly to: https://docs.google.com/spreadsheets/d/14yTUR4PAUZgM-l3YZ2Zl22yCLI1n4AYJqZjQGR0vYTg/edit?gid=805750315#gid=805750315 (V3 Google Sheet, Temu tab). Do not ask the user to open it, this link opens it directly.
Find the first blank row in range A:P (select cell A3, press Ctrl+Down to jump to the last filled row, the next row is the first blank row).
Write each row's values cell by cell using the Name Box (cell reference box), not Tab-chaining:
Click the Name Box, type the cell reference (e.g. "A206"), press Enter
Type the value
Press Delete (clears any autocomplete suggestion), then press Enter
Skip columns that should remain blank entirely (do not type/clear/enter for them)
Tab-chaining across long item descriptions (especially ones containing "&" or parentheses) has been observed to cause a one-column drift partway through the row. Cell-by-cell via the Name Box avoids this.
After writing all rows, do a final screenshot/read of the written range to confirm values landed in the correct columns before ending the session.
EDGE CASES - Note in column N for the specific row, or report at the end
Card not in Paid By Mapping (col N: "Card [last4] not in Paid By mapping, confirm owner")
Shipping address not matched to any known project (raw address recorded in col I, flag for review)
Tax computed via formula differs from a directly-stated order total by more than $0.02
Refund with no corresponding "Requested on" detail visible
Sub-order shown as part of a master order where the per-item price/qty cannot be read