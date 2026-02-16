 import { ReactNode } from 'react';
 import { AppSidebar } from './AppSidebar';
 import { Header } from './Header';
 import { SidebarProvider } from '@/components/ui/sidebar';
 
 interface AppLayoutProps {
   children: ReactNode;
 }
 
 export function AppLayout({ children }: AppLayoutProps) {
   return (
     <SidebarProvider>
       <div className="min-h-screen flex w-full">
         <AppSidebar />
         <div className="flex-1 flex flex-col min-w-0">
           <Header />
           <main className="flex-1 overflow-auto">
             {children}
           </main>
         </div>
       </div>
     </SidebarProvider>
   );
 }