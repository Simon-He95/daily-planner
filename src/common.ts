export function getCurrentDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  return dateStr
}

const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export function getDay() {
  return days[new Date().getDay()]
}

export function calculateTime(time: string) {
  const [hour, minutes] = time.split(':')
  return +hour * 60 + +minutes
}
