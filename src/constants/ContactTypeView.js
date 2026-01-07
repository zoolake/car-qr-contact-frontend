export const CONTACT_TYPE_VIEW = {
  MAIN: {
    label: '차주',
    class: 'main',
  },
  SUB: {
    label: '서브',
    class: 'sub',
  },
}

export function getContactTypeView(type) {
  return (
    CONTACT_TYPE_VIEW[type] ?? {
      label: '알 수 없음',
      class: 'unknown',
    }
  )
}
