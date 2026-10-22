import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Calendar as CalendarIcon, Clock, MapPin, User, Camera, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export const BookingCalendar: React.FC = () => {
  const { shoots, clients } = useStudio();
  const [filterMonth, setFilterMonth] = useState('2026-04');

  const getClient = (clientId: string) => clients.find((c) => c.id === clientId);

  // Sort shoots chronologically
  const sortedShoots = [...shoots].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-500" />
            <span>Studio Production Schedule &amp; Calendar</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Track client shoot dates, venue logistics, crew assignments, and gear readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs">
          <span className="px-2 text-neutral-400 font-mono">Season: Spring / Summer 2026</span>
        </div>
      </div>

      {/* Shoots Timeline Cards */}
      <div className="space-y-4">
        {sortedShoots.map((shoot) => {
          const client = getClient(shoot.clientId);
          const dateObj = new Date(shoot.eventDate);
          const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
          const dayNumber = dateObj.getDate();
          const dayName = dateObj.toLocaleString('en-US', { weekday: 'short' });

          return (
            <div
              key={shoot.id}
              className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              {/* Left: Date Badge */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center text-center shrink-0">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    {monthName}
                  </span>
                  <span className="text-xl font-black text-white font-mono tabular-nums leading-none my-0.5">
                    {dayNumber}
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase font-mono">
                    {dayName}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{shoot.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-medium">
                      {shoot.type}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    Client: <span className="text-neutral-200 font-medium">{client?.name}</span> ({client?.phone})
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500/80" />
                      <span>{shoot.venue}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-500/80" />
                      <span>Lead: {shoot.leadPhotographer}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Crew & Status */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-neutral-800">
                <div className="text-xs text-neutral-400">
                  <span className="text-[10px] text-neutral-500 block uppercase">Crew Allocated:</span>
                  <div className="text-neutral-300 font-medium">
                    {shoot.crewMembers.length > 0 ? shoot.crewMembers.join(', ') : 'Standard Studio Unit'}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {shoot.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
