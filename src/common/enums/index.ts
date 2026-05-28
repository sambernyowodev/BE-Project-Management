export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  SIT = 'SIT',
  UAT = 'UAT',
  CLOSED = 'CLOSED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export enum ProjectPhase {
  FCAB = 'FCAB',
  REQUIREMENT = 'REQUIREMENT',
  ANALYSIS = 'ANALYSIS',
  DESIGN = 'DESIGN',
  SRS = 'SRS',
  CRQ = 'CRQ',
  DEVELOPMENT = 'DEVELOPMENT',
  UT_SIT = 'UT_SIT',
  TRA_TC = 'TRA_TC',
  REVIEW = 'REVIEW',
  SIT = 'SIT',
  UAT = 'UAT',
  NFT = 'NFT',
  SECURITY = 'SECURITY',
  RFS = 'RFS',
  FUT = 'FUT',
}

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum SalesOrderStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum SupportTicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DEV_DONE = 'DEV_DONE',
  SIT_DONE = 'SIT_DONE',
  UAT_DONE = 'UAT_DONE',
  DONE = 'DONE',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export enum SupportTicketDetailStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ON_HOLD = 'ON_HOLD',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}
