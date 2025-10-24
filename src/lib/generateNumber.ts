/**
 * Generate a unique number based on current date and time
 * Format: YYYYMMDDHHmm (e.g., 202510231710)
 * @returns {string} Generated number
 */
export function generateAutoNumber(): string {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hours}${minutes}`;
}

/**
 * Generate a job number with prefix
 * Format: JOB-YYYYMMDDHHmm (e.g., JOB-202510231710)
 * @param {string} prefix - Optional prefix for the number (default: 'JOB')
 * @returns {string} Generated job number
 */
export function generateJobNumber(prefix: string = 'JOB'): string {
  return `${prefix}-${generateAutoNumber()}`;
}

/**
 * Generate a house AWB number with prefix
 * Format: HAWB-YYYYMMDDHHmm (e.g., HAWB-202510231710)
 * @param {string} prefix - Optional prefix for the number (default: 'HAWB')
 * @returns {string} Generated house AWB number
 */
export function generateHouseAwbNumber(prefix: string = 'HAWB'): string {
  return `${prefix}-${generateAutoNumber()}`;
}

/**
 * Generate a master AWB number with prefix
 * Format: MAWB-YYYYMMDDHHmm (e.g., MAWB-202510231710)
 * @param {string} prefix - Optional prefix for the number (default: 'MAWB')
 * @returns {string} Generated master AWB number
 */
export function generateMasterAwbNumber(prefix: string = 'MAWB'): string {
  return `${prefix}-${generateAutoNumber()}`;
}

