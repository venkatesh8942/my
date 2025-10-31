import React, { useState, useEffect } from 'react';
    import { Toaster } from "@/components/ui/toaster";
    import AppHeader from "@/components/layout/AppHeader";
    import AppFooter from "@/components/layout/AppFooter";
    import ToolTabs from "@/components/layout/ToolTabs";
    import { toolTabsConfig } from '@/config/toolTabsConfig';
    
    function App() {
      const [activeTab, setActiveTab] = useState(toolTabsConfig[0].id);
      const [initialLoad, setInitialLoad] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => setInitialLoad(false), 100); 
        return () => clearTimeout(timer);
      }, []);

      const handleTabChange = (newTabId) => {
        setActiveTab(newTabId);
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center p-2 sm:p-4 md:p-6">
          <AppHeader />
          
          <main className="w-full max-w-5xl px-2 sm:px-0">
            <ToolTabs 
              activeTab={activeTab}
              onTabChange={handleTabChange}
              initialLoad={initialLoad}
            />
          </main>

          <AppFooter />
          <Toaster />
        </div>
      );
    }

    export default App;