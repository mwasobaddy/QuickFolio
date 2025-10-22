export interface File {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  folioId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileInput {
  name: string;
  description?: string;
  createdBy: string;
  folioNumber: string; // We'll use this to find the folio
}

export interface UpdateFileInput {
  name?: string;
  description?: string;
  createdBy?: string;
}