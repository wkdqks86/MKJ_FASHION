export function validateSignUpForm(form, agreements) {
  if (!form.name.trim()) return '이름을 입력해 주세요.'
  if (!form.email.trim()) return '이메일을 입력해 주세요.'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return '올바른 이메일 형식을 입력해 주세요.'
  if (!form.password) return '비밀번호를 입력해 주세요.'
  if (form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
  if (form.password !== form.confirmPassword) return '비밀번호가 일치하지 않습니다.'

  const phoneMiddle = form.phoneMiddle.trim()
  const phoneLast = form.phoneLast.trim()
  if (phoneMiddle || phoneLast) {
    if (!phoneMiddle || !phoneLast) return '휴대폰 번호를 모두 입력해 주세요.'
    const phone = `${form.phonePrefix}-${phoneMiddle}-${phoneLast}`
    if (!/^[0-9+\-() ]{8,20}$/.test(phone)) return '올바른 휴대폰 번호를 입력해 주세요.'
  }

  if (!agreements.terms) return '이용약관에 동의해 주세요.'
  if (!agreements.privacy) return '개인정보 수집 및 이용에 동의해 주세요.'

  return null
}

export function buildPhoneNumber(form) {
  const phoneMiddle = form.phoneMiddle.trim()
  const phoneLast = form.phoneLast.trim()
  if (!phoneMiddle && !phoneLast) return undefined
  return `${form.phonePrefix}-${phoneMiddle}-${phoneLast}`
}
