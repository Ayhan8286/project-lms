"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Trophy, Video, CheckCircle, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useLanguage } from "@/lib/i18n/context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50/0 to-slate-50/0 dark:from-emerald-900/20 dark:via-slate-950/0 dark:to-slate-950/0" />

        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 mb-8 backdrop-blur-sm">
            <Star className="mr-2 h-4 w-4 fill-emerald-600 text-emerald-600" />
            {t("hero.badge")}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 drop-shadow-sm">
            {t("hero.title.prefix")} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Al Huda Network
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search">
              <Button size="lg" className="h-12 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 rounded-full shadow-lg shadow-emerald-900/20 transition-all hover:scale-105">
                {t("hero.browse")}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition-all">
                {t("hero.dashboard")} <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: t("stats.students"), value: "10k+", icon: Users },
              { label: t("stats.courses"), value: "500+", icon: Video },
              { label: t("stats.mentors"), value: "50+", icon: Trophy },
              { label: t("stats.completion"), value: "95%", icon: CheckCircle },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3 text-emerald-600 dark:text-emerald-400">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("features.title")}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t("feat.live.title"),
                description: t("feat.live.desc"),
                icon: Video,
                color: "bg-blue-500"
              },
              {
                title: t("feat.curr.title"),
                description: t("feat.curr.desc"),
                icon: BookOpen,
                color: "bg-emerald-500"
              },
              {
                title: t("feat.prog.title"),
                description: t("feat.prog.desc"),
                icon: Trophy,
                color: "bg-purple-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Al Huda Network</h3>
              <p className="max-w-sm mb-6">{t("footer.slogan")}</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.platform")}</h4>
              <ul className="space-y-2">
                <li><Link href="/search" className="hover:text-emerald-400 transition">{t("hero.browse")}</Link></li>
                <li><Link href="/login-options" className="hover:text-emerald-400 transition">{t("nav.login")}</Link></li>
                <li><Link href="/teacher/courses" className="hover:text-emerald-400 transition">Become a Teacher</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-emerald-400 transition">{t("footer.privacy")}</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition">{t("footer.terms")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            © {new Date().getFullYear()} {t("footer.rights")}
          </div>
        </div>
      </footer>

    </div>
  );
}
