import React from 'react';
import { ICONS } from '../constants';

const Author: React.FC = () => {
    return (
        <div className="py-12 px-4 max-w-4xl mx-auto">
            <div className="dark:bg-slate-900/80 bg-white dark:border-slate-800 border-slate-200 border rounded-2xl p-8 md:p-12 shadow-2xl dark:shadow-none">

                <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                        <span className="text-5xl font-bold text-white">BR</span>
                    </div>
                    <div className="text-center md:text-left space-y-4">
                        <h1 className="text-4xl font-bold dark:text-white text-slate-900">Boopathi R</h1>
                        <p className="text-xl text-cyan-500 dark:text-cyan-400 font-medium">Senior IT Support Executive & Web Developer</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 dark:text-slate-400 text-slate-600">
                            <span className="flex items-center gap-2"><ICONS.MapPin className="w-4 h-4" /> Bengaluru, KA, India</span>
                            <a href="mailto:boopathirbk77@gmail.com" className="flex items-center gap-2 dark:hover:text-white hover:text-slate-900 transition-colors"><ICONS.Mail className="w-4 h-4" /> boopathirbk77@gmail.com</a>
                            <a href="tel:+917395845142" className="flex items-center gap-2 dark:hover:text-white hover:text-slate-900 transition-colors"><ICONS.Phone className="w-4 h-4" /> +91 7395845142</a>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                            <SocialLink href="https://boopathirbk.github.io/bresume/" icon={<ICONS.Globe className="w-4 h-4" />} label="Portfolio" />
                            <SocialLink href="https://www.linkedin.com/in/boopathirb" icon={<ICONS.Linkedin className="w-4 h-4" />} label="LinkedIn" />
                            <SocialLink href="https://github.com/boopathirbk" icon={<ICONS.Github className="w-4 h-4" />} label="GitHub" />
                        </div>
                    </div>
                </div>

                <div className="space-y-10">
                    <Section title="Professional Summary">
                        <p className="dark:text-slate-300 text-slate-700 leading-relaxed">
                            A results-oriented Computer Science Engineer specializing in IT support, web development, and cloud administration. I excel at translating user needs into effective technical solutions. My background includes leading IT teams, developing lead-generating websites, and using advanced AI prompting (Gemini, GPT, Mistral) to solve complex problems. I am a dedicated and fast-learning professional committed to driving organizational growth.
                        </p>
                    </Section>

                    <Section title="Key Skills">
                        <div className="flex flex-wrap gap-2">
                            {['Technical Support', 'IT Administration', 'Microsoft 365', 'Azure', 'Linux', 'Cyber Security', 'Networking'].map(s => <Badge key={s}>{s}</Badge>)}
                            {['WordPress', 'SEO', 'Web Optimization', 'Graphic Design'].map(s => <Badge key={s} color="pink">{s}</Badge>)}
                            {['AI Prompting', 'Gemini', 'GPT', 'Claude', 'Llama'].map(s => <Badge key={s} color="emerald">{s}</Badge>)}
                        </div>
                    </Section>

                    <Section title="Experience">
                        <ExperienceItem
                            role="Senior IT Support Executive & Web Developer"
                            company="RSJ INSPECTION SERVICE LTD."
                            period="April 2024 – Present"
                            location="Bengaluru, India"
                        >
                            <ul className="list-disc list-inside space-y-1 dark:text-slate-400 text-slate-600 text-sm">
                                <li>Lead and manage a 4-person IT team.</li>
                                <li>Design modern websites focused on creating robust lead funnels.</li>
                                <li>Utilize expert AI prompting for software creation and content.</li>
                                <li>Create cybersecurity policies and manage access control.</li>
                            </ul>
                        </ExperienceItem>

                        <ExperienceItem
                            role="Technical Support Engineer"
                            company="Gamify Studios Co."
                            period="April 2023 – February 2024"
                            location="Bengaluru, India"
                        >
                            <ul className="list-disc list-inside space-y-1 dark:text-slate-400 text-slate-600 text-sm">
                                <li>Provided API and integration support for clients.</li>
                                <li>Managed technical issues using JIRA and Confluence.</li>
                            </ul>
                        </ExperienceItem>
                    </Section>

                    <Section title="Education">
                        <div>
                            <h4 className="dark:text-white text-slate-900 font-semibold">Bachelor of Engineering in Computer Science</h4>
                            <p className="dark:text-slate-400 text-slate-600 text-sm">Bannari Amman Institute of Technology, Anna University | 2015 – 2019</p>
                        </div>
                    </Section>

                    <Section title="Certifications">
                        <ul className="space-y-2 dark:text-slate-300 text-slate-700 text-sm">
                            <li>AWS Certified Cloud Practitioner</li>
                            <li>Microsoft Certified: Azure Fundamentals</li>
                            <li>Microsoft 365 Certified: Fundamentals</li>
                            <li>Linux Essentials: 010 (LPI)</li>
                        </ul>
                    </Section>

                </div>
            </div>
        </div>
    );
};

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold dark:text-white text-slate-900 border-b dark:border-slate-800 border-slate-200 pb-2">{title}</h3>
        {children}
    </div>
);

const ExperienceItem = ({ role, company, period, location, children }: any) => (
    <div className="space-y-1">
        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline">
            <h4 className="text-lg font-semibold dark:text-white text-slate-900">{role}</h4>
            <span className="dark:text-slate-500 text-slate-500 text-sm">{period}</span>
        </div>
        <p className="text-cyan-500 dark:text-cyan-400 text-sm">{company} | {location}</p>
        <div className="pt-2">{children}</div>
    </div>
);

const Badge = ({ children, color = 'cyan' }: { children: string, color?: 'cyan' | 'pink' | 'emerald' }) => {
    const colors = {
        cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20',
        pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-300 border-pink-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20',
    };
    return (
        <span className={`px-2.5 py-1 rounded text-xs font-medium border ${colors[color]}`}>
            {children}
        </span>
    );
};

const SocialLink = ({ href, icon, label }: any) => (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 dark:bg-slate-800 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 rounded-lg text-sm dark:text-white text-slate-900 transition-colors">
        {icon} <span>{label}</span>
    </a>
);

export default Author;
