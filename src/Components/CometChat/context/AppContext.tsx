import React, { createContext, useMemo, useReducer, useState } from "react";
import { appReducer, defaultAppState } from "./appReducer";

type AppContextType = {
    appState: typeof defaultAppState;
    setAppState: React.Dispatch<any>;
    messageActive: string;
    setMessageActive: React.Dispatch<React.SetStateAction<string>>;
};

export const AppContext = createContext<AppContextType>({
    appState: defaultAppState,
    setAppState: () => {},
    messageActive: "offline",
    setMessageActive: () => {},
});

export const AppContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [appState, setAppState] = useReducer(appReducer, defaultAppState);
    const [messageActive, setMessageActive] = useState("offline");

    const contextValue = useMemo(
        () => ({
            appState,
            setAppState,
            messageActive,
            setMessageActive,
        }),
        [appState, messageActive], // dependencies
    );

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
