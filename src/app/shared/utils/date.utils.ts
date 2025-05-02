export class DateUtils {

  static formatarData(dataString: string): string {
    const data = new Date(dataString);
    const diff = Date.now() - data.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return days === 1 ? 'Um dia atrás' : `${days} dias atrás`;
    } else if (hours > 0) {
      return hours === 1 ? 'Há uma hora' : `Há ${hours} horas`;
    } else if (minutes > 0) {
      return minutes === 1 ? 'Há um minuto' : `Há ${minutes} minutos`;
    } else {
      return 'Agora mesmo';
    }
  }
}