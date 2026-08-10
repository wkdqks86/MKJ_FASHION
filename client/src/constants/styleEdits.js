export const INITIAL_STYLE_EDIT_FORM = {
  title: '',
  startDate: '',
  endDate: '',
  images: [],
  coverImageUrl: '',
}

export function styleEditToForm(styleEdit) {
  return {
    title: styleEdit.title || '',
    startDate: toDateInputValue(styleEdit.startDate),
    endDate: toDateInputValue(styleEdit.endDate),
    images: styleEdit.images?.map((item) => item.url) || [],
    coverImageUrl: styleEdit.coverImageUrl || '',
  }
}

export function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 10)
}

export function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '-'

  const formatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return `${formatter.format(start)} ~ ${formatter.format(end)}`
}

export function getStyleEditStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  end.setHours(23, 59, 59, 999)

  if (now < start) return { label: '예정', tone: 'pending' }
  if (now > end) return { label: '종료', tone: 'ended' }
  return { label: '노출 중', tone: 'active' }
}
