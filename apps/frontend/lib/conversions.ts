// Google Ads conversion tracking utilities

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Reports a conversion to Google Ads
 * @param url Optional URL to redirect to after conversion is tracked
 * @returns false (to prevent default form submission if used in onSubmit)
 */
export function reportConversion(url?: string): boolean {
  if (typeof window !== 'undefined' && window.gtag_report_conversion) {
    return window.gtag_report_conversion(url);
  }
  
  // Fallback if gtag_report_conversion is not available
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-11324883721/7OqlCMnpl_0ZEImGkJgq',
      'value': 1.0,
      'currency': 'INR'
    });
  }
  
  return false;
}

/**
 * Reports a simple conversion event without redirect
 */
export function reportConversionEvent(): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-11324883721/7OqlCMnpl_0ZEImGkJgq',
      'value': 1.0,
      'currency': 'INR'
    });
  }
}

