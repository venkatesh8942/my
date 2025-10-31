import React from 'react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { motion, AnimatePresence } from 'framer-motion';
    import { toolTabsConfig } from '@/config/toolTabsConfig';
    import { getAnimationDirection } from '@/lib/animationUtils';

    const ToolTabs = ({ activeTab, onTabChange, initialLoad }) => {
      return (
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="relative w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1 mb-6 sm:flex sm:overflow-x-auto sm:pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
              {toolTabsConfig.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex-col sm:flex-row h-auto py-2 px-2 sm:px-3 sm:py-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-sky-400 data-[state=active]:shadow-lg text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
                >
                  <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1 sm:mb-0 sm:mr-1.5" /> 
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <AnimatePresence mode="wait">
            {toolTabsConfig.map(tab => (
              activeTab === tab.id && (
                <TabsContent key={tab.id} value={tab.id} forceMount={true} asChild>
                  <motion.div
                    initial={{ opacity: 0, x: getAnimationDirection(activeTab, tab.id, initialLoad) }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -getAnimationDirection(activeTab, tab.id, false) }}
                    transition={{ type: "tween", duration: 0.25 }}
                    className="outline-none focus-visible:ring-0"
                  >
                    {tab.component}
                  </motion.div>
                </TabsContent>
              )
            ))}
          </AnimatePresence>
        </Tabs>
      );
    };

    export default ToolTabs;