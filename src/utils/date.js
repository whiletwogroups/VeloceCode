// ============================================================
//  src/utils/date.js — Date Formatting & Label Parsing
// ============================================================

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function formatResourceLabel(res) {
  let label = res.label;
  const urlPattern = /([a-zA-Z0-9\.\s\-\_]+)\((https?:\/\/[^\s\)]+)\)/g;
  if (urlPattern.test(label)) {
    return label.replace(urlPattern, '$1');
  }
  return label;
}
