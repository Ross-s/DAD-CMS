import { defineStore } from "pinia";
import {
  ALL_COMPONENTS,
  type Component,
  type ComponentDefinition,
  type MiniComponentMetadata,
} from "../ComponentLibrary/components";

export const useContentStore = defineStore("content", {
  state: () => ({
    components: ALL_COMPONENTS,
    document: [] as Component[],
  }),
  actions: {
    setDocument(document: Component[]) {
      this.document = document;
    },
    findComponentByTypeAndVersion(
      type: string,
      version: string
    ): ComponentDefinition | undefined {
      return this.components.find(
        (component) => component.type === type && component.version === version
      );
    },
    addComponent(
      componentOrComponentMetadata: MiniComponentMetadata | Component,
      position: number[]
    ) {
      let newComponent: Component;

      if ("config" in componentOrComponentMetadata) {
        newComponent = componentOrComponentMetadata;
      } else {
        const componentMetadata = componentOrComponentMetadata as MiniComponentMetadata;

        const componentDefinition = this.findComponentByTypeAndVersion(
          componentMetadata.type,
          componentMetadata.version
        );

        if (!componentDefinition) {
          throw new Error("Component not found");
        }

        newComponent = {
          type: componentDefinition.type,
          version: componentDefinition.version,
          config: { ...componentDefinition.defaultConfig },
          children: [],
        };
      }

      let currentLevel = this.document;
      for (let i = 0; i < position.length - 1; i++) {
        const index = position[i];
        if (!currentLevel[index]) {
          currentLevel[index] = {};
        }
        currentLevel = currentLevel[index].children || [];
      }

      currentLevel.splice(position[position.length - 1], 0, newComponent);
    },

    deleteComponent(position: number[]) {
      let currentLevel = this.document;
      for (let i = 0; i < position.length - 1; i++) {
        const index = position[i];
        if (!currentLevel[index]) {
          throw new Error("Component not found at the specified position");
        }
        currentLevel = currentLevel[index].children || [];
      }

      const indexToDelete = position[position.length - 1];
      if (indexToDelete < 0 || indexToDelete >= currentLevel.length) {
        throw new Error("Index out of bounds");
      }

      currentLevel.splice(indexToDelete, 1);
    },

    moveComponent(
      component: Component,
      oldPosition: number[],
      newPosition: number[]
    ) {
      // this is not fit for purpose yet, it will not work since it relies on indexes
      // that may change when the component is moved
      console.log("Moving component from", oldPosition, "to", newPosition);
      this.deleteComponent(oldPosition);
      this.addComponent(component, newPosition);
    },
  },
});
