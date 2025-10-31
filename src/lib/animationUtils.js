import { toolTabsConfig } from '@/config/toolTabsConfig';

    export const getAnimationDirection = (activeTabId, targetTabId, initialLoad) => {
      if (initialLoad) return 0;
      const currentIndex = toolTabsConfig.findIndex(t => t.id === activeTabId);
      const targetIndex = toolTabsConfig.findIndex(t => t.id === targetTabId);
      if (targetIndex > currentIndex) return 30;
      if (targetIndex < currentIndex) return -30;
      return 0;
    };