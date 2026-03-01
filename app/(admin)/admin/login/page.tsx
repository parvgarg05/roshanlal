import { Suspense } from 'react';
import AdminLoginForm from './AdminLoginForm';

export const dynamic = 'force-dynamic';

export default function AdminLogin() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-4 bg-cream-50" />}>
            <AdminLoginForm />
        </Suspense>
    );
}
