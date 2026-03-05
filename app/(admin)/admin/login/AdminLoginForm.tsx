'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginForm() {
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const from = searchParams?.get('from') || '/admin';
                window.location.assign(from);
                return;
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Invalid credentials');
            }
        } catch {
            setError('Something went wrong. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center px-4 py-8 bg-cream-50">
            <div className="w-full max-w-md bg-white px-6 py-7 sm:px-8 sm:py-8 rounded-3xl shadow-warm border border-cream-200 text-center">
                <div className="w-12 h-12 bg-maroon-100 text-maroon-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock size={22} />
                </div>

                <h1 className="font-display font-bold text-2xl sm:text-[28px] text-maroon-900 mb-2">Admin Login</h1>
                <p className="text-sm text-maroon-500 mb-7">Enter your credentials to access the L.Roshanlal Ji Sweets dashboard.</p>

                <form onSubmit={handleLogin} className="space-y-5 text-left">
                    <Input
                        type="text"
                        label="Username"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <Input
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        rightElement={(
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                disabled={isLoading}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                className="text-maroon-500 hover:text-maroon-700 disabled:opacity-50"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        )}
                    />

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full mt-1"
                        loading={isLoading}
                    >
                        <span className={isLoading ? 'animate-pulse' : ''}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </span>
                    </Button>

                    <p className="text-xs text-center text-maroon-400 pt-1">
                        Authorized admins only
                    </p>
                </form>
            </div>
        </div>
    );
}
