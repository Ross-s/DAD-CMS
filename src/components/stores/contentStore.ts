import { defineStore } from "pinia";
import {
  ALL_COMPONENTS,
  type Component,
  type ComponentDefinition,
  type MiniComponentMetadata,
} from "../ComponentLibrary/components";

const generateId = () =>
  `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface ComponentLocation {
  component: Component;
  parent: Component[] | null;
  index: number;
  componentPath: number[];
}

export type AddComponentLocation =
  | {
      componentId: string | null;
      type: "parent";
      insertionPosition: number;
    }
  | {
      componentId: string | null;
      type: "sibling";
      insertionPosition: "before" | "after";
    };

export const useContentStore = defineStore("content", {
  state: () => ({
    components: ALL_COMPONENTS,
    document: [] as Component[],
    activeComponent: {
      component: null as Component | null,
      setBy: "contentArea" as "tree" | "contentArea",
    },
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
    setActiveComponent(component: Component | null, setBy: "tree" | "contentArea") {
      this.activeComponent = {
        component,
        setBy,
      };
    },
    findComponentById(componentId: string): ComponentLocation | null {
      const searchInArray = (
        components: Component[],
        parent: Component[],
        currentPath: number[] = []
      ): ComponentLocation | null => {
        for (let i = 0; i < components.length; i++) {
          const component = components[i];
          const componentPath = [...currentPath, i];

          // Check if this is the component we're looking for
          if (component.id === componentId) {
            return {
              component,
              parent,
              index: i,
              componentPath,
            };
          }

          // Recursively search in children if they exist
          if (component.children && component.children.length > 0) {
            const result = searchInArray(
              component.children,
              component.children,
              componentPath
            );
            if (result) {
              return result;
            }
          }
        }

        return null;
      };

      return searchInArray(this.document, this.document);
    },
    addComponent(
      componentOrComponentMetadata: MiniComponentMetadata | Component,
      componentLocation: AddComponentLocation
    ) {
      let newComponent: Component;

      if ("config" in componentOrComponentMetadata) {
        newComponent = componentOrComponentMetadata;
      } else {
        const componentMetadata =
          componentOrComponentMetadata as MiniComponentMetadata;

        const componentDefinition = this.findComponentByTypeAndVersion(
          componentMetadata.type,
          componentMetadata.version
        );

        if (!componentDefinition) {
          throw new Error("Component not found");
        }

        newComponent = {
          id: generateId(),
          type: componentDefinition.type,
          version: componentDefinition.version,
          config: { ...componentDefinition.defaultConfig },
          children: [],
        };
      }

      let targetArray: Component[];
      let insertionIndex: number;

      if (componentLocation.componentId === null) {
        // Adding to root level
        targetArray = this.document;
        insertionIndex =
          componentLocation.type === "parent"
            ? componentLocation.insertionPosition
            : this.document.length;
      } else {
        const existingComponent = this.findComponentById(
          componentLocation.componentId
        );

        if (!existingComponent) {
          throw new Error("Target component not found");
        }

        if (componentLocation.type === "parent") {
          // Add as child of the existing component
          if (!existingComponent.component.children) {
            existingComponent.component.children = [];
          }
          targetArray = existingComponent.component.children;
          insertionIndex = componentLocation.insertionPosition;
        } else {
          // Add as sibling of the existing component
          targetArray = existingComponent.parent!;
          insertionIndex =
            componentLocation.insertionPosition === "before"
              ? existingComponent.index
              : existingComponent.index + 1;
        }
      }

      // Ensure insertion index is within bounds
      insertionIndex = Math.max(
        0,
        Math.min(insertionIndex, targetArray.length)
      );

      targetArray.splice(insertionIndex, 0, newComponent);
    },

    deleteComponent(componentId: string) {
      const location = this.findComponentById(componentId);
      if (!location) {
        throw new Error("Component not found");
      }

      location.parent!.splice(location.index, 1);
    },

    updateComponentById(
      componentId: string,
      updatedFields: Partial<Component>
    ) {
      const location = this.findComponentById(componentId);
      if (!location) {
        throw new Error("Component not found");
      }

      Object.assign(location.component, updatedFields);
    },

    moveComponent(
      oldComponentId: string,
      componentLocation: AddComponentLocation
    ) {
      const location = this.findComponentById(oldComponentId);
      if (!location) {
        throw new Error(`Component with ID ${oldComponentId} not found`);
      }

      const componentToMove = location.component;
      const tempComponentId = generateId();

      this.addComponent(
        {
          ...componentToMove,
          id: tempComponentId,
        },
        componentLocation
      );

      this.deleteComponent(oldComponentId);
      this.updateComponentById(tempComponentId, {
        id: oldComponentId,
      });
    },
  },
});
