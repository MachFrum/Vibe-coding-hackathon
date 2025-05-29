'use server';

/**
 * @fileOverview Provides AI-powered, personalized business advice based on ledger and inventory data.
 *
 * - getBusinessAdvice - A function that generates business advice.
 * - BusinessAdviceInput - The input type for the getBusinessAdvice function.
 * - BusinessAdviceOutput - The return type for the getBusinessAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessAdviceInputSchema = z.object({
  ledgerData: z
    .string()
    .describe('A summary of the business ledger data, including income and expenses.'),
  inventoryData: z
    .string()
    .describe('A summary of the business inventory data, including stock levels and turnover rates.'),
  businessType: z
    .string()
    .describe('The type of business, e.g., restaurant, retail store, service provider.'),
});
export type BusinessAdviceInput = z.infer<typeof BusinessAdviceInputSchema>;

const BusinessAdviceOutputSchema = z.object({
  advice: z
    .string()
    .describe('Personalized business advice based on the provided ledger and inventory data.'),
  keyMetrics: z
    .array(z.string())
    .describe(
      'Key performance indicators (KPIs) that the business owner should monitor, based on the advice given.'
    ),
});
export type BusinessAdviceOutput = z.infer<typeof BusinessAdviceOutputSchema>;

export async function getBusinessAdvice(input: BusinessAdviceInput): Promise<BusinessAdviceOutput> {
  return businessAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessAdvicePrompt',
  input: {schema: BusinessAdviceInputSchema},
  output: {schema: BusinessAdviceOutputSchema},
  prompt: `You are an expert business advisor providing personalized advice to business owners.

  Based on the business's ledger data, inventory data, and type of business, provide actionable advice to improve their business performance.

  Ledger Data: {{{ledgerData}}}
  Inventory Data: {{{inventoryData}}}
  Business Type: {{{businessType}}}

  Focus on providing specific and measurable advice.

  In addition to advice, list key metrics that the business owner should monitor to track progress related to the advice given.
  `,
});

const businessAdviceFlow = ai.defineFlow(
  {
    name: 'businessAdviceFlow',
    inputSchema: BusinessAdviceInputSchema,
    outputSchema: BusinessAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
