import { createSlice } from '@reduxjs/toolkit'

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [] },
  reducers: {
    addToFavorites: (state, action) => {
      if (!state.items.find(i => i.id === action.payload.id)) {
        state.items.push(action.payload)
      }
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearFavorites: (state) => { state.items = [] },
  },
})

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer