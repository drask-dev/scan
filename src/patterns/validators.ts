/** Luhn algorithm — validates credit/debit card numbers */
export function luhn(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  if (!/^\d+$/.test(digits) || digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/** IBAN check digit validation (ISO 7064 Mod 97-10) */
export function ibanCheckDigit(value: string): boolean {
  const iban = value.replace(/\s/g, "");
  if (iban.length < 15 || iban.length > 34) return false;

  // Move first 4 chars (country + check digits) to end, then replace A-Z with 10-35
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));

  // Iterative mod 97 — digit string exceeds JS safe integer range
  let rem = 0;
  for (const ch of digits) {
    rem = (rem * 10 + Number(ch)) % 97;
  }
  return rem === 1;
}

/** NHS number check digit validation (modulus 11) */
export function nhsCheckDigit(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  if (digits.length !== 10) return false;

  const weights = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  if (checkDigit === 11) return parseInt(digits[9], 10) === 0;
  if (checkDigit === 10) return false; // invalid
  return parseInt(digits[9], 10) === checkDigit;
}
