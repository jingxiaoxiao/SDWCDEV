/** @type {{ [key: string]: Intl.DateTimeFormatOptions }} */
export const format = {
  // YYYY-MM-DD HH:mm
  long: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  },
  // HH:mm
  time: {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  },
  // HH:mm:ss
  seconds: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }
};
