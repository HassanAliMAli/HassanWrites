import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import './Tabs.css';

const TabsContext = createContext({});

const Tabs = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("tabs", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

const TabsList = ({ className, children }) => {
    return (
        <div className={cn("tabs-list", className)} role="tablist">
            {children}
        </div>
    );
};

const TabsTrigger = ({ value, className, children }) => {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            className={cn("tabs-trigger", isActive && "active", className)}
            onClick={() => setActiveTab(value)}
            data-state={isActive ? "active" : "inactive"}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${value}`}
            id={`tab-${value}`}
            tabIndex={isActive ? 0 : -1}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, className, children }) => {
    const { activeTab } = useContext(TabsContext);

    if (activeTab !== value) return null;

    return (
        <div
            className={cn("tabs-content", className)}
            role="tabpanel"
            id={`panel-${value}`}
            aria-labelledby={`tab-${value}`}
        >
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
