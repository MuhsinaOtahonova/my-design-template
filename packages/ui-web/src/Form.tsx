import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import type { IconName } from "@my-design/tokens";
import { cx } from "./cx";
import { Icon } from "./Icon";
import type { ControlSize } from "./Button";

// ---------------------------------------------------------------------------
// Field: label + control + hint / error. Every control below can take these
// props directly, or be wrapped in <Field> yourself.
// ---------------------------------------------------------------------------
export interface FieldProps {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Extra element on the right of the label, e.g. a "Forgot?" link */
  labelAside?: ReactNode;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, required, optional, labelAside, htmlFor, className, children }: FieldProps) {
  return (
    <div className={cx("md-field", error != null && error !== false && "md-field--invalid", className)}>
      {(label || labelAside) && (
        <div className="md-field__top">
          {label && (
            <label className="md-field__label" htmlFor={htmlFor}>
              {label}
              {required && <span className="md-field__req" aria-hidden> *</span>}
              {optional && <span className="md-field__opt"> (optional)</span>}
            </label>
          )}
          {labelAside}
        </div>
      )}
      {children}
      {error ? (
        <span className="md-field__error" role="alert">
          <Icon name="alert" size={14} /> {error}
        </span>
      ) : (
        hint && <span className="md-field__hint">{hint}</span>
      )}
    </div>
  );
}

type FieldPassThrough = Pick<FieldProps, "label" | "hint" | "error" | "optional" | "labelAside">;

const pickField = ({ label, hint, error, optional, labelAside }: FieldPassThrough) => ({ label, hint, error, optional, labelAside });
const hasField = (p: FieldPassThrough) => p.label != null || p.hint != null || p.error != null;

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">, FieldPassThrough {
  size?: ControlSize;
  icon?: IconName;
  /** Text or element inside the box, before the value (e.g. "$", "https://") */
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Shows an × button when there is a value */
  clearable?: boolean;
  onClear?: () => void;
}

export function Input({ size = "md", icon, prefix, suffix, clearable, onClear, className, id, required, ...rest }: InputProps) {
  const auto = useId();
  const inputId = id ?? auto;
  const [reveal, setReveal] = useState(false);
  const isPassword = rest.type === "password";
  const { label, hint, error, optional, labelAside, ...inputProps } = rest;
  const control = (
    <div className={cx("md-input", `md-input--${size}`, error && "md-input--invalid", rest.disabled && "md-input--disabled", className)}>
      {icon && <Icon name={icon} size={16} className="md-input__icon" />}
      {prefix && <span className="md-input__affix">{prefix}</span>}
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        {...inputProps}
        type={isPassword && reveal ? "text" : rest.type}
      />
      {clearable && rest.value != null && rest.value !== "" && (
        <button type="button" className="md-input__btn" aria-label="Clear" onClick={onClear}>
          <Icon name="close" size={14} />
        </button>
      )}
      {isPassword && (
        <button type="button" className="md-input__btn" aria-label={reveal ? "Hide password" : "Show password"} onClick={() => setReveal((r) => !r)}>
          <Icon name={reveal ? "eyeOff" : "eye"} size={16} />
        </button>
      )}
      {suffix && <span className="md-input__affix">{suffix}</span>}
    </div>
  );
  return hasField(rest) ? (
    <Field {...pickField({ label, hint, error, optional, labelAside })} required={required} htmlFor={inputId}>
      {control}
    </Field>
  ) : (
    control
  );
}

export function SearchInput({ placeholder = "Search…", shortcut, ...rest }: InputProps & { shortcut?: string }) {
  return <Input type="search" icon="search" placeholder={placeholder} suffix={shortcut && <kbd className="md-kbd">{shortcut}</kbd>} {...rest} />;
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldPassThrough {
  /** Shows "12 / 200" under the box when maxLength is set */
  showCount?: boolean;
}

export function Textarea({ className, id, showCount, required, ...rest }: TextareaProps) {
  const auto = useId();
  const tId = id ?? auto;
  const { label, hint, error, optional, labelAside, ...props } = rest;
  const len = typeof props.value === "string" ? props.value.length : 0;
  return (
    <Field
      {...pickField({ label, hint, error, optional, labelAside })}
      hint={showCount && props.maxLength ? <span className="md-field__count">{hint}<span>{len} / {props.maxLength}</span></span> : hint}
      required={required}
      htmlFor={tId}
    >
      <textarea id={tId} required={required} aria-invalid={error ? true : undefined} className={cx("md-textarea", error && "md-input--invalid", className)} {...props} />
    </Field>
  );
}

// ---------------------------------------------------------------------------
// Select (native, so it works everywhere and on mobile)
// ---------------------------------------------------------------------------
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">, FieldPassThrough {
  options: Array<SelectOption | string>;
  placeholder?: string;
  size?: ControlSize;
}

