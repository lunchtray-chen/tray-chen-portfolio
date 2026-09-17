import { useState } from 'react'
import { ApiError } from './api'
import './passwordModal.css'

function errorMessage(error) {
    if (error instanceof ApiError) {
        if (error.status === 401) return 'That password isn\'t right — try again?'
        if (error.status === 429) return 'Too many tries. Give it an hour and come back!'
    }
    // fetch throws the same TypeError for a dead server and a CORS rejection, so the
    // dev hint has to cover both
    if (import.meta.env.DEV) {
        return 'Couldn\'t reach the gate Worker. Is `npm run dev` running in worker/, and is this page\'s origin allowed in ALLOWED_ORIGINS?'
    }
    return 'Couldn\'t reach the server. Check your connection and try again.'
}

/*
 * Password prompt shown in place of a locked project's overlay. Rendered inside the
 * existing .overlay-bg backdrop, so click-outside-to-close and the body scroll lock in
 * overlay.jsx keep working.
 */
function PasswordModal({ project, unlock, setActiveOverlay }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [pending, setPending] = useState(false)

    const onSubmit = async (event) => {
        event.preventDefault()
        if (pending || !password) return
        setPending(true)
        setError(null)
        try {
            await unlock(password)
        } catch (err) {
            setError(errorMessage(err))
            setPassword('')
            setPending(false)
        }
    }

    return (
        <div className='password-modal flex-col' onClick={e => e.stopPropagation()}>
            <button className='password-close' onClick={() => setActiveOverlay(null)}>
                <h3>X</h3>
            </button>

            <h2>This one&rsquo;s locked!</h2>
            <p><strong>{project.name}</strong> is client work under NDA, so it needs a password.
                Email me at gtchen2@stanford.edu and I&rsquo;ll send you one.</p>

            <form className='password-form flex-row' onSubmit={onSubmit}>
                <input
                    type='password'
                    autoFocus
                    autoComplete='current-password'
                    placeholder='Password'
                    value={password}
                    disabled={pending}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type='submit' className='keyword' disabled={pending || !password}>
                    {pending ? 'Checking…' : 'Unlock'}
                </button>
            </form>

            {error && <p className='password-error'>{error}</p>}
        </div>
    )
}

export default PasswordModal
