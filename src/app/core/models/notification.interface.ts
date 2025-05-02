export interface Notification {
    id: number;
    usuarioId: number;
    mensagem: string;
    urlRedirect: string;
    grauNotificacao: string;
    lida: boolean;
    createdAt: string;
}