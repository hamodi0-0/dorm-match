"use client";

import { useState } from "react";
import { Pencil, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COMMON_HOBBIES } from "@/lib/constants";

interface EditableHobbiesProps {
  currentHobbies: string[];
  onSave: (hobbies: string[]) => void;
  isSaving?: boolean;
}

export function EditableHobbies({
  currentHobbies,
  onSave,
  isSaving = false,
}: EditableHobbiesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(currentHobbies);

  const enter = () => {
    setDraft([...currentHobbies]);
    setIsEditing(true);
  };

  const cancel = () => setIsEditing(false);

  const commit = () => {
    onSave(draft);
    setIsEditing(false);
  };

  const toggle = (hobby: string) => {
    setDraft((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby],
    );
  };

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {currentHobbies.length === 0
              ? "No hobbies added yet"
              : `${currentHobbies.length} selected`}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={enter}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-6"
          >
            <Pencil className="h-3 w-3" />
            Edit
          </Button>
        </div>

        {currentHobbies.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {currentHobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary" className="text-xs">
                {hobby}
              </Badge>
            ))}
          </div>
        ) : (
          <button
            type="button"
            onClick={enter}
            className="w-full text-xs text-muted-foreground italic text-center py-4 border border-dashed border-border rounded-lg hover:border-primary/40 hover:text-primary/60 transition-colors"
          >
            Click to add hobbies &amp; interests
          </button>
        )}
      </div>
    );
  }

  const available = COMMON_HOBBIES.filter((h) => !draft.includes(h));

  return (
    <div className="space-y-4">
      {/* Selected */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-foreground">
          Selected ({draft.length})
        </p>
        {draft.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {draft.map((hobby) => (
              <button
                key={hobby}
                type="button"
                onClick={() => toggle(hobby)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {hobby}
                <X className="h-2.5 w-2.5" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            None selected — pick from below
          </p>
        )}
      </div>

      {/* Available */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Tap to add</p>
        <div className="flex flex-wrap gap-1.5">
          {available.map((hobby) => (
            <button
              key={hobby}
              type="button"
              onClick={() => toggle(hobby)}
              className="px-2.5 py-0.5 rounded-full text-xs bg-background border border-input hover:bg-accent hover:border-primary/40 transition-colors"
            >
              {hobby}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          onClick={commit}
          disabled={isSaving}
          className="h-7 gap-1.5 text-xs"
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Check className="h-3 w-3" />
          )}
          Save hobbies
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={cancel}
          disabled={isSaving}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
