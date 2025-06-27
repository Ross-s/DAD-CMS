import { defineStore } from "pinia";
import { ALL_COMPONENTS, type Component } from "../ComponentLibrary/components";

export const useContentStore = defineStore("content", {
  state: () => ({
    components: ALL_COMPONENTS,
    document: [] as Component[]
  }),
  actions: {
    setDocument(document: Component[]) {
      this.document = document;
    },
  }
});