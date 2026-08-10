const NETWORK_ERROR_MESSAGE =
  '서버에 연결할 수 없습니다. server 폴더에서 npm run dev를 실행했는지 확인해 주세요.'

export function getApiErrorMessage(err, messageMap, fallbackMessage) {
  if (!err.response) {
    return NETWORK_ERROR_MESSAGE
  }

  const serverMessage = err.response.data?.message
  if (!serverMessage) {
    return fallbackMessage
  }

  return messageMap[serverMessage] || serverMessage
}
