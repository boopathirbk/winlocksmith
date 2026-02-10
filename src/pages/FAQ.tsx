import React from 'react';
import { ICONS } from '../constants';

const FAQ: React.FC = () => {
    return (
        <div className="py-12 px-4 max-w-3xl mx-auto space-y-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
                <p className="text-slate-400">Common questions about WinLocksmith and troubleshooting.</p>
            </div>

            <div className="space-y-6">
                <FAQItem
                    question="How do I completely remove all restrictions?"
                    answer="Run the `Restore_....ps1` script included in your download bundle as Administrator. It will reset Registry Keys, Windows Services, File Permissions, and Power settings to their defaults. A reboot is recommended after restoring."
                    icon={<ICONS.RotateCcw className="w-5 h-5 text-emerald-400" />}
                />

                <FAQItem
                    question="Why does the script script require Administrator privileges?"
                    answer="WinLocksmith modifies System Registry keys (HKLM) and Software Restriction Policies to enforce security. These are protected system areas that only Administrators can modify."
                    icon={<ICONS.ShieldAlert className="w-5 h-5 text-yellow-400" />}
                />

                <FAQItem
                    question="Does this work on Windows Home Edition?"
                    answer="Yes! We detect Windows Home edition and use a special 'Compatibility Mode' that applies restrictions using `ICACLS` (File Permissions) instead of Group Policy, giving you near-Pro level control."
                    icon={<ICONS.CheckCircle2 className="w-5 h-5 text-cyan-400" />}
                />

                <FAQItem
                    question="Is it safe? Does it send data to the cloud?"
                    answer="It is 100% safe and offline. The logic runs entirely in your browser. The generated `.ps1` script is plain text that you can inspect before running. No telemetry or data is sent to us."
                    icon={<ICONS.WifiOff className="w-5 h-5 text-slate-400" />}
                />
            </div>

        </div>
    );
};

const FAQItem = ({ question, answer, icon }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-3">
            {icon} {question}
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm pl-8">
            {answer}
        </p>
    </div>
);

export default FAQ;
