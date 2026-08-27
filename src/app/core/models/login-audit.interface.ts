export interface LoginAudit {
  id: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
}
