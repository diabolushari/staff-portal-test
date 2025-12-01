import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const splitDateTime = (date: string): string[] => {
  if (date == null) {
    return []
  }

  const splitByT = date.split('T')
  if (splitByT.length === 2) {
    return splitByT
  }

  const splitBySpace = date.split(' ')
  if (splitBySpace.length === 2) {
    return splitBySpace
  }

  return []
}
export const getTime = (date?: string): string => {
  if (!date) return ''

  const dateObj = new Date(date)

  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()

  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')

  return `${formattedHours}:${formattedMinutes} ${ampm}`
}

export const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
export const getDisplayDate = (date?: string | null) => {
  if (date == null) {
    return ''
  }
  const splitTime = splitDateTime(date)
  const datePart = splitTime.length === 2 ? splitTime[0] : date
  const splitUpdDate = datePart.split('-')
  if (splitUpdDate.length !== 3) {
    return ''
  }
  const month = Number(splitUpdDate[1])
  if (isNaN(month) || month < 1 || month > 12) {
    return ''
  }
  return splitUpdDate[2] + ', ' + shortMonthNames[month - 1] + ' ' + splitUpdDate[0]
}

export const formatDate = (date: Date | null) => {
  if (date == null) {
    return ''
  }
  let month
  if (date.getMonth() + 1 < 10) {
    month = '0' + (date.getMonth() + 1)
  } else {
    month = date.getMonth() + 1
  }
  let day
  if (date.getDate() < 10) {
    day = '0' + date.getDate()
  } else {
    day = date.getDate()
  }
  return date.getFullYear() + '-' + month + '-' + day
}
