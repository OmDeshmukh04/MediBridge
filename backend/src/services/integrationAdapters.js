import crypto from 'crypto';

export function verifyHealthIdentity(identityNumber) {
  const digits = String(identityNumber || '').replace(/\D/g, '');
  const referenceId = `ABDM-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  return {
    referenceId,
    verified: digits.length >= 8,
    provider: 'ABDM_DEMO_ADAPTER',
    consentRequired: true,
    message:
      digits.length >= 8
        ? 'Demo verification successful. Replace this adapter with official ABDM credentials for production.'
        : 'Demo verification failed because the identity number is incomplete.'
  };
}

export function requestAmbulanceDispatch(payload) {
  const priority = payload.priority || inferPriority(payload.symptoms || '');
  const etaMinutes = priority === 'critical' ? 8 : priority === 'urgent' ? 14 : 24;

  return {
    dispatchId: `AMB-DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    provider: '108_AMBULANCE_DEMO_ADAPTER',
    status: 'queued',
    priority,
    etaMinutes,
    pickup: payload.pickup,
    destination: payload.destination,
    message: 'Demo dispatch created. Production use requires official emergency-service integration.'
  };
}

function inferPriority(symptoms) {
  const normalized = String(symptoms).toLowerCase();

  if (['stroke', 'seizure', 'chest pain', 'unconscious', 'severe bleeding'].some((flag) => normalized.includes(flag))) {
    return 'critical';
  }

  if (['breathing', 'fracture', 'high fever'].some((flag) => normalized.includes(flag))) {
    return 'urgent';
  }

  return 'standard';
}

