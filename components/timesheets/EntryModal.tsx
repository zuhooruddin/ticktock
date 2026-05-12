'use client';

import { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { EntryFormData, TimesheetEntry } from '@/types';
import { PROJECTS, WORK_TYPES } from '@/lib/mock-data';

interface EntryModalProps {
  mode: 'add' | 'edit';
  day: string;
  entry?: TimesheetEntry;
  onSave: (day: string, data: EntryFormData, entryId?: number) => Promise<void>;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof EntryFormData, string>>;

// Custom dropdown — renders list in-document so it never overflows the modal
function Dropdown({
  value, onChange, options, placeholder, error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const inputCls =
    'w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-left flex items-center justify-between ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 ' +
    (error ? 'border-red-400' : 'border-gray-300');

  return (
    <div ref={ref} className="relative">
      <button type="button" className={inputCls} onClick={() => setOpen((o) => !o)}>
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
        <span className="text-gray-400 text-xs ml-2">▾</span>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt}
              onMouseDown={() => { onChange(opt); setOpen(false); }}
              className={
                'px-3 py-2.5 text-sm cursor-pointer ' +
                (opt === value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-900 hover:bg-gray-50')
              }
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function EntryModal({ mode, day, entry, onSave, onClose }: EntryModalProps) {
  const [project,  setProject]  = useState(entry?.project  ?? '');
  const [workType, setWorkType] = useState(entry?.workType ?? '');
  const [desc,     setDesc]     = useState(entry?.description ?? '');
  const [hours,    setHours]    = useState(entry?.hours ?? 12);
  const [errors,   setErrors]   = useState<FormErrors>({});
  const [saving,   setSaving]   = useState(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!project)      e.project  = 'Please select a project';
    if (!workType)     e.workType = 'Please select a work type';
    if (!desc.trim())  e.description = 'Task description is required';
    if (hours < 1 || hours > 24) e.hours = 'Hours must be between 1 and 24';
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(day, { project, workType, description: desc, hours }, entry?.id);
    } finally {
      setSaving(false);
    }
  };

  const labelCls = 'flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5';
  const errCls   = 'text-xs text-red-500 mt-1';

  return (
    <Modal title={mode === 'add' ? 'Add New Entry' : 'Edit Entry'} onClose={onClose}>
      <div className="space-y-4">

        {/* Project */}
        <div className="w-full sm:w-[364px] flex flex-col gap-2">
          <label className={labelCls}>
            <span>Select Project</span>
            <span className="text-red-500">*</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-white" title="The project this work belongs to">
              i
            </span>
          </label>
          <Dropdown
            value={project}
            onChange={(v) => { setProject(v); setErrors((e) => ({ ...e, project: undefined })); }}
            options={PROJECTS}
            placeholder="Project Name"
            error={errors.project}
          />
          {errors.project && <p className={errCls}>{errors.project}</p>}
        </div>

        {/* Work Type */}
        <div className="w-full sm:w-[364px] flex flex-col gap-2">
          <label className={labelCls}>
            <span>Type of Work</span>
            <span className="text-red-500">*</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-white" title="Category of work performed">
              i
            </span>
          </label>
          <Dropdown
            value={workType}
            onChange={(v) => { setWorkType(v); setErrors((e) => ({ ...e, workType: undefined })); }}
            options={WORK_TYPES}
            placeholder="Bug fixes"
            error={errors.workType}
          />
          {errors.workType && <p className={errCls}>{errors.workType}</p>}
        </div>

        {/* Description */}
        <div className="w-full flex flex-col gap-2">
          <label className={labelCls}>
            <span>Task description</span>
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Write text here ..."
            className="w-full h-[160px] px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-none placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-400">A note for extra info</p>
          {errors.description && <p className={errCls}>{errors.description}</p>}
        </div>

        {/* Hours */}
        <div className="w-full sm:w-[364px] flex flex-col gap-2">
          <label className={labelCls}>
            <span>Hours</span>
            <span className="text-red-500">*</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-white">
              i
            </span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHours((h) => Math.max(1, h - 1))}
              className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              −
            </button>
            <div className="w-12 bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-center text-sm font-semibold text-gray-900">
              {hours}
            </div>
            <button
              type="button"
              onClick={() => setHours((h) => Math.min(24, h + 1))}
              className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              +
            </button>
          </div>
          {errors.hours && <p className={errCls}>{errors.hours}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 w-full">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 sm:w-[295px] sm:flex-none h-[37px] bg-blue-600 text-white text-sm font-semibold rounded-lg
                       hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center"
          >
            {saving ? 'Saving…' : mode === 'add' ? 'Add entry' : 'Save changes'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 sm:w-[295px] sm:flex-none h-[34px] text-sm text-gray-700 border border-gray-300 rounded-lg
                       hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
