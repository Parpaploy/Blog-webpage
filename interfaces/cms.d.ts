export interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export interface ResetRequestResult {
  success: boolean;
  message?: string;
  error?: string;
}