export function Select({ options, placeholder, size = "md", className, id, required, ...rest }: SelectProps) {
  const auto = useId();
  const sId = id ?? auto;
  const { label, hint, error, optional, labelAside, ...props } = rest;
  const control = (
    <div className={cx("md-select", `md-input--${size}`, error && "md-input--invalid", className)}>
      <select id={sId} required={required} aria-invalid={error ? true : undefined} {...props} defaultValue={props.value == null && props.defaultValue == null && placeholder ? "" : props.defaultValue}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          );
        })}
      </select>
      <Icon name="chevronDown" size={16} className="md-select__chevron" />
    </div>
  );
  return hasField(rest) ? (
    <Field {...pickField({ label, hint, error, optional, labelAside })} required={required} htmlFor={sId}>
      {control}
    </Field>
  ) : (
    control
  );
}

// ---------------------------------------------------------------------------
// Checkbox, Radio, Switch
// ---------------------------------------------------------------------------
export interface CheckProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
}

export function Checkbox({ label, description, indeterminate, className, ...rest }: CheckProps) {
  const ref = useRef<HTMLInputElement>(null);
  if (ref.current) ref.current.indeterminate = !!indeterminate;
  return (
    <label className={cx("md-check", rest.disabled && "md-check--disabled", className)}>
      <input
        ref={(el) => {
          ref.current = el;
          if (el) el.indeterminate = !!indeterminate;
        }}
        type="checkbox"
        className="md-check__box"
        {...rest}
      />
      {(label || description) && (
        <span className="md-check__text">
          {label && <span className="md-check__label">{label}</span>}
          {description && <span className="md-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

const RadioCtx = createContext<{ name: string; value?: string; onChange?: (v: string) => void } | null>(null);

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  label,
  direction = "column",
  children,
}: {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: ReactNode;
  direction?: "row" | "column";
  children: ReactNode;
}) {
  const auto = useId();
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  return (
    <fieldset className="md-radio-group">
      {label && <legend className="md-field__label">{label}</legend>}
      <div className={cx("md-radio-group__items", direction === "row" && "md-radio-group__items--row")}>
        <RadioCtx.Provider value={{ name: name ?? auto, value: current, onChange: (v) => (setInner(v), onChange?.(v)) }}>{children}</RadioCtx.Provider>
      </div>
    </fieldset>
  );
}

export function Radio({ label, description, value, className, ...rest }: Omit<CheckProps, "indeterminate"> & { value: string }) {
  const group = useContext(RadioCtx);
  return (
    <label className={cx("md-check", rest.disabled && "md-check--disabled", className)}>
      <input
        type="radio"
        className="md-check__box md-check__box--radio"
        value={value}
        name={group?.name ?? rest.name}
        checked={group ? group.value === value : rest.checked}
        onChange={(e) => (group?.onChange?.(value), rest.onChange?.(e))}
        {...(({ onChange, checked, name, ...r }) => r)(rest)}
      />
      {(label || description) && (
        <span className="md-check__text">
          {label && <span className="md-check__label">{label}</span>}
          {description && <span className="md-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

export function Switch({ label, description, size = "md", className, ...rest }: Omit<CheckProps, "indeterminate" | "size"> & { size?: "sm" | "md" }) {
  return (
    <label className={cx("md-switch", `md-switch--${size}`, rest.disabled && "md-check--disabled", className)}>
      <input type="checkbox" role="switch" {...rest} />
      <span className="md-switch__track" aria-hidden>
        <span className="md-switch__thumb" />
      </span>
      {(label || description) && (
        <span className="md-check__text">
          {label && <span className="md-check__label">{label}</span>}
          {description && <span className="md-check__desc">{description}</span>}
        </span>
      )}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "defaultValue" | "onChange"> {
  label?: ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  /** Format the value shown next to the label */
  format?: (value: number) => string;
  /** Labels under the track, e.g. ["0", "50", "100"] */
  marks?: string[];
}

export function Slider({ label, value, defaultValue = 50, min = 0, max = 100, step = 1, onChange, format = String, marks, className, ...rest }: SliderProps) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const pct = ((v - min) / (max - min)) * 100;
  const id = useId();
  return (
    <div className={cx("md-slider", className)}>
      {label && (
        <div className="md-field__top">
          <label className="md-field__label" htmlFor={id}>{label}</label>
          <span className="md-slider__value">{format(v)}</span>
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        style={{ ["--md-pct" as string]: `${pct}%` }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const n = Number(e.target.value);
          setInner(n);
          onChange?.(n);
        }}
        {...rest}
      />
      {marks && (
        <div className="md-slider__marks" aria-hidden>
          {marks.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Two-thumb slider for ranges such as prices or dates. */
export function RangeSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [20, 80],
  onChange,
  format = String,
}: {
  label?: ReactNode;
  min?: number;
  max?: number;
  step?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (v: [number, number]) => void;
  format?: (v: number) => string;
}) {
  const [inner, setInner] = useState<[number, number]>(defaultValue);
  const [a, b] = value ?? inner;
  const set = (next: [number, number]) => (setInner(next), onChange?.(next));
  const p = (n: number) => ((n - min) / (max - min)) * 100;
  return (
    <div className="md-slider md-slider--range">
      {label && (
        <div className="md-field__top">
          <span className="md-field__label">{label}</span>
          <span className="md-slider__value">{format(a)} – {format(b)}</span>
        </div>
      )}
      <div className="md-range" style={{ ["--md-a" as string]: `${p(a)}%`, ["--md-b" as string]: `${p(b)}%` }}>
        <input type="range" aria-label="Minimum" min={min} max={max} step={step} value={a} onChange={(e) => set([Math.min(Number(e.target.value), b), b])} />
        <input type="range" aria-label="Maximum" min={min} max={max} step={step} value={b} onChange={(e) => set([a, Math.max(Number(e.target.value), a)])} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SegmentedControl
// ---------------------------------------------------------------------------
export function SegmentedControl<T extends string>({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  fullWidth,
  "aria-label": ariaLabel,
}: {
  options: Array<{ value: T; label: ReactNode; icon?: IconName }>;
  value?: T;
  defaultValue?: T;
  onChange?: (v: T) => void;
  size?: "sm" | "md";
  fullWidth?: boolean;
  "aria-label"?: string;
}) {
  const [inner, setInner] = useState<T | undefined>(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const measure = () => {
      const el = root.querySelector<HTMLElement>('[aria-checked="true"]');
      setThumb(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(root);
    return () => ro?.disconnect();
  }, [current, options.length]);
  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx("md-segmented", `md-segmented--${size}`, fullWidth && "md-segmented--full", thumb && "md-segmented--sliding")}
      style={thumb ? ({ "--seg-x": `${thumb.x}px`, "--seg-w": `${thumb.w}px` } as CSSProperties) : undefined}
    >
      {thumb && <span className="md-segmented__thumb" aria-hidden />}
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={current === o.value}
          className="md-segmented__item"
          onClick={() => (setInner(o.value), onChange?.(o.value))}
        >
          {o.icon && <Icon name={o.icon} size={15} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NumberInput (stepper)
// ---------------------------------------------------------------------------
export function NumberInput({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  label,
  hint,
}: {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (v: number) => void;
  label?: ReactNode;
  hint?: ReactNode;
}) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const set = (n: number) => {
    const c = Math.max(min, Math.min(max, n));
    setInner(c);
    onChange?.(c);
  };
  const id = useId();
  return (
    <Field label={label} hint={hint} htmlFor={id}>
      <div className="md-number">
        <button type="button" aria-label="Decrease" onClick={() => set(v - step)} disabled={v <= min}>
          <Icon name="minus" size={16} />
        </button>
        <input id={id} inputMode="numeric" value={v} onChange={(e) => set(Number(e.target.value.replace(/[^\d.-]/g, "")) || 0)} />
        <button type="button" aria-label="Increase" onClick={() => set(v + step)} disabled={v >= max}>
          <Icon name="plus" size={16} />
        </button>
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// PinInput (verification codes)
// ---------------------------------------------------------------------------
export function PinInput({ length = 6, onComplete, label }: { length?: number; onComplete?: (code: string) => void; label?: ReactNode }) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const update = (i: number, d: string) => {
    const next = [...digits];
    next[i] = d.slice(-1);
    setDigits(next);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) onComplete?.(next.join(""));
  };
  return (
    <Field label={label}>
      <div className="md-pin">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            aria-label={`Digit ${i + 1}`}
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={(e) => update(i, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()}
          />
        ))}
      </div>
    </Field>
  );
}

// ---------------------------------------------------------------------------
// FileUpload (drop zone)
// ---------------------------------------------------------------------------
export function FileUpload({
  label,
  hint = "PDF, DOCX or XLSX up to 10 MB",
  accept,
  multiple = true,
  onFiles,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
}) {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const take = (list: FileList | null) => {
    const arr = Array.from(list ?? []);
    setFiles((f) => (multiple ? [...f, ...arr] : arr));
    onFiles?.(arr);
  };
  return (
    <Field label={label}>
      <div
        className={cx("md-dropzone", over && "md-dropzone--over")}
        onDragOver={(e) => (e.preventDefault(), setOver(true))}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => (e.preventDefault(), setOver(false), take(e.dataTransfer.files))}
        onClick={() => input.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
      >
        <span className="md-dropzone__icon"><Icon name="upload" size={20} /></span>
        <span><strong className="md-link">Click to upload</strong> or drag and drop</span>
        <span className="md-field__hint">{hint}</span>
        <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => take(e.target.files)} />
      </div>
      {files.length > 0 && (
        <ul className="md-filelist">
          {files.map((f, i) => (
            <li key={i}>
              <Icon name="file" size={16} />
              <span className="md-truncate">{f.name}</span>
              <span className="md-field__hint">{(f.size / 1024).toFixed(0)} KB</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles((all) => all.filter((_, j) => j !== i))}>
                <Icon name="close" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  );
}
