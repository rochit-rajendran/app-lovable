 import { cn } from '@/lib/utils';
 import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
 
 interface MetricCardProps {
   title: string;
   value: string;
   change?: number;
   changeLabel?: string;
   icon?: React.ReactNode;
   variant?: 'default' | 'accent';
 }
 
 export function MetricCard({ 
   title, 
   value, 
   change, 
   changeLabel,
   icon,
   variant = 'default'
 }: MetricCardProps) {
   const getTrendIcon = () => {
     if (change === undefined) return null;
     if (change > 0) return <TrendingUp className="h-3 w-3" />;
     if (change < 0) return <TrendingDown className="h-3 w-3" />;
     return <Minus className="h-3 w-3" />;
   };
 
   const getTrendColor = () => {
     if (change === undefined) return '';
     if (change > 0) return 'text-positive';
     if (change < 0) return 'text-negative';
     return 'text-muted-foreground';
   };
 
   return (
     <div className={cn(
       'rounded-xl border p-5 transition-all duration-200',
       variant === 'default' 
         ? 'bg-card border-border hover:shadow-soft' 
         : 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:shadow-soft'
     )}>
       <div className="flex items-start justify-between">
         <div>
           <p className="text-sm text-muted-foreground">{title}</p>
           <p className="text-2xl font-bold mt-1 tabular-nums">{value}</p>
           {change !== undefined && (
             <div className={cn('flex items-center gap-1 mt-1 text-xs font-medium', getTrendColor())}>
               {getTrendIcon()}
               <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
               {changeLabel && (
                 <span className="text-muted-foreground ml-1">{changeLabel}</span>
               )}
             </div>
           )}
         </div>
         {icon && (
           <div className={cn(
             'p-2 rounded-lg',
             variant === 'default' ? 'bg-muted' : 'bg-accent/10'
           )}>
             {icon}
           </div>
         )}
       </div>
     </div>
   );
 }