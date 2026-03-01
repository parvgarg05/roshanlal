'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from './actions';

interface DeleteProductButtonProps {
    id: string;
    name: string;
}

export default function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        const confirmed = window.confirm(`Delete product "${name}"? This cannot be undone.`);
        if (!confirmed) return;

        startTransition(async () => {
            await deleteProduct(id);
        });
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
            <Trash2 size={14} />
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    );
}
