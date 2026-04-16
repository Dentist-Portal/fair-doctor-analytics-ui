import { configureStore } from "@reduxjs/toolkit";
import { kpiService } from "../services/kpi";

export const store = configureStore({
    reducer: {
        [kpiService.reducerPath]: kpiService.reducer
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(kpiService.middleware)
})