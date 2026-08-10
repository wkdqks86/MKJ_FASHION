const SCRIPT_URL = 'https://upload-widget.cloudinary.com/global/all.js'

let scriptPromise = null

export function loadCloudinaryScript() {
  if (typeof window !== 'undefined' && window.cloudinary) {
    return Promise.resolve(window.cloudinary)
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`)

      if (existing) {
        existing.addEventListener('load', () => resolve(window.cloudinary))
        existing.addEventListener('error', () => reject(new Error('Cloudinary script load failed')))
        return
      }

      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => resolve(window.cloudinary)
      script.onerror = () => reject(new Error('Cloudinary script load failed'))
      document.body.appendChild(script)
    })
  }

  return scriptPromise
}

export function getCloudinaryConfig() {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  }
}

export function isCloudinaryConfigured() {
  const { cloudName, uploadPreset } = getCloudinaryConfig()
  return Boolean(cloudName && uploadPreset)
}
