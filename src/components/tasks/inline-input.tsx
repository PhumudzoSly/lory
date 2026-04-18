import * as React from "react";
import { cn } from "@/lib/utils";

interface InlineInputProps {
  readonly value: string;
  readonly onChange: (val: string) => void;
  readonly className?: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
}

export function InlineInput({
  value,
  onChange,
  className,
  placeholder,
  autoFocus,
}: InlineInputProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onChange(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full bg-transparent border-none outline-none focus:ring-0 p-0 m-0",
          className,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={cn(
        "cursor-text hover:bg-secondary/30 rounded px-1 -mx-1 border border-transparent transition-colors line-clamp-1 inline-block text-left w-full",
        !value && "text-muted-foreground/40 italic",
        className,
      )}
    >
      {value || placeholder || "Empty"}
    </button>
  );
}
