import { useState, useEffect } from 'react'
import NormalOverlay from './normalOverlay.jsx'
import PasswordModal from './passwordModal.jsx'
import useUnlock from './useUnlock.js'
import { fetchProject } from './api'
import './passwordModal.css'

/*
 * Wraps a password-protected project. Everything the overlay shows — the long
 * description, tools, timeframe and every image — comes from the Worker, so none of it
 * is in the site bundle. The card's public fields (name, keywords, short description)
 * are merged underneath so NormalOverlay gets the shape it already expects.
 */
function LockedOverlay({ project, setActiveOverlay }) {
    const { token, unlock, clearToken } = useUnlock()
    // tagged with the token it was fetched under, so a fresh unlock after a failure
    // doesn't momentarily show the stale result
    const [result, setResult] = useState(null)

    useEffect(() => {
        if (!token) return

        let cancelled = false

        fetchProject(project.slug, token)
            .then(data => { if (!cancelled) setResult({ token, data }) })
            .catch(err => {
                if (cancelled) return
                // an expired or tampered token means: forget it and ask again
                if (err.status === 401) clearToken()
                else setResult({ token, failed: true })
            })

        return () => { cancelled = true }
    }, [token, project.slug, clearToken])

    if (!token) {
        return <PasswordModal project={project} unlock={unlock} setActiveOverlay={setActiveOverlay} />
    }

    const current = result?.token === token ? result : null

    if (current?.failed) {
        return (
            <div className='overlay-status flex-col' onClick={e => e.stopPropagation()}>
                <h2>Something went wrong</h2>
                <p>Couldn&rsquo;t load this project right now. Try closing and reopening it.</p>
            </div>
        )
    }

    if (!current) {
        return (
            <div className='overlay-status flex-col' onClick={e => e.stopPropagation()}>
                <h2>Unlocking…</h2>
            </div>
        )
    }

    return (
        <NormalOverlay
            project={{ ...project, ...current.data }}
            setActiveOverlay={setActiveOverlay}
            token={token}
        />
    )
}

export default LockedOverlay
