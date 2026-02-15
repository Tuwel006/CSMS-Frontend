import { useAuthContexxt } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import {
    Mail,
    Shield,
    Key,
    Clock,
    Activity,
    ShieldCheck,
    Smartphone,
    MapPin,
    Calendar
} from 'lucide-react';

const Profile = () => {
    const { user } = useAuthContexxt();
    useTheme();

    const stats = [
        { label: 'Security Score', value: '98%', icon: <ShieldCheck size={14} />, color: 'text-green-500' },
        { label: 'Active Sessions', value: '2', icon: <Smartphone size={14} />, color: 'text-cyan-500' },
        { label: 'Last Login', value: '2m ago', icon: <Clock size={14} />, color: 'text-indigo-400' },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 pb-6 border-b border-[var(--card-border)]">
                <div className="relative group">
                    <div className="w-24 h-24 bg-cyan-600 rounded-xs flex items-center justify-center font-black text-white text-4xl shadow-2xl shadow-cyan-900/20 border-2 border-white/10">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xs border-4 border-[var(--bg)] flex items-center justify-center shadow-lg">
                        <Activity size={14} className="text-white" />
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-[var(--text)] uppercase tracking-tight font-outfit leading-none">
                            {user?.email?.split('@')[0]}
                        </h1 >
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase tracking-widest border border-cyan-500/20 rounded-xs">
                            Administrator
                        </span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-70">
                        System Identity & Access Management
                    </p>
                </div>

                <div className="flex gap-2">
                    {stats.map((stat, i) => (
                        <div key={i} className={cn(
                            "px-4 py-2 border rounded-xs flex items-center gap-3",
                            "bg-[var(--card-bg)] border-[var(--card-border)] shadow-sm"
                        )}>
                            <div className={stat.color}>{stat.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-[7px] font-black uppercase tracking-widest text-[var(--text-secondary)] opacity-50">{stat.label}</span>
                                <span className="text-[11px] font-black text-[var(--text)] leading-none">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Personal Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className={cn(
                        "rounded-xs border overflow-hidden",
                        "bg-[var(--card-bg)] border-[var(--card-border)] shadow-sm"
                    )}>
                        <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--bg)] flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text)]">Core Identity Data</h3>
                            <button className="text-[8px] font-black uppercase tracking-widest text-cyan-500 hover:text-cyan-400 transition-colors">Update Profile</button>
                        </div>

                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                            {[
                                { label: 'Primary Email', value: user?.email, icon: <Mail size={14} /> },
                                { label: 'Access Role', value: 'System Super Admin', icon: <Shield size={14} /> },
                                { label: 'Network Location', value: 'Bangalore, IN', icon: <MapPin size={14} /> },
                                { label: 'Member Since', value: 'Jan 2024', icon: <Calendar size={14} /> },
                            ].map((field, i) => (
                                <div key={i} className="space-y-1.5 group">
                                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                        <span className="opacity-40 group-hover:text-cyan-500 transition-colors">{field.icon}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50">{field.label}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-[var(--text)] tracking-tight">
                                        {field.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cn(
                        "rounded-xs border overflow-hidden",
                        "bg-[var(--card-bg)] border-[var(--card-border)] shadow-sm"
                    )}>
                        <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--bg)] items-center justify-between flex">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text)]">Security Credentials</h3>
                            <Shield size={14} className="text-cyan-500 opacity-50" />
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xs border border-[var(--card-border)] bg-[var(--bg)]/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xs bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                                        <Key size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text)]">Two-Factor Auth</h4>
                                        <p className="text-[8px] font-bold text-[var(--text-secondary)] opacity-60">Enhanced biometric verification enabled</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 bg-cyan-600 text-white text-[8px] font-black uppercase tracking-widest rounded-xs hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20">Config</button>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xs border border-[var(--card-border)] bg-[var(--bg)]/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xs bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20">
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text)]">Access Keys</h4>
                                        <p className="text-[8px] font-bold text-[var(--text-secondary)] opacity-60">Last rotated: 14 days ago</p>
                                    </div>
                                </div>
                                <button className="px-3 py-1 border border-cyan-600 text-cyan-500 text-[8px] font-black uppercase tracking-widest rounded-xs hover:bg-cyan-600 hover:text-white transition-all">Rotate</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Activity / Logs */}
                <div className="space-y-6">
                    <div className={cn(
                        "rounded-xs border overflow-hidden",
                        "bg-[var(--card-bg)] border-[var(--card-border)] shadow-sm"
                    )}>
                        <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--bg)]">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text)]">Operation Log</h3>
                        </div>
                        <div className="p-2 space-y-1">
                            {[
                                { action: 'Updated Team #42', time: '14:21:05', status: 'Success' },
                                { action: 'Log rotation sequence', time: '11:05:22', status: 'Auto' },
                                { action: 'Dashboard access', time: '09:00:14', status: 'Verified' },
                                { action: 'API Key generation', time: 'Yesterday', status: 'Success' },
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xs hover:bg-[var(--bg)] transition-colors group">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-[var(--text)] group-hover:text-cyan-500 transition-colors uppercase tracking-tight">{log.action}</span>
                                        <span className="text-[7px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-widest">{log.time}</span>
                                    </div>
                                    <span className="text-[6px] font-black uppercase tracking-[0.15em] px-1.5 py-0.5 border border-[var(--card-border)] text-[var(--text-secondary)] rounded-xs">
                                        {log.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-[var(--card-border)] text-center">
                            <button className="text-[8px] font-black uppercase tracking-widest text-cyan-500 opacity-60 hover:opacity-100 transition-opacity">Export Full Access Log</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
