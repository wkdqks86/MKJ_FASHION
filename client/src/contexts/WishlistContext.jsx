import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addWishlistItem as addWishlistItemApi,
  getMyWishlist,
  removeWishlistItem as removeWishlistItemApi,
} from '@/api/wishlists'
import { AUTH_CHANGE_EVENT, getAccessToken } from '@/utils/authStorage'

export const WISHLIST_CHANGE_EVENT = 'mkj-wishlist-change'

export const notifyWishlistChange = () => {
  window.dispatchEvent(new Event(WISHLIST_CHANGE_EVENT))
}

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [togglingProductId, setTogglingProductId] = useState(null)

  const productIds = useMemo(
    () => new Set(items.map((item) => item.product?._id).filter(Boolean)),
    [items],
  )

  const applyWishlist = useCallback((wishlist) => {
    const nextItems = wishlist?.items ?? []
    setItems(nextItems)
    notifyWishlistChange()
    return nextItems
  }, [])

  const loadWishlist = useCallback(async () => {
    if (!getAccessToken()) {
      setItems([])
      return []
    }

    setIsLoading(true)

    try {
      const data = await getMyWishlist()
      setItems(data.wishlist?.items ?? [])
      return data.wishlist?.items ?? []
    } catch {
      setItems([])
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWishlist()

    const handleAuthChange = () => {
      loadWishlist()
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange)
  }, [loadWishlist])

  const isWishlisted = useCallback(
    (productId) => productIds.has(productId),
    [productIds],
  )

  const toggleWishlist = useCallback(async (productId) => {
    if (!productId || String(productId).startsWith('fb-')) {
      return { success: false, reason: 'unavailable' }
    }

    if (!getAccessToken()) {
      return { success: false, reason: 'auth' }
    }

    setTogglingProductId(productId)

    try {
      const currentlyWishlisted = productIds.has(productId)
      const data = currentlyWishlisted
        ? await removeWishlistItemApi(productId)
        : await addWishlistItemApi(productId)

      if (data.success) {
        applyWishlist(data.wishlist)
        return { success: true, isWishlisted: !currentlyWishlisted }
      }

      return { success: false, reason: 'error' }
    } catch {
      return { success: false, reason: 'error' }
    } finally {
      setTogglingProductId(null)
    }
  }, [applyWishlist, productIds])

  const value = useMemo(
    () => ({
      items,
      productIds,
      isLoading,
      togglingProductId,
      isWishlisted,
      toggleWishlist,
      reload: loadWishlist,
    }),
    [items, productIds, isLoading, togglingProductId, isWishlisted, toggleWishlist, loadWishlist],
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }

  return context
}
