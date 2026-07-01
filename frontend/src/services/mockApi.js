const translations = {
  en: {
    high: 'High risk indicators found. Escalate to a doctor immediately.',
    medium: 'Moderate risk indicators found. Schedule a clinical review.',
    low: 'No urgent indicators found in the report text.'
  },
  hi: {
    high: 'उच्च जोखिम संकेत मिले हैं। तुरंत डॉक्टर को दिखाएं।',
    medium: 'मध्यम जोखिम संकेत मिले हैं। क्लिनिकल समीक्षा तय करें।',
    low: 'रिपोर्ट में तत्काल जोखिम संकेत नहीं मिले।'
  },
  mr: {
    high: 'उच्च जोखमीची चिन्हे आढळली. त्वरित डॉक्टरांकडे पाठवा.',
    medium: 'मध्यम जोखमीची चिन्हे आढळली. वैद्यकीय तपासणी ठरवा.',
    low: 'रिपोर्टमध्ये तातडीची जोखीम आढळली नाही.'
  }
};

export function analyzeReport(text, language) {
  const normalized = text.toLowerCase();
  const conditions = ['diabetes', 'hypertension', 'infection', 'anemia'].filter((item) =>
    normalized.includes(item)
  );
  const vitals = [
    findVital(text, /bp\s*[:=-]?\s*(\d{2,3}\/\d{2,3})/i, 'BP'),
    findVital(text, /glucose\s*[:=-]?\s*(\d+)/i, 'Glucose'),
    findVital(text, /spo2\s*[:=-]?\s*(\d+)/i, 'SpO2')
  ].filter(Boolean);
  const glucose = Number((text.match(/glucose\s*[:=-]?\s*(\d+)/i) || [])[1] || 0);
  const risk = glucose > 300 || normalized.includes('chest pain') ? 'high' : conditions.length ? 'medium' : 'low';
  const message = translations[language]?.[risk] || translations.en[risk];

  return {
    risk,
    conditions,
    vitals,
    summary: `${message} ${conditions.length ? `Detected: ${conditions.join(', ')}.` : ''}`.trim()
  };
}

export function verifyIdentity(identityNumber) {
  return {
    verified: true,
    message: `Demo ABDM verification completed for ${identityNumber}. Consent required before sharing records.`
  };
}

export function requestAmbulance({ symptoms }) {
  const critical = symptoms.toLowerCase().includes('high risk');

  return {
    status: 'queued',
    priority: critical ? 'critical' : 'urgent',
    eta: critical ? 8 : 14
  };
}

function findVital(text, pattern, label) {
  const match = text.match(pattern);
  return match ? `${label}: ${match[1]}` : null;
}

