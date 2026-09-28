# Mastercard Tab Processing — Prompt

## Task
A Mastercard statement export will be shared as a CSV (columns: Status, Date, Description, Debit, Credit), containing only transactions since the last pull, all "Cleared". Process every row into the V3 Mastercard tab row format below, do not skip any row. All output is reviewed by the stakeholder before being pasted into the sheet, so classify confidently even when uncertain. If genuinely uncertain about a row's classification, still fill in your best-guess Category/Vendor (don't leave it blank), but set Reconciliatoin Status = "Need Review" so the stakeholder knows to double-check that one.

## Output: 17 columns, in this exact order

1. **Tranaction Date** — from source Date
2. **Order / PO #** — always blank
3. **Item # / SKU** — always blank
4. **Item Description** — raw source Description, unchanged (keep any embedded card suffix)
5. **Qty** — always 1
6. **Unit Price** — Total (see field 7)
7. **Total Paid\nSales Tax Inc.** — Debit value if present, else Credit value, keep sign as-is
8. **Transaction Type** — "Purchase" if Total > 0, "Return" if Total < 0
9. **Project** — always blank (manual fill by stakeholder)
10. **Payment Instrument** (column J) — if Description contains a card suffix in the form `XXXXXXXXXXXX####`, write `MasterCard - ####`; otherwise blank
11. **Department** — blank, except for Real Estate Related rows, see Department/Class mapping in the Real Estate Related table below
12. **Class** — blank, except for Real Estate Related rows, see Department/Class mapping in the Real Estate Related table below
13. **Subclass** — blank
14. **Reconciliatoin Status** — blank, unless you're genuinely uncertain about this row's Category/Vendor classification, in which case write `Need Review`
15. **Paid By** (column O) — `Marcus Reyes` if Category is "Jerry Personal Business" or "Jerry Personal T&E", otherwise blank
16. **Category** — see classification below (extra column, for reconciliation only)
17. **Vendor** — see classification below (extra column, for reconciliation only)

Sort the output rows oldest-date-first (ascending) before returning, ready to append to the bottom of the existing V3 Mastercard tab.

## Classification: 8 categories

### Supplier categories (Vendor stays blank, Project stays blank)
Match on Description:
- contains "THE HOME DEPOT" → Category = **Home Depot**
- contains "TEMU.COM" → Category = **Temu**
- contains "AMZN Mktp" or "AMAZON MARK" → Category = **Amazon**
- contains "FLOOR AND DECOR" → Category = **Floor & Decor**
- contains "LOWES" → Category = **Lowes**

These are already itemized in their own V3 tabs. The row here exists only to record the Mastercard charge and, if a card suffix is present, the payment instrument.

### Jerry Personal Business
| Description pattern | Vendor |
|---|---|
| starts with "NJ " and contains "PROF LICENSE FEE" | NJ Prof License Fee |
| starts with "NJ " and ends "HAMILTON NJ" and contains "TOW" | NJ Towing |
| starts with "NJ " and ends "HAMILTON NJ" (generic) | NJ Municipal Fee |
| contains "BJS FUEL" | BJ's Fuel |
| contains "PROPELLER SURETY BONDS" | Propeller Surety Bonds |
| contains "TMOBILE" | T-Mobile |
| contains "SUNOCO" | Sunoco |
| contains "SUPRA RE" | Supra RE (Lockbox) |
| contains "COSTCO" | Costco |
| contains "OMNYWEB" or "MTA*" | MTA / Transit |
| contains "USPS" | USPS |
| contains "AMOCO" | Amoco |
| contains "HRB ONLINE TAX" | H&R Block Tax |
| contains "MEMBERSHIP FEE" | Membership Fee |
| contains "ONLINE PAYMENT" | Credit Card Payment |
| contains "INTEREST CHARGED" | Credit Card Interest |
| contains "THANKYOU POINTS REDEEMED" | Points Redeemed |
| contains "STAPLES" | Staples (Office Supplies) |
| contains "DELTA " | Delta (Fuel) |
| contains "FUEL 4" | Fuel 4 |
| contains "WAWA" | Wawa (Fuel) |

