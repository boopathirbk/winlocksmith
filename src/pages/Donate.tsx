import React from 'react';
import { ICONS } from '../constants';

const Donate: React.FC = () => {
    return (
        <div className="py-20 px-4 max-w-lg mx-auto">
            <div className="relative dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-10 text-center overflow-hidden">

                {/* Glow effect */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

                <div className="relative">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/10" aria-hidden="true">
                        <ICONS.Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
                    </div>

                    <h1 className="text-2xl font-bold dark:text-white text-zinc-900 mb-3 tracking-tight">Support WinLocksmith</h1>
                    <p className="dark:text-zinc-400 text-zinc-600 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                        WinLocksmith is free and open source. If this tool saved you time or money, consider supporting future development.
                    </p>

                    <a
                        href="https://paypal.me/boopathirbk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 px-7 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-sm shadow-lg shadow-black/10 dark:shadow-white/5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        aria-label="Donate via PayPal (opens in new tab)"
                    >
                        <ICONS.CreditCard className="w-4 h-4" aria-hidden="true" />
                        Donate via PayPal
                    </a>

                    <div className="mt-8 pt-6 border-t dark:border-zinc-800/30 border-zinc-200">
                        <p className="text-sm dark:text-zinc-500 text-zinc-500">Thank you for your support <span aria-label="heart">♥</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donate;
