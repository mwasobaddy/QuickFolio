export interface Folio {
  id: string;
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
  fileId: string;
  file?: {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFolioInput {
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
  fileId: string;
}

export interface UpdateFolioInput {
  item?: string;
  runningNo?: string;
  description?: string;
  draftedBy?: string;
  letterDate?: Date;
  fileId?: string;
}