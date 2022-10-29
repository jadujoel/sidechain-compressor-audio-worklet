import { configureStore, createSlice } from '@reduxjs/toolkit';

function loadState() {
    try {
        const serializedState = localStorage.getItem('state')
        if (serializedState) {
            return JSON.parse(serializedState)
        }
    }
    catch {
        console.warn("[state]: load failed")
    }
}
function saveState<T extends Record<string, any>>(state: T) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    }
    catch {
        console.warn("[state]: save failed")
    }
}

const initialState = {
    threshold: -36,
    ratio: 4,
    attack: 0.044,
    release: 0.070,
    mix: 1,
    gain: 0,
    sidechain: true,
    bypass: false,
}

export const slice = createSlice({
    name: 'compressor',
    initialState,
    reducers: {
        setThreshold: (state, action: { payload: number }) => {
            state.threshold = action.payload
        },
        setRatio: (state, action: { payload: number }) => {
            state.ratio = action.payload
        },
        setAttack: (state, action: { payload: number }) => {
            state.attack = action.payload
        },
        setRelease: (state, action: { payload: number }) => {
            state.release = action.payload
        },
        setMix: (state, action: { payload: number }) => {
            state.mix = action.payload
        },
        setGain: (state, action: { payload: number }) => {
            state.gain = action.payload
        },
        setSidechain: (state, action: { payload: boolean }) => {
            state.sidechain = action.payload
        },
        setBypass: (state, action: { payload: boolean }) => {
            state.bypass = action.payload
        },
    }
})

export const store = configureStore({
    preloadedState: loadState(),
    reducer: {
        compressor: slice.reducer,
    },
})

store.subscribe(() => {
    saveState(store.getState());
});

export type StoreState = ReturnType<typeof store['getState']>

export const { setThreshold, setAttack, setGain, setMix, setRatio, setRelease, setSidechain, setBypass } = slice.actions
