
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Palette, Gift, Users, ExternalLink, type LucideIcon, ShieldCheck, Sparkles, Save, Trash2, Share2, RefreshCcw, Shuffle, Edit3 } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useTheme, type ColorValues, type SavedPalette } from '@/contexts/ThemeContext';
import { hexToHsl, hslStringToHex } from '@/lib/colorUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColorPickerProps {
  label: string;
  colorVarName: keyof ColorValues;
  Icon: LucideIcon;
}

const ColorPickerInput: React.FC<ColorPickerProps> = ({ label, colorVarName, Icon }) => {
  const { updateCustomColor, getEffectiveColor, theme, customColorOverrides } = useTheme();
  // Use getEffectiveColor to initialize, ensuring overrides are reflected
  const [colorValue, setColorValue] = useState(() => hslStringToHex(getEffectiveColor(colorVarName)));

  // Update picker if theme or custom overrides change externally
  useEffect(() => {
    setColorValue(hslStringToHex(getEffectiveColor(colorVarName)));
  }, [getEffectiveColor, colorVarName, theme, customColorOverrides]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = event.target.value;
    setColorValue(newHexColor); // Update local state immediately for responsiveness
    const newHslColor = hexToHsl(newHexColor);
    if (newHslColor) {
      updateCustomColor(colorVarName, newHslColor);
    }
  };
  
  const handleHexInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = event.target.value.toUpperCase();
    setColorValue(newHexColor);
    if (/^#[0-9A-F]{6}$/i.test(newHexColor)) {
       const newHslColor = hexToHsl(newHexColor);
       if (newHslColor) {
           updateCustomColor(colorVarName, newHslColor);
       }
    }
  };


  return (
    <div className="space-y-2">
      <Label htmlFor={colorVarName} className="flex items-center text-sm font-medium">
        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          id={colorVarName}
          value={colorValue}
          onChange={handleColorChange}
          className="h-10 w-14 p-1 rounded-md border cursor-pointer"
        />
        <Input
          type="text"
          value={colorValue}
          onChange={handleHexInputChange}
          className="h-10 flex-1 rounded-md border px-3 text-sm tabular-nums"
          maxLength={7}
        />
      </div>
    </div>
  );
};


