import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./features/auth/authSlice";
import themeReducer from './features/theme/themeSlice';
const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        theme: themeReducer
    }
})

export default store;