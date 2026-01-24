import type { OTPDetails } from '../types/auth';

export const setOTPDetails = function (otpDetais: OTPDetails) {
  sessionStorage.setItem('otpDetails', JSON.stringify(otpDetais));
};

export const getOTPDetails = function (): OTPDetails | null {
  const sessionDetails = sessionStorage.getItem('otpDetails');
  if (!sessionDetails) return null;
  const otpDetails = JSON.parse(sessionDetails);
  return otpDetails;
};
