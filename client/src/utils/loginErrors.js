import { getApiErrorMessage } from './apiErrors'

const LOGIN_ERROR_MESSAGES = {
  'Email and password are required': '이메일과 비밀번호를 입력해 주세요.',
  'Invalid email or password': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Account is deactivated. Please contact support.': '비활성화된 계정입니다. 고객센터에 문의해 주세요.',
}

const GUEST_ERROR_MESSAGES = {
  'Guest name and order number are required': '주문자명과 주문번호를 입력해 주세요.',
  'Order not found': '주문 정보를 찾을 수 없습니다.',
  'Guest name does not match order information': '주문자명이 일치하지 않습니다.',
}

export function getLoginErrorMessage(err) {
  return getApiErrorMessage(err, LOGIN_ERROR_MESSAGES, '로그인에 실패했습니다.')
}

export function getGuestErrorMessage(err) {
  return getApiErrorMessage(err, GUEST_ERROR_MESSAGES, '주문 조회에 실패했습니다.')
}
