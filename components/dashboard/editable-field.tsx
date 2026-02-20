"use client";

import { useState } from "react";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Field config ────────────────────────────────────────────────────────────

export type SelectOption = { value: string; label: string };

export type FieldConfig =
  | { kind: "text"; placeholder?: string }
  | { kind: "textarea"; placeholder?: string }
  | { kind: "select"; options: SelectOption[] }
  | { kind: "boolean"; trueLabel?: string; falseLabel?: string };

// ─── Props ───────────────────────────────────────────────────────────────────

interface EditableFieldProps {
  label: string;
  /** Human-readable string shown in display mode */
  displayValue: string;
  /** Raw value used to seed the edit control */
  currentValue: string | boolean;
  config: FieldConfig;
  onSave: (value: string | boolean) => void;
  isSaving?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EditableField({
  label,
  displayValue,
  currentValue,
  config,
  onSave,
  isSaving = false,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(currentValue));

  const enter = () => {
    setDraft(String(currentValue));
    setIsEditing(true);
  };

  const cancel = () => setIsEditing(false);

  const commit = () => {
    if (config.kind === "boolean") {
      onSave(draft === "true");
    } else {
      onSave(draft);
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-start gap-4 py-3 border-b border-border/50 last:border-0 min-h-[44px]">
      <span className="text-xs text-muted-foreground shrink-0 w-32 pt-1">
        {label}
      </span>

      {isEditing ? (
        <div className="flex flex-1 items-start gap-2">
          <div className="flex-1">
            {config.kind === "text" && (
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={config.placeholder}
                className="h-7 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") commit();
                  if (e.key === "Escape") cancel();
                }}
              />
            )}

            {config.kind === "textarea" && (
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={config.placeholder}
                className="text-xs min-h-24 resize-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancel();
                }}
              />
            )}

            {config.kind === "select" && (
              <Select value={draft} onValueChange={setDraft}>
                <SelectTrigger className="h-7 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {config.kind === "boolean" && (
              <Select value={draft} onValueChange={setDraft}>
                <SelectTrigger className="h-7 text-xs w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false" className="text-xs">
                    {config.falseLabel ?? "No"}
                  </SelectItem>
                  <SelectItem value="true" className="text-xs">
                    {config.trueLabel ?? "Yes"}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={commit}
              disabled={isSaving}
              aria-label="Save"
              className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/40"
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={cancel}
              disabled={isSaving}
              aria-label="Cancel"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={enter}
          className="group/value flex flex-1 items-start justify-between gap-2 text-left"
          aria-label={`Edit ${label}`}
        >
          <span
            className={cn(
              "text-xs font-medium flex-1 text-right",
              !displayValue && "text-muted-foreground italic",
            )}
          >
            {displayValue || "Not set"}
          </span>
          <Pencil className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0 opacity-0 transition-opacity group-hover/value:opacity-100" />
        </button>
      )}
    </div>
  );
}
