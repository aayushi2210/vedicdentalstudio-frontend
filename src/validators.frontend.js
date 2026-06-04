// ─────────────────────────────────────────────────────────────
// Portal-side validation (React). Same rules as the backend so the
// user sees errors instantly, before the request is even sent.
// Drop this in src/ and import { validateField, ... } in your forms.
// ─────────────────────────────────────────────────────────────

export const PHONE_REGEX = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const DATE_REGEX  = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_REGEX  = /^([01]\d|2[0-3]):[0-5]\d$/;
export const NAME_REGEX  = /^[A-Za-z][A-Za-z\s.'-]{1,59}$/;

export const APPOINTMENT_TYPES = ['Initial Assessment','Follow-up','Walk-in Consultation','Review','Physiotherapy Session','Tele-consultation','Home Visit'];

// Returns an error string, or "" if valid.
export function validateField(field, value) {
  const v = (value ?? '').toString().trim();
  switch (field) {
    case 'name':
      if (!v) return 'Name is required';
      if (!NAME_REGEX.test(v)) return 'Enter a valid name (letters only, 2-60 chars)';
      return '';
    case 'phone':
      if (!v) return 'Phone number is required';
      if (!PHONE_REGEX.test(v)) return 'Enter a valid 10-digit mobile number';
      return '';
    case 'email':                                   // optional
      if (v && !EMAIL_REGEX.test(v)) return 'Enter a valid email address';
      return '';
    case 'date':
      if (!v) return 'Date is required';
      if (!DATE_REGEX.test(v)) return 'Date must be YYYY-MM-DD';
      if (isNaN(new Date(v + 'T00:00:00').getTime())) return 'Invalid date';
      if (new Date(v + 'T00:00:00') < new Date(new Date().setHours(0,0,0,0))) return 'Date cannot be in the past';
      return '';
    case 'time':
      if (!v) return 'Time is required';
      if (!TIME_REGEX.test(v)) return 'Time must be HH:MM (24-hour)';
      return '';
    case 'type':
      if (!v) return 'Appointment type is required';
      if (!APPOINTMENT_TYPES.includes(v)) return 'Choose a valid appointment type';
      return '';
    case 'rating': {
      const n = Number(v);
      if (!n) return 'Rating is required';
      if (n < 1 || n > 5) return 'Rating must be 1-5';
      return '';
    }
    default:
      return '';
  }
}

// Validate a whole form object → returns { field: errorMessage } (empty = all good)
export function validateForm(fields) {
  const errors = {};
  Object.entries(fields).forEach(([k, val]) => {
    const err = validateField(k, val);
    if (err) errors[k] = err;
  });
  return errors;
}
