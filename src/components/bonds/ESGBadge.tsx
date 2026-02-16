 import { cn } from '@/lib/utils';
 import { Leaf, Users, Building2 } from 'lucide-react';
 
 interface ESGBadgeProps {
   type: 'environmental' | 'social' | 'governance' | 'overall';
   score?: number;
   size?: 'sm' | 'md';
   showLabel?: boolean;
 }
 
 const config = {
   environmental: {
     icon: Leaf,
     label: 'E',
     fullLabel: 'Environmental',
     color: 'bg-esg-e/10 text-esg-e border-esg-e/20',
   },
   social: {
     icon: Users,
     label: 'S',
     fullLabel: 'Social',
     color: 'bg-esg-s/10 text-esg-s border-esg-s/20',
   },
   governance: {
     icon: Building2,
     label: 'G',
     fullLabel: 'Governance',
     color: 'bg-esg-g/10 text-esg-g border-esg-g/20',
   },
   overall: {
     icon: Leaf,
     label: 'ESG',
     fullLabel: 'ESG Score',
     color: 'bg-accent/10 text-accent border-accent/20',
   },
 };
 
 export function ESGBadge({ type, score, size = 'sm', showLabel = false }: ESGBadgeProps) {
   const { icon: Icon, label, fullLabel, color } = config[type];
 
   return (
     <div
       className={cn(
         'inline-flex items-center gap-1.5 rounded-full border font-medium',
         color,
         size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
       )}
     >
       <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
       <span>{showLabel ? fullLabel : label}</span>
       {score !== undefined && (
         <span className="font-semibold tabular-nums">{score}</span>
       )}
     </div>
   );
 }
 
 interface SustainabilityTagsProps {
   isGreen?: boolean;
   isSustainability?: boolean;
   isClimateAligned?: boolean;
 }
 
 export function SustainabilityTags({ isGreen, isSustainability, isClimateAligned }: SustainabilityTagsProps) {
   if (!isGreen && !isSustainability && !isClimateAligned) return null;
 
   return (
     <div className="flex items-center gap-1.5 flex-wrap">
       {isGreen && (
         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
           <Leaf className="h-3 w-3" />
           Green
         </span>
       )}
       {isSustainability && !isGreen && (
         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info border border-info/20">
           Sustainable
         </span>
       )}
       {isClimateAligned && (
         <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-chart-3/10 text-chart-3 border border-chart-3/20">
           Climate
         </span>
       )}
     </div>
   );
 }