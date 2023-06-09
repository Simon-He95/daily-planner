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

export function getDayFirst() {
  const today = new Date()
  const day = today.getDay() // 获取今天是周几
  const diff = day === 0 ? 6 : day - 1 // 计算与周一相差天数
  const monday = new Date(today) // 克隆一次日期对象
  monday.setDate(monday.getDate() - diff) // 设置为周一日期
  return monday.toISOString().match(/(^[0-9]+-[0-9]+-[0-9]+)/)![1]
}

export function calculateTime(time: string) {
  const [hour, minutes] = time.split(':')
  return +hour * 60 + +minutes
}

/**
 * 年月日
 * 日期比较，左边传入较大，右边传入较小的如果正确返回true否则false，相等也为true
 * @param big 你认为较大的日期
 * @param small 你认为较小的日期
 * @return boolean
 */
export function compareDay(big: string, small: string): boolean {
  const [y1, m1, d1] = big.split('-')
  const [y2, m2, d2] = small.split('-')

  return y1 < y2
    ? false
    : y1 > y2
      ? true
      : m1 < m2
        ? false
        : m1 > m2
          ? true
          : !(d1 < d2)
}

export function getNowTime() {
  const now = new Date()
  const minutes = now.getMinutes().toString()
  const nowtime = `${now.getHours()}:${minutes.length < 2 ? `0${minutes}` : minutes}`
  return nowtime
}
