import React from 'react';
import { ICONS } from '../constants';

const Author: React.FC = () => {
    return (
        <div className="py-16 px-4 max-w-3xl mx-auto">
            <div className="dark:bg-zinc-900/40 bg-white dark:border-zinc-800/40 border-zinc-200 border rounded-2xl p-8 md:p-10">

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/15 shrink-0" aria-hidden="true">
                        <span className="text-3xl font-bold text-white tracking-tight select-none">BR</span>
                    </div>
                    <div className="text-center md:text-left space-y-2.5">
                        <h1 className="text-2xl font-bold dark:text-white text-zinc-900 tracking-tight">Boopathi R</h1>
                        <p className="text-sm text-sky-600 dark:text-sky-400 font-medium">Senior IT Support Executive & Web Developer</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm dark:text-zinc-400 text-zinc-600">
                            <span className="flex items-center gap-1.5"><ICONS.MapPin className="w-3.5 h-3.5" aria-hidden="true" /> Bengaluru, India</span>
                            <a href="mailto:boopathirbk77@gmail.com" className="flex items-center gap-1.5 dark:hover:text-white hover:text-zinc-900 transition-colors"><ICONS.Mail className="w-3.5 h-3.5" aria-hidden="true" /> boopathirbk77@gmail.com</a>
                            <a href="tel:+917395845142" className="flex items-center gap-1.5 dark:hover:text-white hover:text-zinc-900 transition-colors"><ICONS.Phone className="w-3.5 h-3.5" aria-hidden="true" /> +91 7395845142</a>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                            <SocialLink href="https://boopathirbk.github.io/bresume/" icon={<ICONS.Globe className="w-3.5 h-3.5" />} label="Portfolio" />
                            <SocialLink href="https://www.linkedin.com/in/boopathirb" icon={<ICONS.Linkedin className="w-3.5 h-3.5" />} label="LinkedIn" />
                            <SocialLink href="https://github.com/boopathirbk" icon={<ICONS.Github className="w-3.5 h-3.5" />} label="GitHub" />
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    <Section title="Professional Summary">
                        <p className="dark:text-zinc-400 text-zinc-700 text-sm leading-relaxed">
                            A results-oriented Computer Science Engineer specializing in IT support, web development, and cloud administration. I translate user needs into effective technical solutions, lead IT teams, develop lead-generating websites, and leverage advanced AI prompting (Gemini, GPT, Mistral) to solve complex problems.
                        </p>
                    </Section>

                    <Section title="Key Skills">
                        <div className="flex flex-wrap gap-1.5">
                            {['Technical Support', 'IT Administration', 'Microsoft 365', 'Azure', 'Linux', 'Cyber Security', 'Networking'].map(s => <Badge key={s}>{s}</Badge>)}
                            {['WordPress', 'SEO', 'Web Optimization', 'Graphic Design'].map(s => <Badge key={s} color="rose">{s}</Badge>)}
                            {['AI Prompting', 'Gemini', 'GPT', 'Claude', 'Llama'].map(s => <Badge key={s} color="emerald">{s}</Badge>)}
                        </div>
                    </Section>

                    <Section title="Experience">
                        <div className="space-y-5">
                            <ExperienceItem role="Senior IT Support Executive & Web Developer" company="RSJ INSPECTION SERVICE LTD." period="Apr 2024 – Present" location="Bengaluru">
                                <ul className="space-y-1 dark:text-zinc-400 text-zinc-600 text-sm list-none">
                                    <li>• Lead and manage a 4-person IT team</li>
                                    <li>• Design modern websites with robust lead funnels</li>
                                    <li>• Use expert AI prompting for software and content creation</li>
                                    <li>• Create cybersecurity policies and manage access control</li>
                                </ul>
                            </ExperienceItem>
                            <ExperienceItem role="Technical Support Engineer" company="Gamify Studios Co." period="Apr 2023 – Feb 2024" location="Bengaluru">
                                <ul className="space-y-1 dark:text-zinc-400 text-zinc-600 text-sm list-none">
                                    <li>• Provided API and integration support for clients</li>
                                    <li>• Managed technical issues using JIRA and Confluence</li>
                                </ul>
                            </ExperienceItem>
                        </div>
                    </Section>

                    <Section title="Education">
                        <div>
                            <h4 className="dark:text-white text-zinc-900 font-semibold text-sm">B.E. in Computer Science</h4>
                            <p className="dark:text-zinc-400 text-zinc-600 text-sm">Bannari Amman Institute of Technology, Anna University · 2015–2019</p>
                        </div>
                    </Section>

                    <Section title="Certifications">
                        <div className="grid sm:grid-cols-2 gap-2">
                            {['AWS Certified Cloud Practitioner', 'Microsoft Certified: Azure Fundamentals', 'Microsoft 365 Certified: Fundamentals', 'Linux Essentials: 010 (LPI)'].map(cert => (
                                <div key={cert} className="flex items-center gap-2 text-sm dark:text-zinc-300 text-zinc-700 p-2.5 dark:bg-zinc-800/30 bg-zinc-50 rounded-lg border dark:border-zinc-800/30 border-zinc-100">
                                    <ICONS.CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <section className="space-y-3" aria-labelledby={`section-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <h3 id={`section-${title.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold uppercase tracking-wider dark:text-zinc-300 text-zinc-800 border-b dark:border-zinc-800/40 border-zinc-200 pb-2">{title}</h3>
        {children}
    </section>
);

const ExperienceItem = ({ role, company, period, location, children }: any) => (
    <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline">
            <h4 className="text-sm font-semibold dark:text-white text-zinc-900">{role}</h4>
            <span className="dark:text-zinc-500 text-zinc-500 text-xs font-mono">{period}</span>
        </div>
        <p className="text-sky-600 dark:text-sky-400 text-sm">{company} · {location}</p>
        <div className="pt-1">{children}</div>
    </div>
);

const Badge = ({ children, color = 'sky' }: { children: string, color?: 'sky' | 'rose' | 'emerald' }) => {
    const colors = {
        sky: 'dark:bg-sky-500/10 bg-sky-50 dark:text-sky-400 text-sky-700 dark:border-sky-500/20 border-sky-200',
        rose: 'dark:bg-rose-500/10 bg-rose-50 dark:text-rose-400 text-rose-700 dark:border-rose-500/20 border-rose-200',
        emerald: 'dark:bg-emerald-500/10 bg-emerald-50 dark:text-emerald-400 text-emerald-700 dark:border-emerald-500/20 border-emerald-200',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${colors[color]}`}>
            {children}
        </span>
    );
};

const SocialLink = ({ href, icon, label }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 dark:bg-zinc-800 bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-zinc-200 rounded-lg text-sm dark:text-zinc-300 text-zinc-700 transition-colors border dark:border-zinc-700/50 border-zinc-200" aria-label={`Visit ${label}`}>
        {icon} {label}
    </a>
);

export default Author;
