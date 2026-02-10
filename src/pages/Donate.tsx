import React from 'react';
import { ICONS } from '../constants';

const Donate: React.FC = () => {
    return (
        <div className="py-20 px-4 max-w-2xl mx-auto text-center space-y-8">
            <div className="dark:bg-slate-900/50 bg-white dark:border-slate-800 border-slate-200 border rounded-2xl p-12 shadow-lg dark:shadow-none">
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ICONS.Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-pulse" />
                </div>

                <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">Support WinLocksmith</h1>
                <p className="dark:text-slate-400 text-slate-600 mb-8 max-w-md mx-auto">
                    WinLocksmith is free and open source. If this tool saved you time or money, consider buying me a coffee to support future development!
                </p>

                <a
                    href="https://paypal.me/boopathirbk"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0070BA] hover:bg-[#003087] text-white rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-xl shadow-blue-900/30"
                >
                    <ICONS.CreditCard className="w-6 h-6" />
                    Donate via PayPal
                </a>

                <div className="mt-8 pt-8 border-t dark:border-slate-800 border-slate-200 text-sm dark:text-slate-500 text-slate-500">
                    <p>Thank you for your support!</p>
                </div>
            </div>
        </div>
    );
};

export default Donate;
