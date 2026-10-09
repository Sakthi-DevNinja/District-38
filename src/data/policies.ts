import { DISTRICT_38_STORE } from './storeInfo';

// Every value the owner must confirm for the legal / policy pages lives here,
// so the pages never invent a promise. `null` hides the sentence that needs it.
// Razorpay reviews these pages (Terms, Privacy, Refund & Cancellation,
// Shipping, Contact) before activating live payments.
export const POLICY = {
  /** Shown as "Last updated" on every policy page. */
  lastUpdated: '9 October 2026',

  /** Trading name used across the site. */
  brandName: 'District 38',
  /** Registered business name as on GST / Razorpay KYC, e.g. "XYZ Enterprises". */
  legalName: null as string | null,
  gstin: null as string | null,

  email: DISTRICT_38_STORE.email,
  phone: DISTRICT_38_STORE.phone,
  whatsapp: DISTRICT_38_STORE.whatsapp,
  address: `${DISTRICT_38_STORE.addressLine1}, ${DISTRICT_38_STORE.addressLine2}, ${DISTRICT_38_STORE.city}, ${DISTRICT_38_STORE.state} ${DISTRICT_38_STORE.pincode}`,

  /** Name of the grievance officer (IT Rules 2011 / DPDP Act 2023). */
  grievanceOfficer: null as string | null,

  /** Business days to dispatch an in-stock order. */
  dispatchDaysInStock: '1–2',
  /** Typical courier transit time after dispatch. */
  deliveryDays: '2–7',

  /** Hours after delivery to report a damaged, defective or wrong item. */
  damageReportHours: 48,
  /** Days after delivery for a size exchange on unused items; null = no size exchange. */
  sizeExchangeDays: 7 as number | null,

  /** Business days for a refund to reach the customer after it is issued. */
  refundDays: '5–7',

  jurisdiction: 'Tiruchirappalli, Tamil Nadu',
};

/** "District 38 (operated by XYZ Enterprises)" once the legal name is known. */
export function businessName(): string {
  return POLICY.legalName ? `${POLICY.brandName} (operated by ${POLICY.legalName})` : POLICY.brandName;
}
