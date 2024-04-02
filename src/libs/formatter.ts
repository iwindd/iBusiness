export const fMoney = (val: number) => {
  try {
    if (!val) return 0;

    return val.toLocaleString()
  } catch (error) {
    return 0
  }
}

export const fNumber = (val: number) => {
  try {
    if (!val) return 0;

    return val.toLocaleString()
  } catch (error) {
    return 0
  }
}

export const fDateT = (date: Date) => {
  try {
    return new Intl.DateTimeFormat('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  } catch (error) {
    return "-"
  }
}

export const fText = (text: string | undefined, replacer: string = "-") => {
  try {
    if (!text) return replacer
    if (text.length <= 0) return replacer
    return text
  } catch (error) {
    return replacer
  }
}