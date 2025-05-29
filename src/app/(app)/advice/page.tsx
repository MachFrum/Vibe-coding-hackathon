import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdviceForm } from "@/components/features/advice/advice-form";

export default function AdvicePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">AI-Powered Business Tips</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Get Personalized Advice</CardTitle>
          <CardDescription>
            Provide summaries of your ledger and inventory data, along with your business type, 
            to receive AI-generated tips and key metrics for your business.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdviceForm />
        </CardContent>
      </Card>
    </div>
  );
}