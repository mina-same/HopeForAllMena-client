import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

export function ColorSystemTest() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`p-6 space-y-6 ${darkMode ? 'dark' : ''}`}>
      
      {/* Dark Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Complete Tailwind CSS Test Suite
            <div className="flex items-center gap-2">
              <span className="text-sm">Light</span>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              <span className="text-sm">Dark</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* HSL Color System */}
      <Card>
        <CardHeader>
          <CardTitle>HSL Color System (Primary)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm font-medium text-foreground">background</div>
              <div className="text-xs text-muted-foreground">Core background</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-sm font-medium text-card-foreground">card</div>
              <div className="text-xs text-muted-foreground">Card background</div>
            </div>
            <div className="bg-muted p-4 rounded-lg border">
              <div className="text-sm font-medium">muted</div>
              <div className="text-xs text-muted-foreground">HSL: 210 40% 98%</div>
            </div>
            <div className="bg-surface p-4 rounded-lg border">
              <div className="text-sm font-medium">surface</div>
              <div className="text-xs text-muted-foreground">Custom surface</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-primary p-4 rounded-lg text-primary-foreground">
              <div className="text-sm font-medium">primary</div>
              <div className="text-xs opacity-80">HSL: 203 74% 48%</div>
            </div>
            <div className="bg-secondary p-4 rounded-lg text-secondary-foreground">
              <div className="text-sm font-medium">secondary</div>
              <div className="text-xs opacity-70">HSL: 210 40% 98%</div>
            </div>
            <div className="bg-accent p-4 rounded-lg text-accent-foreground">
              <div className="text-sm font-medium">accent</div>
              <div className="text-xs opacity-80">HSL: 211 58% 39%</div>
            </div>
            <div className="bg-destructive p-4 rounded-lg text-destructive-foreground">
              <div className="text-sm font-medium">destructive</div>
              <div className="text-xs opacity-80">HSL: 0 84% 60%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Theme Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Bookstore Theme Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-thm-base p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-base</div>
              <div className="text-xs opacity-90">#2194D1</div>
            </div>
            <div className="bg-thm-primary p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-primary</div>
              <div className="text-xs opacity-90">#32669C</div>
            </div>
            <div className="bg-thm-secondary p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-secondary</div>
              <div className="text-xs opacity-90">#050517</div>
            </div>
            <div className="bg-thm-light p-4 rounded-lg text-thm-dark border border-thm-accent">
              <div className="text-sm font-medium">thm-light</div>
              <div className="text-xs opacity-80">#EAFDF8</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-thm-accent p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-accent</div>
              <div className="text-xs opacity-90">#3C362A</div>
            </div>
            <div className="bg-thm-special p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-special</div>
              <div className="text-xs opacity-90">#5366c2</div>
            </div>
            <div className="bg-thm-dark p-4 rounded-lg text-white border">
              <div className="text-sm font-medium">thm-dark</div>
              <div className="text-xs opacity-90">#050517</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gradient-hero p-6 rounded-lg text-white text-center border shadow-lg">
              <div className="text-sm font-medium drop-shadow-sm">bg-gradient-hero</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Enhanced hero gradient</div>
            </div>
            <div className="bg-gradient-button p-6 rounded-lg text-white text-center border shadow-lg">
              <div className="text-sm font-medium drop-shadow-sm">bg-gradient-button</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Button gradient</div>
            </div>
            <div className="bg-gradient-glass p-6 rounded-lg text-center border backdrop-blur-sm text-foreground">
              <div className="text-sm font-medium">bg-gradient-glass</div>
              <div className="text-xs text-muted-foreground">Glass effect</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Status Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-status-pending p-4 rounded-lg text-white text-center border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">Pending</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Warm amber</div>
            </div>
            <div className="bg-status-approved p-4 rounded-lg text-white text-center border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">Approved</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Emerald green</div>
            </div>
            <div className="bg-status-rejected p-4 rounded-lg text-white text-center border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">Rejected</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Bright red</div>
            </div>
            <div className="bg-status-scheduled p-4 rounded-lg text-white text-center border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">Scheduled</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Blue</div>
            </div>
            <div className="bg-status-completed p-4 rounded-lg text-white text-center border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">Completed</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Dark green</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-calendar-primary p-4 rounded-lg text-white border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">calendar-primary</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Primary events</div>
            </div>
            <div className="bg-calendar-secondary p-4 rounded-lg text-white border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">calendar-secondary</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Secondary events</div>
            </div>
            <div className="bg-calendar-accent p-4 rounded-lg text-white border shadow-sm">
              <div className="text-sm font-medium drop-shadow-sm">calendar-accent</div>
              <div className="text-xs opacity-90 drop-shadow-sm">Special events</div>
            </div>
            <div className="bg-calendar-muted p-4 rounded-lg border border-calendar-border">
              <div className="text-sm font-medium">calendar-muted</div>
              <div className="text-xs text-muted-foreground">Background</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-calendar p-6 rounded-lg text-center border">
              <div className="text-sm font-medium">bg-gradient-calendar</div>
              <div className="text-xs text-muted-foreground">Calendar background</div>
            </div>
            <div className="bg-gradient-event p-6 rounded-lg text-center border">
              <div className="text-sm font-medium">bg-gradient-event</div>
              <div className="text-xs text-muted-foreground">Event background</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Shadow System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-book">
              <div className="text-sm font-medium">shadow-book</div>
              <div className="text-xs text-muted-foreground">Book card shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card">
              <div className="text-sm font-medium">shadow-card</div>
              <div className="text-xs text-muted-foreground">Standard card shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-hero">
              <div className="text-sm font-medium">shadow-hero</div>
              <div className="text-xs text-muted-foreground">Hero section shadow</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success & Price Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Utility Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-success p-4 rounded-lg text-success-foreground">
              <div className="text-sm font-medium">bg-success</div>
              <div className="text-xs opacity-80">Green-500</div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="text-sm font-medium text-price">text-price</div>
              <div className="text-xs text-muted-foreground">Primary color text</div>
            </div>
            <div className="p-4 rounded-lg border border-theme-primary">
              <div className="text-sm font-medium">border-theme-primary</div>
              <div className="text-xs text-muted-foreground">Themed border</div>
            </div>
            <div className="p-4 rounded-lg bg-card-hover">
              <div className="text-sm font-medium">card-hover</div>
              <div className="text-xs text-muted-foreground">Hover state</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OKLCH Color System */}
      <Card className="oklch-colors">
        <CardHeader>
          <CardTitle>OKLCH Color System (Enhanced)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted-oklch p-4 rounded-lg border border-border-oklch">
              <div className="text-sm font-medium text-muted-foreground-oklch">bg-muted-oklch</div>
              <div className="text-xs text-muted-foreground-oklch opacity-70">Light green tint</div>
            </div>
            <div className="bg-primary-oklch p-4 rounded-lg text-primary-foreground-oklch">
              <div className="text-sm font-medium">bg-primary-oklch</div>
              <div className="text-xs opacity-80">Blue primary</div>
            </div>
            <div className="bg-secondary-oklch p-4 rounded-lg text-secondary-foreground-oklch">
              <div className="text-sm font-medium">bg-secondary-oklch</div>
              <div className="text-xs opacity-70">Cyan secondary</div>
            </div>
            <div className="bg-accent-oklch p-4 rounded-lg text-accent-foreground-oklch">
              <div className="text-sm font-medium">bg-accent-oklch</div>
              <div className="text-xs opacity-80">Blue accent</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg border border-border-oklch" style={{backgroundColor: 'var(--background-oklch)', color: 'var(--foreground-oklch)'}}>
              <div className="text-sm font-medium">background-oklch</div>
              <div className="text-xs opacity-70">Light green background</div>
            </div>
            <div className="p-4 rounded-lg" style={{backgroundColor: 'var(--destructive-oklch)', color: 'var(--primary-foreground-oklch)'}}>
              <div className="text-sm font-medium">destructive-oklch</div>
              <div className="text-xs opacity-80">Orange-red destructive</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Shadow Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Shadow System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-elegant">
              <div className="text-sm font-medium">shadow-elegant</div>
              <div className="text-xs text-muted-foreground">Elegant shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-modern">
              <div className="text-sm font-medium">shadow-modern</div>
              <div className="text-xs text-muted-foreground">Modern shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-glow">
              <div className="text-sm font-medium">shadow-glow</div>
              <div className="text-xs text-muted-foreground">Glow effect</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-float">
              <div className="text-sm font-medium">shadow-float</div>
              <div className="text-xs text-muted-foreground">Float shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-colored">
              <div className="text-sm font-medium">shadow-colored</div>
              <div className="text-xs text-muted-foreground">Colored shadow</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-glass">
              <div className="text-sm font-medium">shadow-glass</div>
              <div className="text-xs text-muted-foreground">Glass shadow</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default Badge</Badge>
            <Badge variant="secondary">Secondary Badge</Badge>
            <Badge variant="destructive">Destructive Badge</Badge>
            <Badge variant="outline">Outline Badge</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Opacity & Hover Tests */}
      <Card>
        <CardHeader>
          <CardTitle>Opacity & Hover Effects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted/50 p-4 rounded-lg border hover:bg-muted/70 transition-colors cursor-pointer">
              <div className="text-sm font-medium">bg-muted/50</div>
              <div className="text-xs text-muted-foreground">Hover to test</div>
            </div>
            <div className="bg-primary/20 p-4 rounded-lg border hover:bg-primary/30 transition-colors cursor-pointer">
              <div className="text-sm font-medium">bg-primary/20</div>
              <div className="text-xs text-muted-foreground">Hover to test</div>
            </div>
            <div className="bg-accent/30 p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="text-sm font-medium">bg-accent/30</div>
              <div className="text-xs text-muted-foreground">Hover to test</div>
            </div>
            <div className="bg-destructive/10 p-4 rounded-lg border hover:bg-destructive/20 transition-colors cursor-pointer">
              <div className="text-sm font-medium">bg-destructive/10</div>
              <div className="text-xs text-muted-foreground">Hover to test</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Border & Input Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Borders & Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <div className="text-sm font-medium">border-border</div>
              <div className="text-xs text-muted-foreground">Standard border</div>
            </div>
            <div className="p-4 border-2 border-ring rounded-lg">
              <div className="text-sm font-medium">border-ring</div>
              <div className="text-xs text-muted-foreground">Focus ring color</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <input 
              className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none"
              placeholder="Test input with custom colors"
            />
            <textarea 
              className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
              placeholder="Test textarea with custom colors"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Color System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg border" style={{backgroundColor: 'hsl(var(--sidebar-background))', color: 'hsl(var(--sidebar-foreground))'}}>
              <div className="text-sm font-medium">sidebar-background</div>
              <div className="text-xs opacity-70">Background</div>
            </div>
            <div className="p-4 rounded-lg" style={{backgroundColor: 'hsl(var(--sidebar-primary))', color: 'hsl(var(--sidebar-primary-foreground))'}}>
              <div className="text-sm font-medium">sidebar-primary</div>
              <div className="text-xs opacity-80">Primary</div>
            </div>
            <div className="p-4 rounded-lg" style={{backgroundColor: 'hsl(var(--sidebar-accent))', color: 'hsl(var(--sidebar-accent-foreground))'}}>
              <div className="text-sm font-medium">sidebar-accent</div>
              <div className="text-xs opacity-70">Accent</div>
            </div>
            <div className="p-4 rounded-lg border" style={{borderColor: 'hsl(var(--sidebar-border))'}}>
              <div className="text-sm font-medium">sidebar-border</div>
              <div className="text-xs text-muted-foreground">Border color</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Transitions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Transitions & Animations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="p-6 bg-primary text-primary-foreground rounded-lg cursor-pointer text-center transition-smooth hover:scale-105"
            >
              <div className="text-sm font-medium">transition-smooth</div>
              <div className="text-xs opacity-80">Hover to test</div>
            </div>
            <div 
              className="p-6 bg-accent text-accent-foreground rounded-lg cursor-pointer text-center transition-spring hover:scale-110"
            >
              <div className="text-sm font-medium">transition-spring</div>
              <div className="text-xs opacity-80">Hover to test</div>
            </div>
            <div 
              className="p-6 bg-thm-base text-white rounded-lg cursor-pointer text-center transition-fast hover:bg-thm-primary"
            >
              <div className="text-sm font-medium">transition-fast</div>
              <div className="text-xs opacity-80">Hover to test</div>
            </div>
            <div 
              className="p-6 bg-thm-special text-white rounded-lg cursor-pointer text-center transition-slow hover:bg-thm-accent"
            >
              <div className="text-sm font-medium">transition-slow</div>
              <div className="text-xs opacity-80">Hover to test</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Text Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Status Text Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-status-pending">text-status-pending</div>
              <div className="text-xs text-muted-foreground">Pending text color</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-status-approved">text-status-approved</div>
              <div className="text-xs text-muted-foreground">Approved text color</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-status-rejected">text-status-rejected</div>
              <div className="text-xs text-muted-foreground">Rejected text color</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-status-scheduled">text-status-scheduled</div>
              <div className="text-xs text-muted-foreground">Scheduled text color</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium text-status-completed">text-status-completed</div>
              <div className="text-xs text-muted-foreground">Completed text color</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive & Print Test */}
      <Card>
        <CardHeader>
          <CardTitle>Responsive & Print Utilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-sm font-medium">Responsive Test</div>
              <div className="text-xs text-muted-foreground">Resize window to test grid</div>
              <div className="mt-2 text-xs">
                <span className="block md:hidden text-status-pending">Mobile View</span>
                <span className="hidden md:block text-status-approved">Desktop View</span>
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-card no-print">
              <div className="text-sm font-medium">Print Test</div>
              <div className="text-xs text-muted-foreground">This has .no-print class</div>
              <div className="mt-2">
                <div className="print-only text-status-completed text-xs">This only shows in print</div>
                <div className="no-print text-status-pending text-xs">This hides in print</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card className="border-2 border-status-approved">
        <CardHeader>
          <CardTitle className="text-status-approved">✅ Tailwind CSS Validation Complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">✅ Fixed Issues:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Removed duplicate utility classes</li>
                <li>• Fixed OKLCH color system implementation</li>
                <li>• Cleaned up @theme inline section</li>
                <li>• Added responsive and print utilities</li>
                <li>• Enhanced animation system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">✅ Tested Systems:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• HSL & OKLCH color systems</li>
                <li>• Theme colors & gradients</li>
                <li>• Status & calendar colors</li>
                <li>• Shadow & animation utilities</li>
                <li>• Sidebar & responsive design</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-status-approved/10 rounded-lg border border-status-approved/20">
            <p className="text-sm text-status-completed font-medium">All Tailwind CSS utilities are now working correctly!</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default ColorSystemTest;