### Jerry Personal T&E
| Description pattern | Vendor |
|---|---|
| contains "99 RANCH" | 99 Ranch Market |
| contains "ALDI" | Aldi |
| contains "FOOD EMPORIUM" | Food Emporium |
| contains "TARGET" | Target |
| contains "KAM MAN FOOD" | Kam Man Food |
| contains "LOTTE PLAZA" | Lotte Plaza Market |
| contains "HOTEL PARK AVENUE" | Hotel Park Avenue |
| contains "DUBUHAUS" | DuBuhaus |
| contains "BIG APPLE MEAT MARKET" | Big Apple Meat Market |
| contains "ASIAN FOOD MARKETS" | Asian Food Markets |
| contains "WAL-MART" or "WALMART" | Walmart |
| contains "PINCH CHINESE" | Pinch Chinese |
| contains "SWEET REHAB" | Sweet Rehab |
| contains "BLUE JAVA CAFE" | Blue Java Cafe |
| contains "INKD" or "MOONO" | Moono Tattoo |
| contains "DANNYS SOFT SERVE" | Danny's Soft Serve |
| contains "KPOT" | KPOT Korean BBQ |
| contains "RETURN CHECK FEE" | Return Check Fee |
| contains "GREEN LAKE RESTANU" | Green Lake Restaurant |
| contains "TOUS LES JOURS" | Tous Les Jours |
| contains "REICHENBACH HALL" | Reichenbach Hall |
| contains "DOLLAR GENERAL" | Dollar General |
| contains "HONG KONG SUPERMARKET" | Hong Kong Supermarket |
| contains "HOKKAIDO BAKED CHE" | Hokkaido Baked Cheese Tart |
| contains "TAMAYURA" | Tamayura |
| contains "MENG GAO YANG BBQ" | Meng Gao Yang BBQ |
| contains "EBAY" | eBay |
| contains "STOP & SHOP" | Stop & Shop |
| contains "CVS/PHARMACY" | CVS Pharmacy |
| contains "LUPA RISTORANTE" | Lupa Ristorante |

### Real Estate Related (Project always left blank)
| Description pattern | Vendor | Department | Class |
|---|---|---|---|
| contains "PAYPAL *UPWORK" | Upwork (Freelance Labor) | Services | Labour |
| contains "TUFF HOME INSPECTIONS" | Tuff Home Inspections | Services | Inspection |
| contains "ONYX STONE" | Onyx Stone & Cabinet | Kitchen & Bath | Countertops |
| contains "LIFE ART CABINETRY" | Life Art Cabinetry | Kitchen & Bath | Cabinets |
| contains "MORGAN ENGINEERING" | Morgan Engineering | Services | Engineering |
| contains "PC RICHARD" | PC Richard & Son | *(blank — Need Review)* | *(blank — Need Review)* |
| contains "JPR WOOD CONSULTIN" | JPR Wood Consulting | Services | Consulting |
| contains "CONTINENTAL TRADING" | Continental Trading & Hardware | Hardware | *(blank)* |
| contains "JOHN TO GO" | John To Go (Port-a-Potty) | Services | Equipment Rental |
| contains "ABC SUPPLY" | ABC Supply | Building Materials | *(blank)* |
| contains "LS VAG EQUIPMENT" | LS VAG Equipment | Services | Equipment Rental |
| contains "SPIOTTI" | Spiotti Law | Services | Legal |
| contains "GORKIN GLASS" | Gorkin Glass | Window & Wall | Glass & Mirrors |
| contains "SAFECO" | Safeco Insurance | Services | Insurance |
| contains "IWS" or "ACTION IWS" | IWS / Action (Waste Removal) | Services | Waste Removal |
| contains "ASTRO RENTS" | Astro Rents (Equipment) | Services | Equipment Rental |
| contains "THE YARD" | The Yard (Topsoil/Mulch) | Garden & Seasonal | Landscaping Materials |
| contains "AMERITICO" | Ameritico Disposal | Services | Waste Removal |
| contains "EBERT APPRAISAL" | Ebert Appraisal | Services | Appraisal |
| contains "JH FERG" | JH Ferg (Vacant Prop Ins) | Services | Insurance |
| contains "GBLI" | GBLI Insurance | Services | Insurance |
| contains "RC BURDICK" | RC Burdick & Assoc | Services | Engineering |
| contains "WELDON MATERIALS" | Weldon Materials | Building Materials | Concrete & Aggregate |
| contains "TC BLUEPRINTS" | TC Blueprints | Services | Design / Blueprints |
| contains "US LIABILITYINSURANCE" | US Liability Insurance | Services | Insurance |
| contains "U-HAULDDAR" | U-Haul (Equipment Rental) | Services | Equipment Rental |
| contains "NY NJ CLASSIFIED ADS" | NY NJ Classified Ads | Services | Advertising |

For PC Richard & Son, leave Department/Class blank and set Reconciliatoin Status = `Need Review` (electronics/appliance retailer, can't tell which department without item detail).

### New / unrecognized vendors
If a Description doesn't match the supplier categories or any row above, classify using domain knowledge:
- Fuel stations, convenience stores, groceries, restaurants, cafes, personal retail/online shopping → **Jerry Personal T&E**
- Fees, licenses, subscriptions, insurance/tax/account-level personal items, fuel-card-style charges → **Jerry Personal Business**
- Contractors, building material suppliers, equipment rental, professional/legal/engineering services, property insurance, waste/disposal, advertising for the properties → **Real Estate Related** (Project left blank)

Pick a clear, human-readable Vendor name from the merchant name in the Description. If you're not confident the Category/Vendor pick is right, still fill it in but set Reconciliatoin Status = `Need Review`.

For a new Real Estate Related vendor, also attempt Department/Class the same way (vendor type tells you Services vs a specific material department, e.g. a new equipment rental company → Services/Equipment Rental, a new tile/stone supplier → Kitchen & Bath or Wall & Floor). If the vendor's department genuinely can't be inferred from its name (like PC Richard & Son), leave Department/Class blank and set Reconciliatoin Status = `Need Review`.
