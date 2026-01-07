export const CONTACT_STATUS_VIEW = {
  AVAILABLE: {
    label: '통화 가능',
    class: 'available',
  },
  UNAVAILABLE: {
    label: '통화 불가능',
    class: 'unavailable',
  },
}

export function getContactStatusView(status) {
  return (
    CONTACT_STATUS_VIEW[status] ?? {
      label: '알 수 없음',
      class: 'unknown',
    }
  )
}
