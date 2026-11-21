export function FloatingField({
  as = "input",
  name,
  label,
  type = "text",
  error,
  autoComplete,
  options,
  required = false,
}: {
  as?: "input" | "select" | "textarea";
  name: string;
  label: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  options?: string[];
  required?: boolean;
}) {
  const describedBy = error ? `${name}-error` : undefined;
  return (
    <label className={`floating-field ${error ? "invalid" : ""}`}>
      <span>{label}</span>
      {as === "select" && (
        <select
          name={name}
          defaultValue=""
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
      {as === "textarea" && (
        <textarea
          name={name}
          rows={5}
          placeholder="Please provide any additional details that will help us understand your project or inquiry"
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      {as === "input" && (
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
        />
      )}
      <i />
      {error && (
        <p className="field-error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </label>
  );
}
