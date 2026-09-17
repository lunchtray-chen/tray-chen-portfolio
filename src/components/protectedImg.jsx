import { useState, useEffect } from 'react'
import { fetchAsset } from './api'
import './passwordModal.css'

/*
 * Renders an image that only exists behind the password gate. Fetched with the token in
 * an Authorization header and displayed from a blob: URL, so the image never has a
 * public address and the token never lands in one.
 */
function ProtectedImg({ assetKey, token, className }) {
    // tagged with the key it belongs to, so a changed key reads as "not loaded yet"
    // rather than briefly showing the previous image
    const [result, setResult] = useState(null)

    useEffect(() => {
        let objectUrl = null
        let cancelled = false

        fetchAsset(assetKey, token)
            .then(url => {
                objectUrl = url
                if (cancelled) URL.revokeObjectURL(url)
                else setResult({ assetKey, url })
            })
            .catch(() => { if (!cancelled) setResult({ assetKey, failed: true }) })

        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [assetKey, token])

    const current = result?.assetKey === assetKey ? result : null

    if (!current) return <div className={`protected-img-placeholder loading ${className || ''}`} />
    if (current.failed) return <div className={`protected-img-placeholder ${className || ''}`} />
    return <img src={current.url} className={className} />
}

export default ProtectedImg
