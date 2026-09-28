// ═══════════════════════════════════════════════════════════════════════════════
// Meridian Dashboard + Summary Builder - Code.gs (final)
// ═══════════════════════════════════════════════════════════════════════════════

var PROJECTS  = ['Ashford','Brookline','Cedarcrest','Elmsworth','Graystone','Hawthorne'];
var SUPPLIERS = ['Home Depot','Temu','Amazon','Lowes','Floor and Decor','Mastercard','Checks'];

var COL = {
  date:1, orderPO:2, desc:4, amount:7, type:8, project:9,
  paymentInstrument:10, department:11, classCol:12, subclass:13, nature:15, paidBy:16
};

// ── MENUS ──────────────────────────────────────────────────────────────────────
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Meridian Tools')
    .addItem('Build All Summaries', 'buildAllSummaries')
    .addToUi();
  ui.createMenu('Dashboard')
    .addItem('Open', 'openDashboard')
    .addToUi();
}

function openDashboard() {
  var html = HtmlService.createHtmlOutputFromFile('Dashboard')
    .setWidth(1600).setHeight(920);
  SpreadsheetApp.getUi().showModelessDialog(html, 'Meridian Dashboard');
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function getProjectList() { return PROJECTS; }

function normalizeProject(raw) {
  if (!raw) return '';
  var t = raw.toString().trim();
  var l = t.toLowerCase();
  for (var i = 0; i < PROJECTS.length; i++) {
    if (PROJECTS[i].toLowerCase() === l) return PROJECTS[i];
  }
  return t;
}

function isPersonal(row) { return /personal/i.test(row.nature); }

function groupBySupplier(rows) {
  var out = {};
  rows.forEach(function(r) { out[r.supplier] = (out[r.supplier] || 0) + r.amount; });
  return out;
}

// ── DATA READING ───────────────────────────────────────────────────────────────
function readAllRows(fromDate, toDate) {
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var from = fromDate ? new Date(fromDate) : null;
  var to   = toDate   ? new Date(toDate)   : null;
  var rows = [];

  SUPPLIERS.forEach(function(supplier) {
    var sheet = ss.getSheetByName(supplier);
    if (!sheet) return;
    var lastRow = sheet.getLastRow();
    if (lastRow < 3) return;
    var data = sheet.getRange(3, 1, lastRow - 2, 16).getValues();
    data.forEach(function(r) {
      var amount = r[COL.amount - 1];
      var date   = r[COL.date   - 1];
      if (amount === '' || amount === null || !(date instanceof Date)) return;
      if (from && date < from) return;
      if (to   && date > to)   return;
      rows.push({
        supplier:   supplier,
        date:       date,
        orderPO:    r[COL.orderPO    - 1] || '',
        desc:       r[COL.desc       - 1] || '',
        amount:     Number(amount)        || 0,
        project:    normalizeProject(r[COL.project    - 1]),
        department: r[COL.department - 1] || '',
        classVal:   r[COL.classCol   - 1] || '',
        subclass:   r[COL.subclass   - 1] || '',
        nature:     (r[COL.nature  - 1] || '').toString().trim(),
        paidBy:     (r[COL.paidBy  - 1] || '').toString().trim()
      });
    });
  });
  return rows;
}

function getLastUpdated() {
  var ss  = SpreadsheetApp.getActiveSpreadsheet();
  var max = null;
  SUPPLIERS.forEach(function(supplier) {
    var sheet = ss.getSheetByName(supplier);
    if (!sheet) return;
    var val = sheet.getRange(1, 2).getValue();
    if (val instanceof Date && (!max || val > max)) max = val;
  });
  return max ? Utilities.formatDate(max, Session.getScriptTimeZone(), 'MMM d, yyyy') : 'unknown';
}

function getAuditCheckValue() {
  try {
    var ss      = SpreadsheetApp.getActiveSpreadsheet();
    var summary = ss.getSheetByName('Summary');
    if (!summary) return null;
    var labels = summary.getRange(1, 1, summary.getLastRow(), 1).getValues();
    for (var i = 0; i < labels.length; i++) {
      if (String(labels[i][0]).indexOf('Audit Check') > -1) {
        return summary.getRange(i + 1, PROJECTS.length + 2).getValue();
      }
    }
    return null;
  } catch(e) { return null; }
}

// ── SUMMARY TABLE (reads Summary tab directly) ─────────────────────────────────
function getSummaryTable() {
  var ss      = SpreadsheetApp.getActiveSpreadsheet();
  var summary = ss.getSheetByName('Summary');
  if (!summary) return { data: [], rows: 0, cols: 0 };
  var lastRow = summary.getLastRow();
  var lastCol = summary.getLastColumn();
  var tz      = Session.getScriptTimeZone();
  var data    = summary.getRange(1, 1, lastRow, lastCol).getValues();

  // Format dates server-side so client receives plain strings
  data = data.map(function(row) {
    return row.map(function(cell) {
      if (cell instanceof Date) {
        return Utilities.formatDate(cell, tz, 'dd-MMM-yy');
      }
      return cell;
    });
  });

  return { data: data, rows: lastRow, cols: lastCol };
}

// ── DASHBOARD DATA ─────────────────────────────────────────────────────────────
function getDashboardData(filters) {
  filters = filters || {};
  var rows = readAllRows(filters.fromDate, filters.toDate);

  var grandTotal = 0, realEstateTotal = 0, personalTotal = 0, untaggedTotal = 0;
  var personalRows = [], untaggedProject = [], untaggedNature = [], untaggedPaidBy = [];
  var ownerProject = {};
  var minDate = null, maxDate = null;

  rows.forEach(function(r) {
    grandTotal += r.amount;
    if (!minDate || r.date < minDate) minDate = r.date;
    if (!maxDate || r.date > maxDate) maxDate = r.date;

    var missingNature  = (r.nature  === '');
    var missingProject = (!r.project);
    var missingPaidBy  = (!r.paidBy);
    var anyMissing     = missingNature || missingProject || missingPaidBy;

    if (isPersonal(r)) {
      personalTotal += r.amount;
      personalRows.push(r);
    } else if (anyMissing) {
      untaggedTotal += r.amount;
    } else {
      realEstateTotal += r.amount;
    }

    if (!isPersonal(r)) {
      if (missingProject) untaggedProject.push(r);
      if (missingNature)  untaggedNature.push(r);
      if (missingPaidBy)  untaggedPaidBy.push(r);
    }

    if (PROJECTS.indexOf(r.project) > -1 && !isPersonal(r)) {
      var owner = r.paidBy || 'Unassigned';
      ownerProject[owner] = ownerProject[owner] || {};
      ownerProject[owner][r.project] = (ownerProject[owner][r.project] || 0) + r.amount;
    }
  });

  return {
    kpis: {
      grandTotal:      grandTotal,
      realEstateTotal: realEstateTotal,
      personalTotal:   personalTotal,
      untaggedTotal:   untaggedTotal,
      auditCheck:      getAuditCheckValue()
    },
    period: {
      from: minDate ? Utilities.formatDate(minDate, Session.getScriptTimeZone(), 'MMM yyyy') : '',
      to:   maxDate ? Utilities.formatDate(maxDate, Session.getScriptTimeZone(), 'MMM yyyy') : ''
    },
    lastUpdated:   getLastUpdated(),
    projects:      PROJECTS,
    ownerProject:  ownerProject,
    personalBySup: groupBySupplier(personalRows),
    untagged: {
      project: groupBySupplier(untaggedProject),
      nature:  groupBySupplier(untaggedNature),
      paidBy:  groupBySupplier(untaggedPaidBy)
    }
  };
}

// ── PROJECT BREAKDOWN ──────────────────────────────────────────────────────────
function getProjectBreakdown(project, filters) {
  filters = filters || {};
  var rows = readAllRows(filters.fromDate, filters.toDate)
    .filter(function(r) { return r.project === project && !isPersonal(r); });

  var total = 0, tree = {}, monthsByYear = {};

  rows.forEach(function(r) {
    total += r.amount;
    var d = r.department || '(blank)';
    var c = r.classVal   || '(blank)';
    var s = r.subclass   || '(blank)';
    tree[d] = tree[d] || { total: 0, classes: {} };
    tree[d].total += r.amount;
    tree[d].classes[c] = tree[d].classes[c] || { total: 0, subclasses: {} };
    tree[d].classes[c].total += r.amount;
    tree[d].classes[c].subclasses[s] = (tree[d].classes[c].subclasses[s] || 0) + r.amount;

    var y = r.date.getFullYear();
    var m = r.date.getMonth();
    monthsByYear[y] = monthsByYear[y] || [0,0,0,0,0,0,0,0,0,0,0,0];
    monthsByYear[y][m] += r.amount;
  });

  return { project: project, total: total, tree: tree, monthsByYear: monthsByYear };
}

// ── SUMMARY BUILDER (existing, do not remove) ──────────────────────────────────
// Paste your existing buildAllSummaries, buildSupplierSummary,
// buildPaymentSummary functions below this line unchanged.