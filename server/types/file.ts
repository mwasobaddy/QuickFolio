export interface File {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  folios?: Folio[];
}

export interface CreateFileInput {
  name: string;
  description?: string;
  createdBy: string;
}

export interface UpdateFileInput {
  name?: string;
  description?: string;
  createdBy?: string;
}

export interface Folio {
  id: string;
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
  fileId: string;
  createdAt: Date;
  updatedAt: Date;
}