export default function SettingsPage() {
  const { toast } = useToast();
  const { 
    randomizeCurrentThemeColors, 
    resetCustomColorsToThemeDefaults,
    saveCurrentCustomPalette,
    savedPalettes,
    applySavedPalette,
    deleteSavedPalette
  } = useTheme();

  const [currentPlan, setCurrentPlan] = useState("MaliTrack Pro");
  const [autoRenew, setAutoRenew] = useState(true);
  const [newPaletteName, setNewPaletteName] = useState("");
  const [isSavePaletteDialogOpen, setIsSavePaletteDialogOpen] = useState(false);

  const handlePaymentUpdate = () => {
    toast({ title: "Payment Settings", description: "Redirecting to update payment methods (simulated)." });
  };

  const handleCancelSubscription = () => {
    toast({ 
      title: "Subscription Cancellation", 
      description: "Your request to cancel has been received (simulated).",
      variant: "destructive" 
    });
    setCurrentPlan("Free Tier (Cancelled)");
  };

  const handleApplyPromo = () => {
    toast({ title: "Promo Code Applied", description: "Discount ABCXYZ has been applied (simulated)!" });
  };

  const handleInvite = () => {
    toast({ title: "Invite Sent", description: "Your invitation has been sent (simulated)." });
  };
  
  const handleGenerateAffiliateLink = () => {
    toast({ title: "Affiliate Link Generated", description: "Your link: https://malitrack.com/join?ref=USER123 (simulated)." });
  };

  const handleRandomizeColors = () => {
    randomizeCurrentThemeColors();
    toast({ title: "Colors Randomized!", description: "A new random palette has been applied." });
  };

  const handleResetColors = () => {
    resetCustomColorsToThemeDefaults();
    toast({ title: "Colors Reset", description: "Customizations reset to current theme's defaults." });
  };

  const handleSavePalette = () => {
    if (!newPaletteName.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Palette name cannot be empty." });
      return;
    }
    saveCurrentCustomPalette(newPaletteName);
    toast({ title: "Palette Saved", description: `"${newPaletteName}" has been saved.` });
    setNewPaletteName("");
    setIsSavePaletteDialogOpen(false);
  };

  const handleApplySavedPalette = (palette: SavedPalette) => {
    applySavedPalette(palette);
    toast({ title: "Palette Applied", description: `"${palette.name}" is now active.`});
  }

  const handleDeleteSavedPalette = (paletteName: string) => {
    deleteSavedPalette(paletteName);
    toast({ title: "Palette Deleted", description: `"${paletteName}" has been removed.`, variant: "destructive"});
  }

  const handleSharePalette = (palette: SavedPalette) => {
    const colorStrings = Object.entries(palette.colors)
      .map(([key, hslValue]) => `${key.replace('--', '')}: ${hslStringToHex(hslValue as string)}`)
      .join('\n');
    navigator.clipboard.writeText(colorStrings)
      .then(() => {
        toast({ title: "Palette Shared", description: "Hex codes copied to clipboard!" });
      })
      .catch(err => {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to copy palette: ', err);
        }
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy palette to clipboard." });
      });
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* Website Customization Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Website Customization</CardTitle>
          <CardDescription>
            Customize the look and feel of your application. Colors are saved locally.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ColorPickerInput label="Page Background" colorVarName="--background" Icon={Palette} />
            <ColorPickerInput label="Main Text" colorVarName="--foreground" Icon={Edit3} />
            <ColorPickerInput label="Buttons & Primary" colorVarName="--primary" Icon={Sparkles} />
            <ColorPickerInput label="UI Accents (Secondary)" colorVarName="--secondary" Icon={Palette} />
            <ColorPickerInput label="Highlights & Active" colorVarName="--accent" Icon={Sparkles} />
          </div>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRandomizeColors} variant="outline">
              <Shuffle className="mr-2 h-4 w-4" /> Randomize Colors
            </Button>
            
            <Dialog open={isSavePaletteDialogOpen} onOpenChange={setIsSavePaletteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" /> Save Current Palette
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Color Palette</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-2">
                  <Label htmlFor="paletteName">Palette Name</Label>
                  <Input 
                    id="paletteName" 
                    value={newPaletteName} 
                    onChange={(e) => setNewPaletteName(e.target.value)}
                    placeholder="E.g., My Vibrant Theme"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button onClick={handleSavePalette}>Save Palette</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleResetColors} variant="destructive">
              <RefreshCcw className="mr-2 h-4 w-4" /> Reset to Theme Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Palettes Section */}
      {savedPalettes.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center"><Save className="mr-2 h-6 w-6 text-primary" /> Saved Palettes</CardTitle>
            <CardDescription>Apply, share, or delete your saved color schemes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] pr-3">
              <div className="space-y-3">
                {savedPalettes.map((palette) => (
                  <div key={palette.name} className="flex items-center justify-between p-3 border rounded-md">
                    <span className="font-medium">{palette.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleApplySavedPalette(palette)}>Apply</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleSharePalette(palette)}><Share2 className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteSavedPalette(palette.name)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}


      {/* Payment Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> Payment Information</CardTitle>
          <CardDescription>Manage your payment methods and billing details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-card">Current Payment Method</Label>
            <Input id="current-card" readOnly value="Visa ending in **** 1234 (Simulated)" className="mt-1 bg-muted/50" />
          </div>
          <Button onClick={handlePaymentUpdate}>
            Update Payment Method <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Management Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary" /> Subscription Management</CardTitle>
          <CardDescription>Oversee your MaliTrack subscription plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Plan:</p>
            <p className="text-lg font-semibold text-primary">{currentPlan}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} aria-label="Toggle auto-renewal"/>
            <Label htmlFor="auto-renew">Auto-renew subscription</Label>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Upgrade Plan (Simulated)</Button>
            {currentPlan !== "Free Tier (Cancelled)" && (
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Tools Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Marketing & Growth Tools</CardTitle>
          <CardDescription>Expand your reach and reward your network.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="promo-code">Enter Promo Code</Label>
            <div className="flex gap-2">
              <Input id="promo-code" placeholder="E.g., SAVE20" />
              <Button onClick={handleApplyPromo}><Gift className="mr-2 h-4 w-4" /> Apply</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Invite People</Label>
            <p className="text-sm text-muted-foreground">Share MaliTrack and earn rewards.</p>
            <Button variant="outline" onClick={handleInvite}><Users className="mr-2 h-4 w-4" /> Send Invites</Button>
          </div>
          <Separator />
           <div className="space-y-2">
            <Label>Your Affiliate Link</Label>
             <Input readOnly value="https://malitrack.com/join?ref=USER123 (Simulated)" className="bg-muted/50" />
            <Button variant="secondary" onClick={handleGenerateAffiliateLink}>Generate New Link</Button>
            <p className="text-xs text-muted-foreground">Track rewards: $0.00 earned (Simulated)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
