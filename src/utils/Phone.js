export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '연락처'

  const onlyNumber = phoneNumber.replace(/\D/g, '')

  if (onlyNumber.length === 11) {
    return onlyNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  if (onlyNumber.length === 10) {
    return onlyNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return phoneNumber
}
