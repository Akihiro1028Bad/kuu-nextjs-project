"use client";

import { useRouter } from "next/navigation";

type ModalProps = {
    show: boolean;
    okRedirectPath: string;
    title: string;
    message: string;
};

export default function Modal({
    show,
    okRedirectPath,
    title,
    message,
}: ModalProps) {
    const router = useRouter();

    if (!show) return null;

    const handleOk = () => {
        router.push(okRedirectPath);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center space-y-4">
                <h2 className="text-lg font-bold text-green-600">{title}</h2>
                <p className="text-sm text-gray-700">{message}</p>
                <button
                    onClick={handleOk}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
}
