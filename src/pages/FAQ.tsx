import React from 'react';
import { ICONS } from '../constants';

const FAQ: React.FC = () => {
    return (
        <div className="py-16 px-4 max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold dark:text-white text-zinc-900 tracking-tight">Frequently Asked Questions</h1>
                <p className="text-sm dark:text-zinc-500 text-zinc-500">Common questions and troubleshooting guides.</p>
            </div>

            <div className="space-y-3">
                <FAQItem
                    question="How do I remove all restrictions?"
                    answer="Run the Restore_....ps1 script included in your download bundle as Administrator. It resets registry keys, services, permissions, and power settings. A reboot is recommended."
                    icon={<ICONS.RotateCcw className="w-4 h-4 text-emerald-400" />}
                />
                <FAQItem
                    question="Why does the script require Administrator privileges?"
                    answer="WinLocksmith modifies System Registry keys (HKLM) and Software Restriction Policies — protected areas that only administrators can access."
                    icon={<ICONS.ShieldAlert className="w-4 h-4 text-amber-400" />}
                />
                <FAQItem
                    question="Does this work on Windows Home Edition?"
                    answer="Yes! We detect Windows Home and use a Compatibility Mode that applies restrictions using ICACLS (file permissions) instead of Group Policy, giving near-Pro level control."
                    icon={<ICONS.CheckCircle2 className="w-4 h-4 text-sky-400" />}
                />
                <FAQItem
                    question="Is it safe? Does it send data to the cloud?"
                    answer="100% safe and offline. The logic runs entirely in your browser. The generated .ps1 script is plain text you can inspect before running. No telemetry is sent."
                    icon={<ICONS.WifiOff className="w-4 h-4 dark:text-zinc-400 text-zinc-500" />}
                />
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer, icon }: any) => (
    <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-xl p-5 transition-all hover:dark:border-zinc-700/60 hover:border-zinc-300">
        <h3 className="text-sm font-semibold dark:text-white text-zinc-900 flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg dark:bg-zinc-800 bg-zinc-100 flex items-center justify-center shrink-0">
                {icon}
            </div>
            {question}
        </h3>
        <p className="dark:text-zinc-500 text-zinc-500 leading-relaxed text-[13px] pl-[38px]">
            {answer}
        </p>
    </div>
);

export default FAQ;
