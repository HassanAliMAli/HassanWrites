import React, { useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToastContext } from './toast-context';
import './Toast.css';

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(({ title, description, type = 'default', duration = 5000 }) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, title, description, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="toast-viewport">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onDismiss }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-success" />,
        error: <AlertCircle size={20} className="text-error" />,
        info: <Info size={20} className="text-primary" />,
        default: null
    };

    return (
        <div className={cn('toast', `toast--${toast.type}`)}>
            <div className="toast-icon">{icons[toast.type]}</div>
            <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                {toast.description && <div className="toast-description">{toast.description}</div>}
            </div>
            <button onClick={onDismiss} className="toast-close">
                <X size={16} />
            </button>
        </div>
    );
};
