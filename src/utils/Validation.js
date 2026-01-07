export function validateNickname(nickname) {
  if (!nickname) {
    return '닉네임을 입력해주세요.'
  }

  if (nickname.length < 3 || nickname.length > 12) {
    return '닉네임은 3~12자 이내여야 합니다.'
  }

  // 한글, 영문, 숫자만 허용
  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/
  if (!nicknameRegex.test(nickname)) {
    return '닉네임에는 특수문자를 사용할 수 없습니다.'
  }

  return null
}

export function validateCarMessage(message) {
  if (!message) {
    return '상태 메시지를 입력해주세요.'
  }

  if (message.length > 30) {
    return '상태 메시지는 최대 30자까지 입력 가능합니다.'
  }

  return null
}

export function validateName(name) {
  if (!name) {
    return '이름을 입력해주세요.'
  }

  if (name.length < 3 || name.length > 12) {
    return '이름은 3~12자 이내여야 합니다.'
  }

  // 한글, 영문, 숫자만 허용
  const nameRegex = /^[가-힣a-zA-Z0-9]+$/
  if (!nameRegex.test(name)) {
    return '이름에는 특수문자를 사용할 수 없습니다.'
  }

  return null
}

export function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return '핸드폰 번호를 입력해주세요.'
  }

  const phoneNumberRegex = /^01[016789]\d{7,8}$/
  if (!phoneNumberRegex.test(phoneNumber)) {
    return '유효하지 않은 연락처 형식입니다.'
  }

  return null
}

export function validatePassword(password) {
  if (!password) {
    return '비밀번호를 입력해 주세요.'
  }

  return null
}

export function validatePasswordForSignup(password) {
  if (!password) {
    return '비밀번호를 입력해 주세요.'
  }

  const passwordRegex = /^(?=.{8,16}$)(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=\{};:,<.>]).+$/
  if (!passwordRegex.test(password)) {
    return '비밀번호는 8~16 자의 영문, 숫자, 특수문자를 사용해 주세요.'
  }

  return null
}
