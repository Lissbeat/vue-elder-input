function DateToInputDateString(date) {
  let offset = date.getTimezoneOffset()
  return new Date(date.getTime() + offset * 60 * 1000 * -1)
    .toISOString()
    .split('T')
    .shift()
}

function DateToInputTimeString(date) {
  let h = date.getHours().toString()
  let m = date.getMinutes().toString()

  h = h.length < 2 ? '0' + h : h
  m = m.length < 2 ? '0' + m : m

  return h + ':' + m
}

function InputTimeStringToDate(val, date) {
  date = new Date(date)
  let [h, m] = val.split(':')

  date.setHours(parseInt(h))
  date.setMinutes(parseInt(m))

  return date
}

function ConvertToString(val) {
  if (typeof val === 'string') return val
  if (val.toString) return val.toString()

  return val
}

export { DateToInputDateString, DateToInputTimeString, InputTimeStringToDate, ConvertToString }
