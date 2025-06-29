import { defineStore } from "pinia";
import type { Component } from "../ComponentLibrary/components";
import { useContentStore } from "./contentStore";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    _history: [[]] as Component[][],
    _currentIndex: 0,
  }),
  getters: {
    history: (state) => state._history,
    currentIndex: (state) => state._currentIndex,
    canUndo: (state) => state._currentIndex > 0,
    canRedo: (state) => state._currentIndex < state._history.length - 1,
  },
  actions: {
    addToHistory(document: Component[]) {
      // Remove deeply nested references to avoid mutation issues
      const documentCopy = JSON.parse(JSON.stringify(document));

      // If we are not at the end of the history, truncate the history
      if (this._currentIndex < this._history.length - 1) {
        this._history = this._history.slice(0, this._currentIndex + 1);
      }
      // Add the new document to the history
      this._history.push(documentCopy);
      // Update the current index
      this._currentIndex++;
    },
    undo() {
      console.log("Undo action triggered");
      if (this.canUndo) {
        this._currentIndex--;
        const contentStore = useContentStore();
        contentStore.setActiveComponent(null, null);
        contentStore.setDocument(this._history[this._currentIndex]);
      }
      return null;
    },
    redo() {
      if (this.canRedo) {
        this._currentIndex++;
        const contentStore = useContentStore();
        contentStore.setDocument(this._history[this._currentIndex]);
      }
      return null;
    },
    clearHistory() {
      this._history = [];
      this._currentIndex = -1;
    },
  },
});
