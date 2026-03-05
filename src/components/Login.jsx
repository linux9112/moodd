import { useState } from 'react'

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        // Explicit hardcoded check
        if (username === 'Dindayal' && password === 'Dindayal') {
            onLogin('Dindayal')
        } else if (username === 'Lakshmi' && password === 'Lakshmi') {
            onLogin('Lakshmi')
        } else {
            setError('Invalid username or password')
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen pb-12">
            <div className="text-center mb-10 animate-fade-in w-full">
                <h1 className="text-4xl font-bold text-white mb-2" style={{ letterSpacing: '0.5px' }}>Friend Mood</h1>
                <p className="text-white opacity-90 font-medium text-sm">Share your feelings with your friends</p>
            </div>

            <div className="glass-card w-full animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="glass-input m-0 w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-white text-sm font-semibold mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            className="glass-input m-0 w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-300 text-sm font-medium text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}

                    <button type="submit" className="glass-btn mt-2">
                        Login
                    </button>
                </form>
            </div>

            <p className="text-white/70 text-sm font-medium absolute bottom-8">Made by Motuu for Motki</p>
        </div>
    )
}
