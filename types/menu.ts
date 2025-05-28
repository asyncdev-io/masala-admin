export interface MenuImportRequest {
  sourceMenuId: string;
  targetMenuId: string;
}

export interface MenuImportResponse {
  success: boolean;
  message: string;
}

export interface Menu {
  id: string;
  name: string;
}