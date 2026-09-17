import React, { useState } from 'react';
import {
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Coffee,
  AlertCircle,
  Timer
} from 'lucide-react';
import { WorkingDaysConfig, DayOfWeek, WorkingDayRule } from '../../types';

interface WorkingDaysTabProps {
  workingDays: WorkingDaysConfig;
  onSaveWorkingDays: (updated: Partial<WorkingDaysConfig>) => Promise<boolean>;
}

export const WorkingDaysTab: React.FC<WorkingDaysTabProps> = ({
  workingDays,
  onSaveWorkingDays,
}) => {
  const [formData, setFormData] = useState<WorkingDaysConfig>({ ...workingDays });
  const [isSaving, setIsSaving] = useState(false);

  const dayNames: { key: DayOfWeek; label: string }[] = [
    { key: 'MONDAY', label: 'Monday' },
    { key: 'TUESDAY', label: 'Tuesday' },
    { key: 'WEDNESDAY', label: 'Wednesday' },
    { key: 'THURSDAY', label: 'Thursday' },
    { key: 'FRIDAY', label: 'Friday' },
    { key: 'SATURDAY', label: 'Saturday' },
    { key: 'SUNDAY', label: 'Sunday' },
  ];

  const handleToggleWorkingDay = (dayKey: DayOfWeek) => {
    const updated = formData.weeklySchedule.map((d) => {
      if (d.day === dayKey) {
        const nextIsWorking = !d.isWorkingDay;
        return {
          ...d,
          isWorkingDay: nextIsWorking,
          standardHours: nextIsWorking ? (d.standardHours > 0 ? d.standardHours : 8) : 0,
        };
      }
      return d;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updated }));
  };

  const handleToggleHalfDay = (dayKey: DayOfWeek) => {
    const updated = formData.weeklySchedule.map((d) => {
      if (d.day === dayKey) {
        const nextHalf = !d.isHalfDay;
        return {
          ...d,
          isHalfDay: nextHalf,
          standardHours: nextHalf ? 4 : 8,
        };
      }
      return d;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updated }));
  };

  const handleHoursChange = (dayKey: DayOfWeek, hours: number) => {
    const updated = formData.weeklySchedule.map((d) => {
      if (d.day === dayKey) {
        return { ...d, standardHours: hours };
      }
      return d;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updated }));
  };

  const handleSaturdayRuleChange = (rule: WorkingDayRule['alternateWeekRule']) => {
    const updated = formData.weeklySchedule.map((d) => {
      if (d.day === 'SATURDAY') {
        return {
          ...d,
          alternateWeekRule: rule,
          isWorkingDay: rule === 'ALL' || rule === 'ALTERNATE_2_4' || rule === 'ALTERNATE_1_3',
        };
      }
      return d;
    });
    setFormData((prev) => ({ ...prev, weeklySchedule: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveWorkingDays(formData);
    setIsSaving(false);
  };

  const totalWeeklyHours = formData.weeklySchedule.reduce(
    (acc, cur) => acc + (cur.isWorkingDay ? cur.standardHours : 0),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#1b1b1d]">Weekly Working Days & Shifts</h2>
          <p className="text-[13px] text-[#505f76] mt-0.5">
            Define organizational work schedules, standard hours, Saturday policies, and late grace periods.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...workingDays })}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c6c6cd] text-[#1b1b1d] rounded-xl text-[13px] font-semibold hover:bg-[#f6f3f5]"
          >
            <RotateCcw className="w-4 h-4 text-[#76777d]" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-[#131b2e] text-white rounded-xl text-[13px] font-semibold hover:bg-[#131b2e]/90 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Work Schedule'}</span>
          </button>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#c6c6cd]/40">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#131b2e]" />
            <h3 className="text-[16px] font-bold text-[#1b1b1d]">Weekly Shift Calendar</h3>
          </div>
          <div className="text-[13px] font-semibold px-3 py-1 bg-[#dae2fd] text-[#131b2e] rounded-full">
            Total Working Hours: {totalWeeklyHours} hrs / week
          </div>
        </div>

        <div className="space-y-3">
          {dayNames.map(({ key, label }) => {
            const dayConfig =
              formData.weeklySchedule.find((d) => d.day === key) || {
                day: key,
                isWorkingDay: false,
                isHalfDay: false,
                standardHours: 0,
              };

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  dayConfig.isWorkingDay
                    ? 'bg-[#fcf8fa] border-[#c6c6cd]/80'
                    : 'bg-[#f6f3f5]/50 border-transparent text-[#76777d]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-[140px]">
                  <input
                    type="checkbox"
                    id={`toggle-day-${key}`}
                    checked={dayConfig.isWorkingDay}
                    onChange={() => handleToggleWorkingDay(key)}
                    className="w-5 h-5 rounded border-[#c6c6cd] text-[#131b2e] focus:ring-[#131b2e]"
                  />
                  <label
                    htmlFor={`toggle-day-${key}`}
                    className={`font-bold text-[14.5px] cursor-pointer ${
                      dayConfig.isWorkingDay ? 'text-[#1b1b1d]' : 'text-[#76777d] line-through'
                    }`}
                  >
                    {label}
                  </label>
                </div>

                {dayConfig.isWorkingDay ? (
                  <div className="flex flex-wrap items-center gap-4 text-[13px]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayConfig.isHalfDay}
                        onChange={() => handleToggleHalfDay(key)}
                        className="w-4 h-4 rounded text-[#131b2e]"
                      />
                      <span>Half Day</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span>Standard Hours:</span>
                      <input
                        type="number"
                        min={1}
                        max={16}
                        step={0.5}
                        value={dayConfig.standardHours}
                        onChange={(e) => handleHoursChange(key, Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg border border-[#c6c6cd] text-center font-bold bg-white"
                      />
                      <span className="text-[#505f76]">hrs</span>
                    </div>

                    {key === 'SATURDAY' && (
                      <div className="flex items-center gap-2">
                        <span className="text-[#505f76]">Saturday Rule:</span>
                        <select
                          value={dayConfig.alternateWeekRule || 'NONE'}
                          onChange={(e) =>
                            handleSaturdayRuleChange(
                              e.target.value as WorkingDayRule['alternateWeekRule']
                            )
                          }
                          className="px-2 py-1 rounded-lg border border-[#c6c6cd] bg-white text-[12.5px]"
                        >
                          <option value="NONE">Standard Weekly (All Off)</option>
                          <option value="ALL">All Saturdays Working</option>
                          <option value="ALTERNATE_2_4">2nd & 4th Saturday Off</option>
                          <option value="ALTERNATE_1_3">1st & 3rd Saturday Off</option>
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[12.5px] font-semibold text-[#76777d] bg-[#f6f3f5] px-3 py-1 rounded-full">
                    Weekly Off Day
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Default Timings and Grace Period */}
      <div className="bg-white border border-[#c6c6cd]/60 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#c6c6cd]/40">
          <Timer className="w-5 h-5 text-[#131b2e]" />
          <h3 className="text-[16px] font-bold text-[#1b1b1d]">Shift Timings & Attendance Rules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Default Shift Start Time
            </label>
            <input
              type="time"
              value={formData.defaultShiftStartTime}
              onChange={(e) =>
                setFormData({ ...formData, defaultShiftStartTime: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Default Shift End Time
            </label>
            <input
              type="time"
              value={formData.defaultShiftEndTime}
              onChange={(e) => setFormData({ ...formData, defaultShiftEndTime: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Lunch / Break Duration
            </label>
            <select
              value={formData.breakDurationMinutes}
              onChange={(e) =>
                setFormData({ ...formData, breakDurationMinutes: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes (Standard)</option>
              <option value={90}>90 Minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-[12.5px] font-bold text-[#1b1b1d] mb-1.5">
              Arrival Grace Period
            </label>
            <select
              value={formData.gracePeriodMinutes}
              onChange={(e) =>
                setFormData({ ...formData, gracePeriodMinutes: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2 rounded-xl border border-[#c6c6cd] text-[13.5px] bg-[#fcf8fa] focus:bg-white focus:outline-none"
            >
              <option value={0}>0 Minutes (Strict)</option>
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes (Standard)</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};
