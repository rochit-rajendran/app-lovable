 import { Search, Bell, Plus, ChevronDown } from 'lucide-react';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import { SidebarTrigger } from '@/components/ui/sidebar';
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 
 export function Header() {
   return (
     <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
       <div className="flex items-center gap-4">
         <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
         <div className="relative w-80">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search bonds, issuers, ISINs..." 
             className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
           />
         </div>
       </div>
 
       <div className="flex items-center gap-2">
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="outline" size="sm" className="gap-2">
               <Plus className="h-4 w-4" />
               Quick Actions
               <ChevronDown className="h-3 w-3 opacity-50" />
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-48 bg-popover">
             <DropdownMenuItem>Add to Watchlist</DropdownMenuItem>
             <DropdownMenuItem>Create Alert</DropdownMenuItem>
             <DropdownMenuItem>Export Data</DropdownMenuItem>
             <DropdownMenuItem>Generate Report</DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
 
         <Button variant="ghost" size="icon" className="relative">
           <Bell className="h-4 w-4" />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
         </Button>
       </div>
     </header>
   );
 }