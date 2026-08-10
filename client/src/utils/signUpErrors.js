import { getApiErrorMessage } from './apiErrors'

const SIGNUP_ERROR_MESSAGES = {
  'Email already exists': '이미 사용 중인 이메일입니다.',
  'Email is required': '이메일을 입력해 주세요.',
  'Name is required': '이름을 입력해 주세요.',
  'Password is required': '비밀번호를 입력해 주세요.',
  'Password must be at least 8 characters': '비밀번호는 8자 이상이어야 합니다.',
  'Please enter a valid phone number': '올바른 휴대폰 번호를 입력해 주세요.',
}

export function getSignUpErrorMessage(err) {
  return getApiErrorMessage(err, SIGNUP_ERROR_MESSAGES, '회원가입에 실패했습니다. 다시 시도해 주세요.')
}
