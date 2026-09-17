import { useState, useCallback } from 'react'
import { readToken, storeToken, removeToken, requestUnlock } from './api'

/*
 * Holds the unlock token for the password-protected projects. One token covers all of
 * them and lasts 7 days, so this can live inside the overlay — no app-wide state needed.
 */
function useUnlock() {
  const [token, setToken] = useState(() => readToken())

  const unlock = useCallback(async (password) => {
    const { token: newToken, exp } = await requestUnlock(password)
    storeToken(newToken, exp)
    setToken(newToken)
  }, [])

  const clearToken = useCallback(() => {
    removeToken()
    setToken(null)
  }, [])

  return { token, unlock, clearToken }
}

export default useUnlock
