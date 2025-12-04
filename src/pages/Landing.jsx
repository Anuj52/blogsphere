import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Shield, Zap, Users } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden relative selection:bg-indigo-500 selection:text-white">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Globe className="text-white" size={24} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">BlogSphere</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="px-6 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">
                        Log In
                    </Link>
                    <Link to="/login" className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 transition hover:scale-105 flex items-center gap-2">
                        Get Started <ArrowRight size={18} />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-sm font-bold mb-8 border border-indigo-100 dark:border-indigo-500/20 animate-fade-in-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    v2.0 is now live
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                    Where Ideas <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Resonate</span>.
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
                    Join the next generation of social blogging. Connect with tribes, share your story, and build your digital legacy in a premium, ad-free environment.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
                    <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 transition hover:scale-105 flex items-center justify-center gap-2">
                        Start Writing <ArrowRight size={20} />
                    </Link>
                    <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center justify-center">
                        Explore Features
                    </a>
                </div>

                {/* Hero Image / UI Mockup */}
                <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in-up delay-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent z-10 h-full w-full pointer-events-none"></div>
                    <div className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl p-2 md:p-4 rotate-x-12 transform perspective-1000">
                        <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center relative">
                            {/* Abstract UI Representation */}
                            <div className="absolute inset-0 bg-slate-900">
                                <div className="flex h-full">
                                    <div className="w-64 border-r border-white/10 p-4 hidden md:block space-y-4">
                                        <div className="h-8 w-32 bg-white/10 rounded-lg"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-white/5 rounded"></div>
                                            <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                                            <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 space-y-6">
                                        <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10"></div>
                                        <div className="space-y-3">
                                            <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                                            <div className="h-24 bg-white/5 rounded-xl border border-white/5"></div>
                                        </div>
                                    </div>
                                    <div className="w-64 border-l border-white/10 p-4 hidden md:block">
                                        <div className="h-40 bg-white/5 rounded-xl mb-4"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="z-20 text-center">
                                <div className="w-20 h-20 bg-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                                    <Globe className="text-white" size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-white">BlogSphere</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features Grid */}
            <section id="features" className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition hover:-translate-y-1">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                            <Users size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Tribes & Communities</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Find your people. Join private or public tribes to discuss what matters most to you in focused spaces.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition hover:-translate-y-1">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Safe & Secure</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Built with privacy first. Advanced moderation tools and admin features keep the community healthy.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-pink-500/30 transition hover:-translate-y-1">
                        <div className="w-12 h-12 bg-pink-100 dark:bg-pink-500/20 rounded-2xl flex items-center justify-center text-pink-600 dark:text-pink-400 mb-6">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Real-time Interaction</h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Instant notifications, live chat in tribes, and seamless updates. Never miss a beat.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-white/10 py-12 text-center text-slate-500 dark:text-slate-400">
                <p>© 2025 BlogSphere Platform. All rights reserved.</p>
            </footer>
        </div>
    );
}
