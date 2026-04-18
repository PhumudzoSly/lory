import * as React from "react";
import { cn } from "@/lib/utils";

interface InlineTextareaProps {
  readonly value: string;
  readonly onChange: (val: string) => void;
  readonly className?: string;
  readonly placeholder?: string;
}

export function InlineTextarea({
  value,
  onChange,
  className,
  placeholder,
}: InlineTextareaProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (internalValue !== value) {
      onChange(internalValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setInternalValue(value);
      setIsEditing(false);
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        autoFocus
        value={internalValue}
        onChange={autoResize}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full bg-transparent border-none outline-none focus:ring-0 p-0 m-0 resize-none overflow-hidden block min-h-15",
          className,
        )}
        onFocus={(e) => {
           e.target.style.height = "auto";
           e.target.style.height = e.target.scrollHeight + "px";
        }}
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
        "cursor-text hover:bg-secondary/30 rounded px-1 -mx-1 border border-transparent transition-colors w-full text-left whitespace-pre-wrap block",
        !value && "text-muted-foreground/40 italic",
        className,
      )}
    >
      {value || placeholder || "Add a more detailed description..."}
    </button>
  );
}
