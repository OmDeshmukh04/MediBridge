const translations = {
  en: {
    high: 'High risk indicators found. Escalate to a doctor immediately.',
    medium: 'Moderate risk indicators found. Schedule a clinical review.',
    low: 'No urgent indicators found in the provided report text.'
  },
  hi: {
    high: 'उच्च जोखिम संकेत मिले हैं। तुरंत डॉक्टर को दिखाएं।',
    medium: 'मध्यम जोखिम संकेत मिले हैं। क्लिनिकल समीक्षा तय करें।',
    low: 'दिए गए रिपोर्ट पाठ में तत्काल जोखिम संकेत नहीं मिले।'
  },
  mr: {
    high: 'उच्च जोखमीची चिन्हे आढळली. त्वरित डॉक्टरांकडे पाठवा.',
    medium: 'मध्यम जोखमीची चिन्हे आढळली. वैद्यकीय तपासणी ठरवा.',
    low: 'दिलेल्या रिपोर्टमध्ये तातडीची जोखीम आढळली नाही.'
  }
};

const conditionKeywords = [
  'diabetes',
  'hypertension',
  'infection',
  'anemia',
  'pneumonia',
  'asthma',
  'fracture',
  'thyroid'
];

const medicationPattern = /\b(?:tab|tablet|cap|capsule|syrup|inj|injection)\.?\s+([a-z0-9 -]+)/gi;

export function analyzeMedicalReport(text, language = 'en') {
  const normalized = text.toLowerCase();
  const vitals = extractVitals(text);
  const detectedConditions = conditionKeywords.filter((keyword) => normalized.includes(keyword));
  const medicationMentions = extractMedications(text);
  const riskLevel = calculateRiskLevel(normalized, vitals);
  const messages = translations[language] || translations.en;

  return {
    extractedVitals: vitals,
    detectedConditions,
    medicationMentions,
    riskLevel,
    summary: buildSummary(riskLevel, detectedConditions, vitals, messages[riskLevel])
  };
}

function extractVitals(text) {
  return {
    hemoglobin: findNumber(text, /(?:hb|hemoglobin)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i),
    glucose: findNumber(text, /(?:glucose|sugar|fbs)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i),
    systolicBp: findNumber(text, /(?:bp|blood pressure)\s*[:=-]?\s*(\d{2,3})\s*\/\s*\d{2,3}/i),
    diastolicBp: findNumber(text, /(?:bp|blood pressure)\s*[:=-]?\s*\d{2,3}\s*\/\s*(\d{2,3})/i),
    spo2: findNumber(text, /(?:spo2|oxygen)\s*[:=-]?\s*(\d{2,3})/i)
  };
}

function findNumber(text, pattern) {
  const match = text.match(pattern);
  return match ? Number(match[1]) : null;
}

function extractMedications(text) {
  const matches = [];
  let match = medicationPattern.exec(text);

  while (match) {
    matches.push(match[1].trim().replace(/[.,;]$/, ''));
    match = medicationPattern.exec(text);
  }

  return [...new Set(matches)].slice(0, 8);
}

function calculateRiskLevel(normalized, vitals) {
  const redFlags = ['critical', 'severe', 'emergency', 'chest pain', 'stroke', 'sepsis'];

  if (
    redFlags.some((flag) => normalized.includes(flag)) ||
    (vitals.spo2 !== null && vitals.spo2 < 92) ||
    (vitals.systolicBp !== null && vitals.systolicBp > 180) ||
    (vitals.glucose !== null && vitals.glucose > 300)
  ) {
    return 'high';
  }

  if (
    normalized.includes('follow up') ||
    (vitals.hemoglobin !== null && vitals.hemoglobin < 10) ||
    (vitals.systolicBp !== null && vitals.systolicBp > 140)
  ) {
    return 'medium';
  }

  return 'low';
}

function buildSummary(riskLevel, conditions, vitals, translatedMessage) {
  const conditionText = conditions.length ? `Detected keywords: ${conditions.join(', ')}.` : 'No major condition keywords detected.';
  const vitalsText = Object.entries(vitals)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  return `${translatedMessage} ${conditionText} ${vitalsText ? `Extracted vitals: ${vitalsText}.` : ''}`.trim();
}

