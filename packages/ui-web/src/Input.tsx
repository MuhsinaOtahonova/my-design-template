import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ label, className, id, ...rest }, ref) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label className={cx("md-field", className)} htmlFor={inputId}>
      {label && <span className="md-field__label">{label}</span>}
      <input ref={ref} id={inputId} className="md-input" {...rest} />
    </label>
  );
});
