export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lowStockThreshold: number;
  supplier?: string;
};

export type LedgerEntry = {
  id: string;
  date: string; // Consider using Date type, but string for simplicity in mock data
  description: string;
  type: "income" | "expense";
  category: string;
  amount: number;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  type: "sale" | "purchase";
  amount: number;
  partyName: string; // Buyer or Seller name
  partyType: "customer" | "supplier";
  relatedInvoice?: string;
  imagePreviewUrl?: string; // For OCR placeholder
};

export type Business = {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  contact?: string;
};

export type Supplier = Business & {
  itemsSupplied: string[];
};

export type ReportData = {
  name: string;
  value: number;
};

export type KeyMetric = {
  title: string;
  value: string | number;
  icon?: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
};