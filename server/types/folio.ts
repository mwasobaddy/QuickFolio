export interface Folio {
  id: string;
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFolioInput {
  item: string;
  runningNo: string;
  description?: string;
  draftedBy: string;
  letterDate: Date;
}

export interface UpdateFolioInput {
  item?: string;
  runningNo?: string;
  description?: string;
  draftedBy?: string;
  letterDate?: Date;
}