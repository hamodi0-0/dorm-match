import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function ListerOnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-serif">
            Lister Onboarding
          </CardTitle>
          <CardDescription>
            Lister account setup is coming soon. Your account has been created
            and will be ready shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please contact support if you need immediate access.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
