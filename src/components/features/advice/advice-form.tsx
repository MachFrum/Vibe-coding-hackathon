
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form'; // Added this line
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb } from "lucide-react";
import { getBusinessAdvice, type BusinessAdviceInput, type BusinessAdviceOutput } from "@/ai/flows/business-advice";
import { useToast } from "@/hooks/use-toast";

const adviceFormSchema = z.object({
  ledgerData: z.string().min(10, "Please provide a summary of your ledger data (min 10 characters)."),
  inventoryData: z.string().min(10, "Please provide a summary of your inventory data (min 10 characters)."),
  businessType: z.string().min(3, "Please specify your business type (e.g., retail, cafe, services)."),
});

export function AdviceForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState<BusinessAdviceOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adviceFormSchema>>({
    resolver: zodResolver(adviceFormSchema),
    defaultValues: {
      ledgerData: "",
      inventoryData: "",
      businessType: "",
    },
  });

  async function onSubmit(values: z.infer<typeof adviceFormSchema>) {
    setIsLoading(true);
    setAdviceResult(null);
    try {
      const input: BusinessAdviceInput = {
        ledgerData: values.ledgerData,
        inventoryData: values.inventoryData,
        businessType: values.businessType,
      };
      const result = await getBusinessAdvice(input);
      setAdviceResult(result);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error getting business advice:", error);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get business advice. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="ledgerData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ledger Data Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., Monthly income $5000, expenses $3000, profit margin 40%..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventoryData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inventory Data Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., 100 units of Product A, selling 20/week. 50 units of Product B, low stock..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Business</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Coffee Shop, Online Clothing Store, Consultancy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Advice...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Get Business Tips
              </>
            )}
          </Button>
        </form>
      </Form>

      {adviceResult && (
        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-primary" /> AI-Generated Business Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Personalized Advice:</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{adviceResult.advice}</p>
            </div>
            {adviceResult.keyMetrics && adviceResult.keyMetrics.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-1">Key Metrics to Monitor:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {adviceResult.keyMetrics.map((metric, index) => (
                    <li key={index}>{metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
