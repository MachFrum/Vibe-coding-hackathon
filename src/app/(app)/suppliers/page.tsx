
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MapPin, PlusCircle, Search, Filter } from "lucide-react";
import type { Supplier } from "@/types";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react"; // Added useEffect
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce"; // Import useDebounce

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  { id: "1", name: "FarmFresh Co.", category: "Produce", address: "123 Green Valley Rd, Farmville", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Organic Apples", "Vegetables"], contact: "info@farmfresh.com" },
  { id: "2", name: "Bakery Delights", category: "Baked Goods", address: "456 Flour St, Bakerton", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Whole Wheat Bread", "Pastries"], contact: "orders@bakerydelights.com" },
  { id: "3", name: "Roast Masters", category: "Coffee & Tea", address: "789 Bean Ave, Brewtown", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Artisan Coffee Beans", "Specialty Teas"], contact: "sales@roastmasters.co" },
  { id: "4", name: "Natural Scents", category: "Crafts & Goods", address: "101 Aroma Ln, Craftsville", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Handmade Soap", "Candles"], contact: "support@naturalscents.com" },
];

const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required."),
  category: z.string().min(1, "Category is required."),
  address: z.string().min(1, "Address is required."),
  itemsSupplied: z.string().min(1, "Please list items supplied."), // Comma-separated
  contact: z.string().email("Invalid email format.").optional().or(z.literal('')),
});

const categories = ["All", ...new Set(mockSuppliers.map(s => s.category))];
const itemTypes = ["All", ...new Set(mockSuppliers.flatMap(s => s.itemsSupplied))];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTermInput, setSearchTermInput] = useState(""); // For direct input
  const debouncedSearchTerm = useDebounce(searchTermInput, 500); // Debounced value for filtering
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [itemFilter, setItemFilter] = useState("All");
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      category: "",
      address: "",
      itemsSupplied: "",
      contact: "",
    },
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                            supplier.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || supplier.category === categoryFilter;
      const matchesItem = itemFilter === "All" || supplier.itemsSupplied.some(item => item.toLowerCase().includes(itemFilter.toLowerCase()));
      return matchesSearch && matchesCategory && matchesItem;
    });
  }, [suppliers, debouncedSearchTerm, categoryFilter, itemFilter]);

  function onSubmit(values: z.infer<typeof supplierSchema>) {
    const newSupplier: Supplier = {
      id: `supplier-${Date.now()}`,
      name: values.name,
      category: values.category,
      address: values.address,
      itemsSupplied: values.itemsSupplied.split(',').map(item => item.trim()).filter(item => item.length > 0),
      contact: values.contact,
      latitude: 34.0522, // Mock latitude
      longitude: -118.2437, // Mock longitude
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    form.reset();
    setIsAddSupplierDialogOpen(false);
    toast({
      title: "Supplier Added",
      description: `${newSupplier.name} has been successfully added.`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers Directory</h1>
        <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., FarmFresh Co." {...field} />
                      </FormControl>
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
                        <Input placeholder="E.g., Produce, Baked Goods" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 123 Green Valley Rd, Farmville" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="itemsSupplied"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Items Supplied (comma-separated)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="E.g., Organic Apples, Vegetables, Bread" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="E.g., info@farmfresh.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Add Supplier</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Find Suppliers</CardTitle>
          <CardDescription>Search and filter suppliers by location, category, or items supplied.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name or address..." 
                className="pl-10"
                value={searchTermInput}
                onChange={(e) => setSearchTermInput(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={itemFilter} onValueChange={setItemFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by item type" />
              </SelectTrigger>
              <SelectContent>
                 {itemTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <CardDescription>{supplier.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> {supplier.address}
                    </p>
                    <p className="text-sm mb-2"><strong>Supplies:</strong> {supplier.itemsSupplied.join(", ")}</p>
                    {supplier.contact && <p className="text-sm"><strong>Contact:</strong> {supplier.contact}</p>}
                    <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Contact Supplier</Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-center text-muted-foreground py-10">No suppliers found matching your criteria.</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-md">
                <CardHeader>
                  <CardTitle>Supplier Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                    <Image
                      src="https://placehold.co/600x600.png"
                      alt="Suppliers Map Placeholder"
                      width={600}
                      height={600}
                      layout="responsive"
                      data-ai-hint="map location"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Map functionality is simulated.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
