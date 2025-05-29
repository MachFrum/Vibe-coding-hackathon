
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, CalendarIcon } from "lucide-react";
import type { LedgerEntry } from "@/types";
import { LedgerTable } from "@/components/features/ledger/ledger-table";
import { ledgerColumns } from "@/components/features/ledger/ledger-columns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock data for ledger entries
const mockLedger: LedgerEntry[] = [
  { id: "1", date: "2024-07-01", description: "Sale of Product A", type: "income", category: "Sales", amount: 150.00 },
  { id: "2", date: "2024-07-01", description: "Office Rent", type: "expense", category: "Overheads", amount: 500.00 },
  { id: "3", date: "2024-07-02", description: "Consulting Services", type: "income", category: "Services", amount: 300.00 },
  { id: "4", date: "2024-07-03", description: "Supplier Payment - Raw Materials", type: "expense", category: "Cost of Goods Sold", amount: 250.00 },
  { id: "5", date: "2024-07-04", description: "Online Ad Campaign", type: "expense", category: "Marketing", amount: 75.00 },
];

const ledgerEntrySchema = z.object({
  date: z.date({ required_error: "Date is required." }),
  description: z.string().min(1, "Description is required."),
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  category: z.string().min(1, "Category is required."),
  amount: z.coerce.number().positive("Amount must be positive."),
});

export default function LedgerPage() {
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>(mockLedger);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ledgerEntrySchema>>({
    resolver: zodResolver(ledgerEntrySchema),
    defaultValues: {
      description: "",
      category: "",
    },
  });

  function onSubmit(values: z.infer<typeof ledgerEntrySchema>) {
    const newEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      date: format(values.date, "yyyy-MM-dd"),
      ...values,
    };
    setLedgerEntries(prev => [newEntry, ...prev]);
    form.reset();
    setIsAddEntryDialogOpen(false);
    toast({
      title: "Ledger Entry Added",
      description: `Entry for ${newEntry.description} has been successfully recorded.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Digital Ledger</h1>
        <Dialog open={isAddEntryDialogOpen} onOpenChange={setIsAddEntryDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Ledger Entry</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., Sale of Product A, Office Rent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Sales, Overheads" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add Entry</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Track your income and expenses to maintain an accurate financial overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <LedgerTable columns={ledgerColumns} data={ledgerEntries} />
        </CardContent>
      </Card>
    </div>
  );
}
