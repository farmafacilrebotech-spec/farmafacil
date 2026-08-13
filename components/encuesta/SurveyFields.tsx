"use client";

import { cn } from "@/lib/utils";

export function FieldError({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-[#c2410c]">
      {message}
    </p>
  );
}

export function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[#1A1A1A]">
      {children}
      {required ? <span className="text-[#1ABBB3]"> *</span> : null}
    </label>
  );
}

/** Contenedor con ancla para scroll al error (incluye etiqueta) */
export function QuestionBlock({
  fieldId,
  className,
  children,
}: {
  fieldId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div data-field={fieldId} className={cn("scroll-mt-24", className)}>
      {children}
    </div>
  );
}

const controlBase =
  "h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#1A1A1A] outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1";

const controlOk =
  "border-gray-200 focus-visible:border-[#1ABBB3] focus-visible:ring-[#1ABBB3]";
const controlErr =
  "border-[#e07a3d] bg-[#fff8f3] focus-visible:border-[#c2410c] focus-visible:ring-[#e07a3d]/40";

export function TextInput({
  className,
  invalid,
  errorId,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  errorId?: string;
}) {
  return (
    <input
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && errorId ? errorId : undefined}
      className={cn(controlBase, invalid ? controlErr : controlOk, className)}
      {...props}
    />
  );
}

export function TextTextarea({
  className,
  invalid,
  errorId,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  errorId?: string;
}) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && errorId ? errorId : undefined}
      className={cn(
        "min-h-[110px] w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-[#1A1A1A] outline-none transition focus-visible:ring-2 focus-visible:ring-offset-1",
        invalid ? controlErr : controlOk,
        className
      )}
      {...props}
    />
  );
}

export function TextSelect({
  className,
  invalid,
  errorId,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  errorId?: string;
}) {
  return (
    <select
      aria-invalid={invalid || undefined}
      aria-describedby={invalid && errorId ? errorId : undefined}
      className={cn(controlBase, invalid ? controlErr : controlOk, className)}
      {...props}
    >
      {children}
    </select>
  );
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  error,
  errorId,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  errorId?: string;
}) {
  return (
    <div
      className={cn("space-y-2 rounded-xl p-0.5", error && "ring-2 ring-[#e07a3d]/50")}
      role="radiogroup"
      aria-invalid={error ? true : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
    >
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#1ABBB3]",
            value === option
              ? "border-[#1ABBB3] bg-[#1ABBB3]/5"
              : "border-gray-200 bg-white hover:border-[#1ABBB3]/40"
          )}
        >
          <input
            type="radio"
            name={name}
            className="mt-0.5 accent-[#1ABBB3]"
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <span className="text-[#1A1A1A]">{option}</span>
        </label>
      ))}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function CheckboxGroup({
  options,
  values,
  onChange,
  error,
  errorId,
  max,
}: {
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
  errorId?: string;
  max?: number;
}) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
      return;
    }
    if (max && values.length >= max) return;
    onChange([...values, option]);
  };

  return (
    <div
      className={cn("space-y-2 rounded-xl p-0.5", error && "ring-2 ring-[#e07a3d]/50")}
      role="group"
      aria-invalid={error ? true : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
    >
      {max ? (
        <p className="text-xs text-gray-500">
          {values.length >= max
            ? `Puedes seleccionar un máximo de ${max} opciones.`
            : `Selecciona exactamente ${max} opciones.`}
        </p>
      ) : null}
      {options.map((option) => {
        const checked = values.includes(option);
        const disabled = Boolean(max && !checked && values.length >= max);
        return (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-[#1ABBB3]",
              checked
                ? "border-[#1ABBB3] bg-[#1ABBB3]/5"
                : "border-gray-200 bg-white hover:border-[#1ABBB3]/40",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              type="checkbox"
              className="mt-0.5 accent-[#1ABBB3]"
              checked={checked}
              disabled={disabled}
              onChange={() => toggle(option)}
            />
            <span className="text-[#1A1A1A]">{option}</span>
          </label>
        );
      })}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

export function ScaleInput({
  label,
  value,
  onChange,
  error,
  fieldId,
}: {
  label: string;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  fieldId?: string;
}) {
  const errorId = fieldId ? `${fieldId}-error` : undefined;
  return (
    <fieldset
      data-field={fieldId}
      className={cn(
        "scroll-mt-24 rounded-xl border bg-[#F7F9FA] p-4",
        error ? "border-[#e07a3d] ring-2 ring-[#e07a3d]/30" : "border-gray-100"
      )}
      aria-invalid={error ? true : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
    >
      <legend className="px-1 text-sm font-medium text-[#1A1A1A]">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "h-10 w-10 rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABBB3] focus-visible:ring-offset-2",
              value === n
                ? "bg-[#1ABBB3] text-white"
                : "bg-white text-[#1A1A1A] ring-1 ring-gray-200 hover:ring-[#1ABBB3]"
            )}
            aria-label={`Valoración ${n} de 5`}
            aria-pressed={value === n}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">1 = poca utilidad · 5 = mucha utilidad</p>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
