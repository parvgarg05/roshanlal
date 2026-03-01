'use client';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ iconOnly = false }: { iconOnly?: boolean }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh(); // Clear server component caches
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 w-full text-maroon-300 hover:text-saffron-400 transition-colors ${iconOnly ? 'p-2' : 'px-3 py-2.5 bg-maroon-950/50 rounded-lg hover:bg-maroon-950'
                }`}
            title="Log out"
        >
            <LogOut size={18} />
            {!iconOnly && <span className="font-medium text-sm">Log out</span>}
        </button>
    );
}
