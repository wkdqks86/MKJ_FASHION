import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getCloudinaryConfig,
  isCloudinaryConfigured,
  loadCloudinaryScript,
} from '@/utils/cloudinary'

export function useCloudinaryWidget({
  onSuccess,
  onBatchSuccess,
  folder = 'mkj-products',
  multiple = false,
  maxFiles = 1,
  croppingAspectRatio = 1,
}) {
  const widgetRef = useRef(null)
  const onSuccessRef = useRef(onSuccess)
  const onBatchSuccessRef = useRef(onBatchSuccess)
  const [isReady, setIsReady] = useState(false)
  const [loadError, setLoadError] = useState('')

  onSuccessRef.current = onSuccess
  onBatchSuccessRef.current = onBatchSuccess

  const { cloudName, uploadPreset } = getCloudinaryConfig()
  const configured = isCloudinaryConfigured()

  useEffect(() => {
    if (!configured) return

    let cancelled = false

    loadCloudinaryScript()
      .then((cloudinary) => {
        if (cancelled) return

        widgetRef.current = cloudinary.createUploadWidget(
          {
            cloudName,
            uploadPreset,
            folder,
            sources: ['local', 'url', 'camera'],
            multiple,
            maxFiles,
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxFileSize: 5_000_000,
            cropping: true,
            croppingAspectRatio,
            showSkipCropButton: true,
            styles: {
              palette: {
                window: '#ffffff',
                sourceBg: '#f4f4f4',
                windowBorder: '#e5e5e5',
                tabIcon: '#111111',
                menuIcons: '#111111',
                link: '#a68b6a',
                action: '#a68b6a',
                inactiveTabIcon: '#888888',
                error: '#c0392b',
                inProgress: '#a68b6a',
                complete: '#1a7f4b',
                textDark: '#111111',
                textLight: '#ffffff',
              },
            },
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error)
              return
            }
            if (result?.event === 'success') {
              onSuccessRef.current?.(result.info.secure_url)
            }
            if (result?.event === 'queues-end' && multiple) {
              const urls = (result?.info?.files || [])
                .map((file) => file?.uploadInfo?.secure_url)
                .filter(Boolean)
              if (urls.length > 0) {
                onBatchSuccessRef.current?.(urls)
              }
            }
          }
        )

        setIsReady(true)
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message || 'Cloudinary 위젯을 불러오지 못했습니다.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [configured, cloudName, uploadPreset, folder, multiple, maxFiles, croppingAspectRatio])

  const openWidget = useCallback(() => {
    widgetRef.current?.open()
  }, [])

  return {
    openWidget,
    isReady,
    isConfigured: configured,
    loadError,
  }
}
