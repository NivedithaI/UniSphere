import type { ServiceRequestItem } from '../studentServices';

/**
 * DEV/SEED REFERENCE DATA ONLY.
 * NOT TO BE USED IN PRODUCTION RUNTIME.
 */
export const mockServiceRequests: ServiceRequestItem[] = [
  {
    id: 'REQ-2026-0891',
    serviceTypeId: 'srv-1',
    requestType: 'Bonafide Certificate',
    subject: 'Bonafide Certificate for Passport Renewal Application',
    description: 'I need an official Bonafide Certificate issued for my passport renewal application.',
    submittedDate: '15 Aug 2026',
    lastUpdatedDate: '16 Aug 2026',
    status: 'In Review',
    attachmentName: 'fee_receipt_sem6.pdf',
    remarks: 'Application verified by HOD CSE office.',
    timeline: [
      { step: 'Submitted', status: 'completed', date: '15 Aug 2026' }
    ]
  }
];
