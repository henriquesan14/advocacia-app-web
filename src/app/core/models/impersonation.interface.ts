import { Usuario } from './usuario.interface';

export interface ImpersonationResponse {
  usuario: Usuario;
  isImpersonating: boolean;
  actorUserId?: string;
  actorUserName?: string;
}

export interface ImpersonationSession {
  actorUserId: string;
  actorUserName: string;
}
