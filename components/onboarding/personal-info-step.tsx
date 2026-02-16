"use client";

import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PersonalInfoStep() {
  const { data, updateData } = useOnboardingStore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder="John Doe"
          value={data.full_name || ""}
          onChange={(e) => updateData({ full_name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={data.phone || ""}
          onChange={(e) => updateData({ phone: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">
          Gender <span className="text-destructive">*</span>
        </Label>
        <Select
          value={data.gender || ""}
          onValueChange={(value) => updateData({ gender: value })}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="Select your gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
