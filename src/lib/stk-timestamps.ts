const stkTimestamps = new Map<string, number>();

export function registerStkTimestamp(checkoutRequestId: string) {
  stkTimestamps.set(checkoutRequestId, Date.now());
}

export function getStkTimestamp(checkoutRequestId: string): number | undefined {
  return stkTimestamps.get(checkoutRequestId);
}

export function deleteStkTimestamp(checkoutRequestId: string) {
  stkTimestamps.delete(checkoutRequestId);
}

export function allStkTimestamps(): Map<string, number> {
  return stkTimestamps;
}
