import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { canvasSlice } from "../entities/renderer/model";
import { toolSlice } from "../entities/tools/model";

export const store = configureStore({
  reducer: {
    [canvasSlice.name]: canvasSlice.reducer,
    [toolSlice.name]: toolSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
