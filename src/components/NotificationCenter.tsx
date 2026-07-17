/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PushNotification } from '../types';
import { Bell, Sparkles, Trophy, TrendingUp, AlertCircle, X, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationCenterProps {
  notifications: PushNotification[];
  toasts: PushNotification[];
  onDismissToast: (id: string) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  theme?: 'light' | 'dark';
}

export default function NotificationCenter({
  notifications,
  toasts,
  onDismissToast,
  onClearAll,
  onMarkAllAsRead,
  theme = 'dark',
}: NotificationCenterProps) {
  const isLight = theme === 'light';

  const bgCard = isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-slate-900/60 border-slate-800 backdrop-blur-md';
  const textTitle = isLight ? 'text-slate-900' : 'text-white';
  const textBody = isLight ? 'text-slate-600' : 'text-slate-400';
  const borderCol = isLight ? 'border-slate-200' : 'border-slate-850';
  const bgBadge = isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-slate-900/80';

  return (
    <>
      {/* 1. FLOATING TOASTS (Top Right - Live Simulation Push Alerts) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none" id="notification_toasts">
        <AnimatePresence>
          {toasts.map((t) => {
            let colorClasses = isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white';
            let Icon = Bell;

            if (t.type === 'wicket') {
              colorClasses = isLight ? 'bg-red-50 border-red-200 text-red-800' : 'bg-red-950/90 border-red-500/30 text-red-200';
              Icon = AlertCircle;
            } else if (t.type === 'boundary') {
              colorClasses = isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200';
              Icon = Sparkles;
            } else if (t.type === 'milestone') {
              colorClasses = isLight ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-amber-950/90 border-amber-500/30 text-amber-200';
              Icon = Trophy;
            } else if (t.type === 'trend') {
              colorClasses = isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-850' : 'bg-indigo-950/90 border-indigo-500/30 text-indigo-200';
              Icon = TrendingUp;
            }

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto border rounded-xl p-4 shadow-xl flex items-start gap-3 backdrop-blur-md relative ${colorClasses}`}
              >
                <div className="p-1.5 bg-black/10 rounded-lg shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-grow pr-4">
                  <h4 className="font-display font-semibold text-xs leading-none tracking-wide">{t.title}</h4>
                  <p className="text-[10px] opacity-90 mt-1 leading-normal font-sans">{t.message}</p>
                </div>
                <button
                  onClick={() => onDismissToast(t.id)}
                  className={`absolute top-2 right-2 shrink-0 cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'}`}
                >
                  <X size={12} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 2. MAIN DRAWER / LISTING INSIDE SIDEBAR */}
      <div className={`border rounded-2xl p-5 flex flex-col h-full ${bgCard}`} id="alerts_archive">
        <div className="flex justify-between items-center mb-4 border-b border-slate-850 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-emerald-500" />
            <h3 className={`text-sm font-display font-semibold ${textTitle}`}>Simulation Alert Log</h3>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onMarkAllAsRead}
              className={`text-[9px] font-mono transition-colors cursor-pointer ${isLight ? 'text-slate-500 hover:text-emerald-600 font-semibold' : 'text-slate-400 hover:text-white'}`}
              title="Mark all as read"
            >
              Read All
            </button>
            <button
              onClick={onClearAll}
              className="text-[9px] font-mono text-red-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear all alerts"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow space-y-2.5 pr-1 max-h-[180px]">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              let alertBullet = 'bg-slate-700';
              if (n.type === 'wicket') alertBullet = 'bg-red-500';
              if (n.type === 'boundary') alertBullet = 'bg-emerald-500';
              if (n.type === 'milestone') alertBullet = 'bg-amber-500';
              if (n.type === 'trend') alertBullet = 'bg-indigo-500';

              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border transition-all ${bgBadge} ${
                    !n.read ? 'border-l-2 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`font-display font-semibold text-[11px] ${textTitle} flex items-center gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${alertBullet}`} />
                      {n.title}
                    </span>
                    <span className="text-[8px] font-mono text-slate-500">{n.timestamp}</span>
                  </div>
                  <p className={`text-[10px] leading-normal font-sans ${textBody}`}>{n.message}</p>
                </div>
              );
            })
          ) : (
            <div className="h-full py-6 flex flex-col items-center justify-center text-slate-500 text-xs text-center px-4">
              <Bell size={24} className="mb-2 text-slate-400 shrink-0" />
              <span>No simulation push alerts.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
