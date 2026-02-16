import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.message || "An authentication error occurred";

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-linear-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-6 w-6" />
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </div>
            <CardDescription>
              We couldn&apos;t complete your authentication request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-destructive/10 p-4 text-sm">
              <p className="font-medium text-destructive">Error:</p>
              <p className="text-muted-foreground mt-1">{errorMessage}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                This could be because:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>The verification link has expired</li>
                <li>The link has already been used</li>
                <li>Your account type doesn&apos;t match</li>
                <li>There was a network error</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/" className="w-full">
                <Button className="w-full">Return to Home</Button>
              </Link>
              <Link href="/contact" className="w-full">
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
