# LOWES ORDER HISTORY EXTRACTION -> V3 FORMATTED CSV (v2)

## SETUP
Source: Lowes Pro order history (https://www.lowes.com/account/orders?isOrg=false), browsed live (Export Purchase History has no item-level detail, not usable).

Ask the user: what date range should be processed (From / To)? Set the "Show" filter to cover that range (Last 30 days / Last 90 days / Last 6 months / a specific year), then check each order's "Placed" date individually, only process orders within range.

Output: a single CSV file with V3's 16 columns (A:P, see Column Mapping), one row per Purchase or Return line item, ready for the user to paste into the V3 Google Sheet's Lowes tab manually.

---

## V3 LOWES TAB - COLUMN MAPPING (A:P)

| Col | Header | Source / Rule |
|---|---|---|
| A | Tranaction Date | Order "Placed" date, format M/D/YYYY |
| B | Order / PO # | Order number (the long numeric/alphanumeric ID), no # symbol |
| C | Item # / SKU | Number after "Item #" |
| D | Item Description | Product name, clean text |
| E | Qty | Original QTY for Purchase rows (see QTY Rule). For Return rows, the returned quantity, negative |
| F | Unit Price | The non-strikethrough "paid" per-unit price ("$X.XX /ea.") |
| G | Total Paid (Sales Tax Inc.) | Qty x Unit Price x 1.06625, see Pricing |
| H | Transaction Type | Purchase or Return |
| I | Project | From PO/Job Name, normalized, see Project Mapping |
| J | Payment Instrument | Shorthand format, see Payment |
| K | Department | From Category Logic |
| L | Class | From Category Logic |
| M | Subclass | From Category Logic |
| N | Reconciliatoin Status | Blank unless a genuine issue (see Edge Cases) |
| O | Purchasing Nature / Business / Personal | "Business" or "Personal", based on item description |
| P | Paid By | Full name, see Payment |

---

## PRICING

Tax rate = 6.625% fixed (verified across multiple orders: $290.00 x 1.06625 = $309.21; $265.76 x 1.06625 = $283.37, both exact).

For every line: Total Paid (col G) = Qty (col E) x Unit Price (col F) x 1.06625, rounded to 2 decimals. Negative for Return rows.

---

## QTY RULE (Original QTY / strikethrough)

Some items show "QTY [current]" alongside "Original QTY [N]" (e.g. "QTY 1 | Original QTY 10"). When Original QTY is present, use it as Qty (col E) for the Purchase row, not the current QTY.

When an item also shows two prices, one struck through (e.g. "$29.98") and one not (e.g. "$24.98"), use the NON-struck price as Unit Price (col F). The struck price is a "you saved" reference, not used in any calculation.

---

## TRANSACTION TYPES & STATUS HANDLING

PROCESS normally (Purchase row per item): order status is Delivered, Completed, Pickup Complete, or any order where a Payment Method section is shown.

SKIP entirely, no row anywhere: PO/Job Name is "Ignore"/"ignore" (personal spend). Canceled orders with $0 total. Canceled individual items within an order (no row for that item).

STANDALONE RETURN orders (status Return Received / Return Pending / Return Initiated, PO/Job Name shows "#---" or blank, no Payment Method section, no refund amount shown): produce NO row from this order directly. Instead, use it as a trigger to find the matching original purchase order, see Return Matching below. If after checking, the original order does not yet show a completed refund for this item, do not write a row, just note it for the user in the final report (a future run will pick it up once the original order updates).

---

## RETURN MATCHING (the core return mechanism)

A return shows up in TWO places that are not cross-referenced by order number:

1. A standalone order (see above) with the returned item and quantity, but no refund/payment detail and a status that may never update to "completed" on its own page.
2. The ORIGINAL purchase order's page gets updated with: a "Return Completed" banner, followed immediately by the SAME item at the RETURNED quantity (its own QTY, e.g. "QTY 9"), and the Order Summary section gains a "Refund Issued - [Card Type] [last 4]: $[amount]" line.

To produce the Return row:
1. On the standalone order, note the Item # and its quantity/amount.
2. Find the original purchase order containing that same Item #, where the item also shows the "Original QTY" / strikethrough pattern (the remaining-quantity line) AND a "Return Completed" banner with a matching item block at the returned quantity, AND a "Refund Issued" line whose dollar amount is close to the standalone order's total.
3. Write the Purchase row using the item's Original QTY and non-struck unit price (as normal), dated and numbered by the ORIGINAL purchase order (e.g. Jan 24, #200692024261412128).
4. Write a separate Return row: Tranaction Date (col A) and Order/PO# (col B) = the STANDALONE return order's date and number (e.g. Apr 9, #200692099261601437), not the original purchase order's. Qty = -(quantity shown after the "Return Completed" banner for this item), Unit Price = same as the Purchase row, Total Paid = Qty x Unit Price x 1.06625 (should be close to the "Refund Issued" amount, within ~$0.01-0.02 rounding). Payment Instrument (col J) for this row = only the card named in "Refund Issued - [Card] [last4]" (e.g. "Mastercard - 0532"), not the full payment list from the original order. Project, Department/Class/Subclass, Business/Personal, and Paid By copy from the Purchase row.

---

## PROJECT MAPPING (column I)

From "PO / Job Name" in Order Summary, normalized:

| As seen on Lowes | Normalized Project |
|---|---|
| Mountain / mountain / mountaib / 336 mountain / 336 Mountain | Mountain |
| Vose / vose | Vose |
| Franklin / franklin | Franklin |
| Fairmount / fairmount | Fairmount |
| 567 Fairmount / 567 fairmount | Fairmount |
| Berkeley Heights / berkerly heights / berkeley heights | Circleview |
| Ignore / ignore | SKIP entirely, do not record (see Status Handling) |
| Blank / "#---" | Leave Project blank, flag in col N: "No PO/Job Name set, confirm project" |
| Anything else not listed | Record as-is, flag in col N: "Unrecognized PO/Job Name, confirm project" |

---

## PAYMENT (columns J and P)

Read the "Payment Method" section of the order (for Return rows, read the "Refund Issued" line instead, see Return Matching step 4).

Format for column J:
- One card type only -> "Mastercard - [last4]" or "Visa - [last4]"
- Card + one or more gift cards -> "Mastercard - [last4], Gift Card" (collapse all gift cards into a single "Gift Card" mention, do not list individual GC numbers)
- Gift card(s) only, no Mastercard/Visa -> "Gift Card"
- Cash -> "Cash"
- MyLowe's Money -> "MyLowe's Money"

Column P (Paid By): use the name shown on the order (e.g. "Picked up by Jerry Cheng", or a name shown in the Payment Method block). If no name is shown, map the card's last-4 via the standard payment mapping (Jerry Cheng / Annie Cheng) and flag in col N if the card isn't in that mapping. If only "Gift Card" with no name anywhere, leave P blank and flag in col N: "Gift Card only, no name shown, confirm Paid By".

---

## BUSINESS / PERSONAL (column O)

Based on item description. Lowes purchases are overwhelmingly construction/renovation materials -> Business by default. Anything clearly non-construction (personal household items) -> Personal.

---

## CATEGORY LOGIC (columns K/L/M)

Use this table as a starting guide. For any product not listed, use your own knowledge to categorize intelligently based on the product name. Only flag in col N if genuinely undeterminable after applying judgment.

| Product name contains | Department | Class | Subclass |
|---|---|---|---|
| drywall panel / gypsum / LITE Regular / PURPLE XP | Building Materials | Drywall | Drywall Panels |
| joint compound / compound pail / compound bucket | Building Materials | Drywall | Joint Compound |
| joint tape / drywall tape / fibatape / mesh tape | Building Materials | Drywall | Joint Tape |
| drywall screw / bugle / CRSE DRW SCR | Building Materials | Drywall | Drywall Screws |
| corner bead | Building Materials | Drywall | Corner Bead |
| cement backer / backer board | Building Materials | Drywall | Backer Board |
| fiberglass batt / fiberglass roll / kraft faced | Building Materials | Insulation | Batt Insulation |
| polystyrene / expanded polystyrene | Building Materials | Insulation | Rigid Insulation |
| spray foam | Building Materials | Insulation | Spray Foam |
| rafter vent | Building Materials | Insulation | Accessories |
| lumber / stud / fir kiln / douglas fir / spruce pine | Lumber | Dimensional Lumber | Dimensional Lumber |
| pressure treated / ground contact | Lumber | Pressure Treated | Pressure Treated |
| osb / sheathing / particleboard / shelf board | Lumber | Sheet Goods | Sheet Goods |
| house wrap | Building Materials | Weatherization | House Wrap |
| joist hanger / post cap / post base / zmax | Building Materials | Metal Products | Connectors |
| column / hollow core column | Millwork | Architectural | Columns |
| cement / concrete block | Building Materials | Concrete | Concrete and Masonry |
| interior paint / ceiling paint / expresscoat | Paint & Finishes | Interior Paint | Interior Paint |
| exterior paint / storm coat | Paint & Finishes | Exterior Paint | Exterior Paint |
| primer / pva | Paint & Finishes | Primer | Primer |
| caulk | Paint & Finishes | Caulk and Sealant | Caulk |
| vinyl plank / lvp / flooring | Wall & Floor | Luxury Vinyl | LVP |
| construction adhesive / subfloor adhesive | Wall & Floor | Subfloor | Adhesive |
| garage door | Window & Wall | Exterior Doors | Garage Doors |
| front door / prehung | Window & Wall | Exterior Doors | Entry Doors |
| interior slab / slab door / closet door / sliding closet | Window & Wall | Interior Doors | Interior Doors |
| door track / finger pull / deadbolt / door knob | Hardware | Door Hardware | Door Hardware |
| nail / bolt / carriage bolt / nut / washer / staple / screw | Hardware | Fasteners | Fasteners |
| corner brace / bracket | Hardware | Connectors | Brackets |
| rope | Hardware | Rope and Cord | Rope |
| pendant light / light fixture | Electrical | Lighting | Lighting |
| bathroom fan / air filter | Plumbing & HVAC | HVAC | HVAC |
| snow blower | Garden & Seasonal | Outdoor Equipment | Snow Removal |
| annular cutter / drill bit | Hardware | Power Tools | Accessories |
| trash bag / pool salt | Garden & Seasonal | Supplies | Other |
| cedar / shingle siding | Building Materials | Exterior | Siding |
| delivery / delivery charge | (see Delivery rule below) | | |

---

## DELIVERY CHARGE

If an order has a delivery/shipping charge line, add it as its own row after all product rows for that order: Item#=DELIVERY, Qty=1, Total Paid = flat amount as shown (no tax multiplier), Department=Services, Class=Delivery, Subclass=Truck Delivery, Project/Payment/Paid By same as the rest of that order.

---

## EDGE CASES - Note in column N for the specific row, or report at the end

- PO/Job Name blank, "#---", or unrecognized
- Standalone return found with no matching original-order refund yet (report for next run)
- Refund Issued amount doesn't reconcile with the returned Qty x Unit Price x 1.06625 (more than ~$0.02 off)
- Payment card not in the standard Jerry/Annie mapping
- "Gift Card" only with no name shown anywhere on the order
- A product description ambiguous between Business and Personal, or that doesn't fit the Category Logic table
