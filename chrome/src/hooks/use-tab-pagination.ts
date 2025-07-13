import { useEffect, useState } from 'react';

interface Tab {
  id: string;
  name: string;
	color: string;
	order: number;
}

type GetTabHeightFn = (tabName: string) => number;

const BASE_HEIGHT = 120;

interface UsePaginationResult {
  tabsPerPage: number[];
  activePageIndex: number;
  sortedTabs: Tab[];
}

export function useTabPaginationWithActivePage(
  unsortedTabs: Record<string, { name: string; color: string; order: number }>,
  listRef: React.RefObject<HTMLElement | null>,
  getTabHeight: GetTabHeightFn,
  activeTabId: string | null
): UsePaginationResult {
  const [tabsPerPage, setTabsPerPage] = useState<number[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);

  useEffect(() => {
    if (!listRef.current) return;

    const listHeight = listRef.current.clientHeight;

    // Sort tabs by order
    const sortedTabEntries = Object.entries(unsortedTabs).sort(([, a], [, b]) => a.order - b.order);
    const sortedTabs: Tab[] = sortedTabEntries.map(([id, data]) => ({ id, name: data.name, color: data.color, order: data.order }));

    const newPages: number[] = [];
    const tabIndexToPage: number[] = [];

    let currentPageTabCount = 0;
    let currentHeight = BASE_HEIGHT;
    let currentPage = 0;

    for (let i = 0; i < sortedTabs.length; i++) {
      const tabHeight = getTabHeight(sortedTabs[i].name);
      const nextHeight = currentHeight + tabHeight + 2;

      if (nextHeight <= listHeight) {
        currentHeight = nextHeight;
        currentPageTabCount++;
      } else {
        newPages.push(currentPageTabCount);
        currentPage++;
        currentPageTabCount = 1;
        currentHeight = BASE_HEIGHT + tabHeight + 2;
      }

      tabIndexToPage[i] = currentPage;
    }

    if (currentPageTabCount > 0) {
      newPages.push(currentPageTabCount);
    }

    setTabsPerPage(newPages);

    // Find active tab index (by id) in sorted tabs
    if (activeTabId) {
      const tabIndex = sortedTabs.findIndex((tab) => tab.id === activeTabId);
      if (tabIndex !== -1) {
        setActivePageIndex(tabIndexToPage[tabIndex]);
      }
    }

  }, [unsortedTabs, listRef, getTabHeight, activeTabId]);

  const sortedTabs = Object.entries(unsortedTabs)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([id, data]) => ({ id, name: data.name, color: data.color, order: data.order }));

  return { tabsPerPage, activePageIndex, sortedTabs };
}