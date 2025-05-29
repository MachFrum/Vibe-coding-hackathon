
'use client';

import { Mountain } from 'lucide-react'; // Changed from Palette to Mountain
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function ThemeSwitcherButton() {
  const { cycleTheme, theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50
                       border-2 border-primary bg-background/80 backdrop-blur-sm
                       hover:scale-110 hover:bg-primary/20 transition-transform duration-200"
            onClick={cycleTheme}
            aria-label="Switch Theme"
          >
            <Mountain className="h-7 w-7 text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Switch Theme: {theme.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

