
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, ImagePlus, Camera, Loader2 } from "lucide-react";
import type { InventoryItem } from "@/types";
import { InventoryTable } from "@/components/features/inventory/inventory-table";
import { inventoryColumns } from "@/components/features/inventory/inventory-columns";
import { useState, useRef, useEffect, type ChangeEvent, useCallback } from "react"; 
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";
import { addInventoryItemToFirestore, getInventoryItemsFromFirestore, storage } from "@/lib/firebase"; 
import { ref as storageRefStandard, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const inventoryItemSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  quantity: z.coerce.number().min(0, "Quantity must be non-negative."),
  unitPrice: z.coerce.number().positive("Unit price must be positive."),
  lowStockThreshold: z.coerce.number().min(0, "Low stock threshold must be non-negative."),
  supplier: z.string().optional(),
  imageFile: z.any().optional(), 
});

type InventoryFormValues = z.infer<typeof inventoryItemSchema>;

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { businessName } = useBusiness();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DUMMY_BUSINESS_ID = "defaultBusiness123"; 

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      unitPrice: 0,
      lowStockThreshold: 0,
      supplier: "",
      imageFile: null,
    },
  });

  const fetchInventory = useCallback(async () => {
    if (!currentUser || !DUMMY_BUSINESS_ID) {
      setInventory([]);
      setIsLoading(false); 
      return;
    }
    
    try {
      const items = await getInventoryItemsFromFirestore(DUMMY_BUSINESS_ID);
      setInventory(items);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error fetching inventory:", error);
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch inventory items.",
      });
      setInventory([]); 
    } finally {
      setIsLoading(false); 
    }
  }, [currentUser, toast]); 

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true); 
      fetchInventory();
    } else {
      setInventory([]);
      setIsLoading(false);
    }
  }, [currentUser, fetchInventory]);


  useEffect(() => {
    let streamObj: MediaStream | null = null;
    const videoElement = videoRef.current;

    const getCameraStream = async () => {
      if (isCameraDialogOpen && videoElement) {
        setHasCameraPermission(null);
        try {
          streamObj = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          videoElement.srcObject = streamObj;
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error accessing camera:', error);
          }
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      }
    };

    getCameraStream();

    return () => {
      if (streamObj) {
        streamObj.getTracks().forEach(track => track.stop());
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, [isCameraDialogOpen, toast]);

  async function onSubmit(values: InventoryFormValues) {
    if (!currentUser || !DUMMY_BUSINESS_ID) {
      toast({ variant: "destructive", title: "Error", description: "User not authenticated or business ID missing." });
      return;
    }
    setIsSubmitting(true);
    let imageUrl: string | undefined = undefined;

    if (values.imageFile) {
      try {
        const file = values.imageFile as File;
        const imageRef = storageRefStandard(storage, `businesses/${DUMMY_BUSINESS_ID}/inventory_images/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(imageRef, file);
        
        await new Promise<void>((resolve, reject) => {
          uploadTask.on('state_changed', 
            null, 
            (error) => {
              if (process.env.NODE_ENV === 'development') {
                console.error("Image upload error:", error);
              }
              reject(error);
            }, 
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });

      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error uploading item image:", error);
        }
        toast({ variant: "destructive", title: "Image Upload Failed", description: "Could not upload item image." });
        setIsSubmitting(false);
        return;
      }
    }

    const itemDataToSave: {
      name: string;
      quantity: number;
      unitPrice: number;
      lowStockThreshold: number;
      supplier?: string;
      imageUrl?: string; // imageUrl is optional
    } = {
      name: values.name,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      lowStockThreshold: values.lowStockThreshold,
      supplier: values.supplier,
    };

    if (imageUrl) { // Only add imageUrl if it has a value
      itemDataToSave.imageUrl = imageUrl;
    }

    try {
      await addInventoryItemToFirestore(DUMMY_BUSINESS_ID, itemDataToSave);
      toast({
        title: "Item Added",
        description: `${values.name} has been successfully added to inventory.`,
      });
      form.reset();
      setImagePreview(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
      setIsAddItemDialogOpen(false);
      setIsLoading(true); // Set loading before refetching
      fetchInventory(); 
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error saving item to Firestore:", error);
      }
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save item to the database.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("imageFile", file);
    } else {
      setImagePreview(null);
      form.setValue("imageFile", null);
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && hasCameraPermission) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImagePreview(dataUrl);
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera-capture.png", { type: "image/png" });
            form.setValue("imageFile", file); 
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
          });
        toast({ title: "Image Captured", description: "Image from camera has been set."});
      }
      setIsCameraDialogOpen(false);
    } else {
        toast({ variant: "destructive", title: "Capture Failed", description: "Camera not ready or permission denied."});
    }
  };


  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{(businessName || "Your Business")}'s Inventory Log</h1>
          <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!currentUser}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., Organic Apples" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unitPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0.00" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="lowStockThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Threshold</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="E.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="supplier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g., FarmFresh Co." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="imageFile"
                    render={() => ( 
                      <FormItem>
                        <FormLabel>Item Image (Optional)</FormLabel>
                        <div className="flex items-center gap-4">
                          <FormControl>
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                              <ImagePlus className="mr-2 h-4 w-4" /> Choose File
                            </Button>
                          </FormControl>
                          <Input
                            type="file"
                            className="hidden"
                            onChange={handleImageFileChange}
                            accept="image/*"
                            ref={fileInputRef}
                          />
                          <Button type="button" variant="outline" size="sm" onClick={() => setIsCameraDialogOpen(true)}>
                            <Camera className="mr-2 h-4 w-4" /> Open Camera
                          </Button>
                        </div>
                        {imagePreview && (
                          <div className="mt-2">
                            <Image src={imagePreview} alt="Item preview" width={100} height={100} className="rounded-md object-cover aspect-square" data-ai-hint="product image" />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline" onClick={() => { form.reset(); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Add Item
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
            <CardDescription>Manage your product inventory, track stock levels, and set low stock alerts.</CardDescription>
             <p className="text-sm text-muted-foreground pt-2">
              Clients looking to shop locally will see your inventory when they explore nearby businesses.
              The way you’ve set up your portfolio on your ‘My Business’ page is exactly how they’ll view you.
              Your items appear when they click your banner.
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading inventory...</p>
              </div>
            ) : (
              <InventoryTable columns={inventoryColumns} data={inventory} />
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Scan Item Image</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
            {hasCameraPermission === false && (
              <Alert variant="destructive" className="mt-4">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                  Please allow camera access in your browser settings to use this feature.
                </AlertDescription>
              </Alert>
            )}
            {hasCameraPermission === null && isCameraDialogOpen && (
              <div className="text-center mt-4 text-muted-foreground">Requesting camera access...</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCameraDialogOpen(false)}>Close</Button>
            <Button onClick={handleCaptureImage} disabled={!hasCameraPermission}>Capture Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
