
"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, DollarSign, CreditCard, Palette, Tag, Sparkles, Save, MapPin, Phone, MessageSquare, Users, Truck, Bell, ImagePlus, Loader2, X } from "lucide-react";
import type { InventoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";
import { uploadBusinessImage } from "@/lib/firebase";
import { Progress } from "@/components/ui/progress";

const mockInventoryForPortfolio: InventoryItem[] = [
  { id: "item-1", name: "Handcrafted Mug", quantity: 25, unitPrice: 15.99, lowStockThreshold: 5, supplier: "Artisan Goods Co." },
  { id: "item-2", name: "Organic Coffee Blend", quantity: 50, unitPrice: 12.50, lowStockThreshold: 10, supplier: "Bean Masters" },
  { id: "item-3", name: "Leather Journal", quantity: 30, unitPrice: 25.00, lowStockThreshold: 8, supplier: "Fine Leathers Ltd." },
  { id: "item-4", name: "Scented Soy Candle", quantity: 60, unitPrice: 18.00, lowStockThreshold: 15, supplier: "Home Fragrances" },
];

const PORTFOLIO_DESC_KEY = 'malitrack-portfolio-description';
const PORTFOLIO_LOCATION_KEY = 'malitrack-portfolio-location';
const PORTFOLIO_VIDEO_URL_KEY = 'malitrack-portfolio-video-url';
const PORTFOLIO_BANNER_KEY = 'malitrack-portfolio-banner-url';
const PORTFOLIO_LOGO_KEY = 'malitrack-portfolio-logo-url';
const PORTFOLIO_FEATURED_ITEMS_KEY = 'malitrack-portfolio-featured-items';
const PORTFOLIO_BEST_SELLING_ITEMS_KEY = 'malitrack-portfolio-best-selling-items';
const PORTFOLIO_SALE_ITEMS_KEY = 'malitrack-portfolio-sale-items';

const portfolioSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  businessDescription: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description too long."),
  businessLocation: z.string().optional(),
  bannerImageFile: z.any().optional(),
  profileImageFile: z.any().optional(),
  videoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  featuredItems: z.array(z.string()).optional(),
  bestSellingItems: z.array(z.string()).optional(),
  saleItems: z.array(z.string()).optional(),
  paymentStripeEnabled: z.boolean().optional(),
  paymentStripeKey: z.string().optional(),
  paymentPaypalEnabled: z.boolean().optional(),
  paymentPaypalEmail: z.string().email({ message: "Invalid PayPal email." }).optional().or(z.literal('')),
  paymentVisaEnabled: z.boolean().optional(),
  paymentMpesaEnabled: z.boolean().optional(),
  paymentMpesaNumber: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;
type MessageCategory = "buyers" | "suppliers" | "malitrack" | "finance";

export default function PortfolioPage() {
  const { toast } = useToast();
  const { businessName: contextBusinessName, setBusinessName: setContextBusinessName } = useBusiness();
  const { currentUser } = useAuth();
  
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerUploadProgress, setBannerUploadProgress] = useState<number | null>(null);
  const [showBannerProgress, setShowBannerProgress] = useState(false);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState<number | null>(null);
  const [showLogoProgress, setShowLogoProgress] = useState(false);

  const [activeMessageCategory, setActiveMessageCategory] = useState<MessageCategory | null>(null);
  const [unreadCounts, setUnreadCounts] = useState({
    buyers: 3,
    suppliers: 1,
    malitrack: 0,
    finance: 2,
  });

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      businessName: contextBusinessName || "",
      businessDescription: "Selling the best widgets in town since 2023. High quality and great service guaranteed!",
      businessLocation: "123 Market St, BizTown, BT 54321",
      videoUrl: "",
      featuredItems: [mockInventoryForPortfolio[0].id, mockInventoryForPortfolio[2].id],
      bestSellingItems: [mockInventoryForPortfolio[1].id],
      saleItems: [mockInventoryForPortfolio[3].id],
      paymentStripeEnabled: true,
      paymentStripeKey: "pk_test_••••••••••••••••••••••••",
      paymentPaypalEnabled: false,
      paymentPaypalEmail: "",
      paymentVisaEnabled: true,
      paymentMpesaEnabled: false,
      paymentMpesaNumber: "",
    },
  });

  useEffect(() => {
    if (contextBusinessName) {
      form.setValue("businessName", contextBusinessName);
    }
    const storedDescription = localStorage.getItem(PORTFOLIO_DESC_KEY);
    if (storedDescription) form.setValue("businessDescription", storedDescription);
    
    const storedLocation = localStorage.getItem(PORTFOLIO_LOCATION_KEY);
    if (storedLocation) form.setValue("businessLocation", storedLocation);

    const storedVideoUrl = localStorage.getItem(PORTFOLIO_VIDEO_URL_KEY);
    if (storedVideoUrl) form.setValue("videoUrl", storedVideoUrl);

    try {
      const storedBannerUrl = localStorage.getItem(PORTFOLIO_BANNER_KEY);
      if (storedBannerUrl) setBannerPreview(storedBannerUrl);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error("Error loading banner URL from localStorage:", error);
      localStorage.removeItem(PORTFOLIO_BANNER_KEY);
    }

    try {
      const storedLogoUrl = localStorage.getItem(PORTFOLIO_LOGO_KEY);
      if (storedLogoUrl) setProfilePreview(storedLogoUrl);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error("Error loading logo URL from localStorage:", error);
      localStorage.removeItem(PORTFOLIO_LOGO_KEY);
    }
    
    const storedFeatured = localStorage.getItem(PORTFOLIO_FEATURED_ITEMS_KEY);
    if (storedFeatured) form.setValue("featuredItems", JSON.parse(storedFeatured));

    const storedBestSelling = localStorage.getItem(PORTFOLIO_BEST_SELLING_ITEMS_KEY);
    if (storedBestSelling) form.setValue("bestSellingItems", JSON.parse(storedBestSelling));

    const storedSale = localStorage.getItem(PORTFOLIO_SALE_ITEMS_KEY);
    if (storedSale) form.setValue("saleItems", JSON.parse(storedSale));

  }, [contextBusinessName, form]);

  // Auto-hide progress bars after completion
  useEffect(() => {
    if (bannerUploadProgress === 100) {
      const timer = setTimeout(() => setShowBannerProgress(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [bannerUploadProgress]);

  useEffect(() => {
    if (logoUploadProgress === 100) {
      const timer = setTimeout(() => setShowLogoProgress(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [logoUploadProgress]);


  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImagePreviewFn: React.Dispatch<React.SetStateAction<string | null>>,
    setImageFileFn: React.Dispatch<React.SetStateAction<File | null>>,
    formFieldName: "bannerImageFile" | "profileImageFile"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileFn(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewFn(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue(formFieldName, file);
    } else {
      setImageFileFn(null);
      const storedKey = formFieldName === "bannerImageFile" ? PORTFOLIO_BANNER_KEY : PORTFOLIO_LOGO_KEY;
      setImagePreviewFn(localStorage.getItem(storedKey));
      form.setValue(formFieldName, null);
    }
  };

  async function onSubmit(data: PortfolioFormValues) {
    if (!currentUser) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to save changes." });
      return;
    }

    let bannerUrlToSave = bannerPreview;
    let logoUrlToSave = profilePreview;

    if (bannerFile) {
      setIsUploadingBanner(true);
      setBannerUploadProgress(0);
      setShowBannerProgress(true);
      try {
        bannerUrlToSave = await uploadBusinessImage(
          currentUser.uid, 
          'banner', 
          bannerFile,
          (progress) => setBannerUploadProgress(progress)
        );
        setBannerPreview(bannerUrlToSave);
        localStorage.setItem(PORTFOLIO_BANNER_KEY, bannerUrlToSave);
        setBannerFile(null);
        form.setValue("bannerImageFile", null);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error("Banner upload error:", error);
        toast({ variant: "destructive", title: "Banner Upload Failed", description: "Could not upload banner image." });
        setShowBannerProgress(false); 
      } finally {
        setIsUploadingBanner(false);
        // Progress bar will auto-hide via useEffect
      }
    }

    if (profileFile) {
      setIsUploadingLogo(true);
      setLogoUploadProgress(0);
      setShowLogoProgress(true);
      try {
        logoUrlToSave = await uploadBusinessImage(
          currentUser.uid, 
          'logo', 
          profileFile,
          (progress) => setLogoUploadProgress(progress)
        );
        setProfilePreview(logoUrlToSave);
        localStorage.setItem(PORTFOLIO_LOGO_KEY, logoUrlToSave);
        setProfileFile(null);
        form.setValue("profileImageFile", null);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error("Logo upload error:", error);
        toast({ variant: "destructive", title: "Logo Upload Failed", description: "Could not upload logo image." });
        setShowLogoProgress(false);
      } finally {
        setIsUploadingLogo(false);
        // Progress bar will auto-hide via useEffect
      }
    }

    if (data.businessName) {
      setContextBusinessName(data.businessName);
    }
    localStorage.setItem(PORTFOLIO_DESC_KEY, data.businessDescription);
    if(data.businessLocation) localStorage.setItem(PORTFOLIO_LOCATION_KEY, data.businessLocation);
    if(data.videoUrl) localStorage.setItem(PORTFOLIO_VIDEO_URL_KEY, data.videoUrl);
    
    try {
        if (bannerUrlToSave) localStorage.setItem(PORTFOLIO_BANNER_KEY, bannerUrlToSave); else localStorage.removeItem(PORTFOLIO_BANNER_KEY);
    } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            toast({ variant: "destructive", title: "Banner Image Too Large", description: "Could not save banner preview locally (too large), but it's in the cloud if uploaded."});
        } else {
            if (process.env.NODE_ENV === 'development') console.error("Error saving banner URL to localStorage:", error);
        }
    }
    try {
        if (logoUrlToSave) localStorage.setItem(PORTFOLIO_LOGO_KEY, logoUrlToSave); else localStorage.removeItem(PORTFOLIO_LOGO_KEY);
    } catch (error) {
         if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            toast({ variant: "destructive", title: "Logo Image Too Large", description: "Could not save logo preview locally (too large), but it's in the cloud if uploaded."});
        } else {
          if (process.env.NODE_ENV === 'development') console.error("Error saving logo URL to localStorage:", error);
        }
    }
    
    if(data.featuredItems) localStorage.setItem(PORTFOLIO_FEATURED_ITEMS_KEY, JSON.stringify(data.featuredItems));
    if(data.bestSellingItems) localStorage.setItem(PORTFOLIO_BEST_SELLING_ITEMS_KEY, JSON.stringify(data.bestSellingItems));
    if(data.saleItems) localStorage.setItem(PORTFOLIO_SALE_ITEMS_KEY, JSON.stringify(data.saleItems));
    
    toast({
      title: "Portfolio Updated",
      description: "Your business portfolio has been saved. Images uploaded to cloud storage.",
    });
  }

  const handleWhatsAppClick = () => {
    toast({ title: "WhatsApp Clicked", description: "Redirecting to WhatsApp (simulated)." });
  };

  const handleChatCenterClick = () => {
    toast({ title: "Chat Center Clicked", description: "Opening chat center (simulated)." });
  };

  const handleCategoryClick = (category: MessageCategory) => {
    setActiveMessageCategory(category);
  };

  const renderProgressIndicator = (
    progress: number | null, 
    show: boolean, 
    onDismiss: () => void,
    label: string
  ) => {
    if (!show || progress === null) return null;
    return (
      <div className="mt-2 p-3 border rounded-md bg-muted/50">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium">Uploading {label}...</p>
          <Button variant="ghost" size="icon" onClick={onDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress value={progress} className="w-full h-2" />
        <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(progress)}%</p>
      </div>
    );
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Business Portfolio</h1>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isUploadingBanner || isUploadingLogo}>
          {(isUploadingBanner || isUploadingLogo) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          <Save className="mr-2 h-5 w-5" /> Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Business Profile & Branding</CardTitle>
              <CardDescription>Set your business name, description, location, banner, logo and promotional video.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl><Textarea placeholder="Tell customers about your business..." {...field} className="min-h-[120px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4"/> Business Location</FormLabel>
                    <FormControl><Input placeholder="E.g., 123 Main St, Anytown" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bannerImageFile"
                  render={() => (
                    <FormItem>
                      <FormLabel>Banner Image (e.g., for your shop front)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                           <Input 
                            id="bannerImageFile"
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, setBannerPreview, setBannerFile, "bannerImageFile")} 
                            className="hidden"
                            disabled={isUploadingBanner}
                          />
                          <Button type="button" variant="outline" onClick={() => document.getElementById('bannerImageFile')?.click()} disabled={isUploadingBanner}>
                            {isUploadingBanner && bannerUploadProgress !== null && bannerUploadProgress < 100 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ImagePlus className="mr-2 h-4 w-4"/>}
                            {isUploadingBanner && bannerUploadProgress !== null && bannerUploadProgress < 100 ? `Uploading ${Math.round(bannerUploadProgress)}%` : "Choose Banner"}
                          </Button>
                        </div>
                      </FormControl>
                      {renderProgressIndicator(bannerUploadProgress, showBannerProgress, () => setShowBannerProgress(false), "banner")}
                      {bannerPreview && !showBannerProgress && <Image src={bannerPreview} alt="Banner preview" width={300} height={150} className="mt-2 rounded-md object-cover aspect-[2/1]" data-ai-hint="store banner" />}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileImageFile"
                  render={() => ( 
                    <FormItem>
                      <FormLabel>Profile/Logo Image</FormLabel>
                       <FormControl>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="profileImageFile"
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageChange(e, setProfilePreview, setProfileFile, "profileImageFile")} 
                            className="hidden"
                            disabled={isUploadingLogo}
                          />
                           <Button type="button" variant="outline" onClick={() => document.getElementById('profileImageFile')?.click()} disabled={isUploadingLogo}>
                            {isUploadingLogo && logoUploadProgress !== null && logoUploadProgress < 100 ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ImagePlus className="mr-2 h-4 w-4"/>}
                            {isUploadingLogo && logoUploadProgress !== null && logoUploadProgress < 100 ? `Uploading ${Math.round(logoUploadProgress)}%` : "Choose Logo"}
                          </Button>
                        </div>
                      </FormControl>
                      {renderProgressIndicator(logoUploadProgress, showLogoProgress, () => setShowLogoProgress(false), "logo")}
                      {profilePreview && !showLogoProgress && <Image src={profilePreview} alt="Profile preview" width={100} height={100} className="mt-2 rounded-full object-cover aspect-square" data-ai-hint="business logo" />}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Video className="mr-2 h-4 w-4"/> Promotional Video URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://youtube.com/your-video" {...field} /></FormControl>
                    <FormDescription>Link to a YouTube, Vimeo, or other video hosting platform.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><MessageSquare className="mr-2 h-6 w-6 text-primary" /> Business Communication</CardTitle>
              <CardDescription>Manage your contacts and messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="button" onClick={handleWhatsAppClick} variant="outline" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-5 w-5" /> Connect WhatsApp
                </Button>
                <Button type="button" onClick={handleChatCenterClick} className="w-full sm:w-auto">
                  <MessageSquare className="mr-2 h-5 w-5" /> Open Chat Center
                </Button>
              </div>

              <div>
                <Label className="text-base font-semibold mb-2 block">Message Center</Label>
                <div className="flex flex-wrap gap-2 mb-4 pb-3 border-b">
                  {(Object.keys(unreadCounts) as MessageCategory[]).map((category) => {
                    const categoryIcons: Record<MessageCategory, React.ElementType> = {
                      buyers: Users,
                      suppliers: Truck,
                      malitrack: Bell,
                      finance: DollarSign,
                    };
                    const Icon = categoryIcons[category];
                    return (
                      <Button
                        key={category}
                        type="button"
                        variant={activeMessageCategory === category ? "default" : "outline"}
                        onClick={() => handleCategoryClick(category)}
                        className="relative capitalize"
                      >
                        <Icon className="mr-2 h-5 w-5" />
                        {category}
                        {unreadCounts[category] > 0 && (
                          <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                            {unreadCounts[category]}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
                <div className="p-4 border rounded-md min-h-[150px] bg-muted/30">
                  {activeMessageCategory ? (
                    <p className="text-muted-foreground">
                      Displaying messages for <span className="font-semibold capitalize text-foreground">{activeMessageCategory}</span>. (Message display is simulated)
                    </p>
                  ) : (
                    <p className="text-muted-foreground">Select a category to view messages.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Featured Inventory & Promotions</CardTitle>
              <CardDescription>Choose items to highlight on your public profile. Customers will see these.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel className="text-base font-semibold">Items to Feature Publicly</FormLabel>
                <FormDescription className="mb-3">Select products from your inventory to showcase.</FormDescription>
                <FormField
                  control={form.control}
                  name="featuredItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="featuredItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name} <span className="text-xs text-muted-foreground">(${item.unitPrice.toFixed(2)})</span>
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                 <FormMessage>{form.formState.errors.featuredItems?.message}</FormMessage>
              </div>

               <div>
                <FormLabel className="text-base font-semibold">Best Selling Items</FormLabel>
                <FormDescription className="mb-3">Highlight your top products.</FormDescription>
                <FormField
                  control={form.control}
                  name="bestSellingItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="bestSellingItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                 <FormMessage>{form.formState.errors.bestSellingItems?.message}</FormMessage>
              </div>
              
              <div>
                <FormLabel className="text-base font-semibold"><Tag className="mr-2 h-5 w-5 inline-block text-primary"/> Items on Sale</FormLabel>
                <FormDescription className="mb-3">Mark items for special promotions or sales.</FormDescription>
                 <FormField
                  control={form.control}
                  name="saleItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="saleItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                <FormMessage>{form.formState.errors.saleItems?.message}</FormMessage>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> Payment Setup (Simulated)</CardTitle>
              <CardDescription>Configure how customers can pay you. Changes here are for display/simulation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="paymentStripeEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Stripe</FormLabel>
                      <FormDescription>Accept credit/debit cards via Stripe.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentStripeEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentStripeKey"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>Stripe Publishable Key (Test)</FormLabel>
                      <FormControl><Input placeholder="pk_test_YOUR_STRIPE_KEY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="paymentPaypalEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">PayPal</FormLabel>
                      <FormDescription>Accept payments via PayPal.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentPaypalEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentPaypalEmail"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl><Input type="email" placeholder="your.paypal@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="paymentVisaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visa/Mastercard (Direct)</FormLabel>
                      <FormDescription>Indicate direct card acceptance (if applicable).</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMpesaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">M-Pesa (Kenya)</FormLabel>
                      <FormDescription>Accept mobile money via M-Pesa.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentMpesaEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentMpesaNumber"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>M-Pesa Paybill/Till Number</FormLabel>
                      <FormControl><Input placeholder="e.g., 123456" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" /> Sales & Payouts Summary (Simulated)</CardTitle>
              <CardDescription>A quick overview of your store's performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 border rounded-md">
                <p>Total Items Sold (This Month):</p>
                <p className="font-semibold">157</p>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <p>Total Revenue (This Month):</p>
                <p className="font-semibold text-green-600">$2,345.67</p>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <p>Pending Payout:</p>
                <p className="font-semibold">$1,890.12</p>
              </div>
               <div className="flex justify-between p-3 border rounded-md">
                <p>Next Payout Date:</p>
                <p className="font-semibold">August 1, 2024</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isUploadingBanner || isUploadingLogo}>
              {(isUploadingBanner || isUploadingLogo) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              <Save className="mr-2 h-5 w-5" /> Save All Portfolio Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
