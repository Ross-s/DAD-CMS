import { defineStore } from "pinia";
import {
  ALL_COMPONENTS,
  type Component,
  type ComponentDefinition,
  type MiniComponentDefinition,
} from "../ComponentLibrary/components";
import { useHistoryStore } from "./historyStore";

const generateId = () =>
  `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const createComponentChildren = (
  defaultChildren: Component[],
  components: ComponentDefinition[]
): Component[] => {
  return defaultChildren.map((child) => {
    // Ensure type and version exist
    if (!child.type || !child.version) {
      throw new Error(`Invalid child component: missing type or version`);
    }

    const childDefinition = components.find(
      (component) =>
        component.type === child.type && component.version === child.version
    );

    if (!childDefinition) {
      // If we can't find the definition, just create a copy with new ID
      return {
        ...child,
        id: generateId(),
        children: child.children
          ? createComponentChildren(child.children, components)
          : [],
      };
    }

    // Create a proper new component instance
    return {
      id: generateId(),
      type: childDefinition.type,
      version: childDefinition.version,
      config: { ...(child.config || childDefinition.defaultConfig) },
      internalName: child.internalName || "",
      children: createComponentChildren(
        child.children || childDefinition.defaultChildren || [],
        components
      ),
    };
  });
};

const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split(".").map(Number);
  const v2Parts = version2.split(".").map(Number);

  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }

  return 0;
};

// Find the highest version component definition for a given type
const findHighestVersionComponent = (
  type: string,
  componentDefinitions: ComponentDefinition[]
): ComponentDefinition | undefined => {
  const components = componentDefinitions.filter((comp) => comp.type === type);

  if (components.length === 0) return undefined;

  return components.reduce((highest, current) => {
    if (!highest) return current;
    return compareVersions(current.version, highest.version) > 0
      ? current
      : highest;
  });
};

interface ComponentLocation {
  component: Component;
  parent: Component[] | null;
  index: number;
  componentPath: number[];
  componentIdPath: string[];
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
    _components: ALL_COMPONENTS,
    _document: [] as Component[],
    _activeComponent: {
      component: null as Component | null,
      setBy: "contentArea" as "tree" | "contentArea" | null,
    },
  }),
  getters: {
    activeComponent: (state) => state._activeComponent,
    document: (state) => state._document,
    components: (state) => state._components,
  },
  actions: {
    setDocument(document: Component[]) {
      this._document = JSON.parse(JSON.stringify(document));
    },
    findComponentByTypeAndVersion(
      type: string,
      version?: string | null
    ): ComponentDefinition | undefined {
      if (version === null || version === undefined) {
        // If no version is specified, find the highest version for this type
        return findHighestVersionComponent(type, this._components);
      }

      return this._components.find(
        (component) => component.type === type && component.version === version
      );
    },
    setActiveComponent(
      component: Component | null,
      setBy: "tree" | "contentArea" | null
    ) {
      this._activeComponent = {
        component,
        setBy,
      };
    },
    findComponentById(componentId: string): ComponentLocation | null {
      const searchInArray = (
        components: Component[],
        parent: Component[],
        currentPath: number[] = [],
        componentIdPath: string[] = []
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
              componentIdPath: [...componentIdPath, component.id],
            };
          }

          // Recursively search in children if they exist
          if (component.children && component.children.length > 0) {
            const result = searchInArray(
              component.children,
              component.children,
              componentPath,
              [...componentIdPath, component.id!]
            );
            if (result) {
              return result;
            }
          }
        }

        return null;
      };

      return searchInArray(this._document, this._document);
    },
    addComponent(
      componentOrComponentDefinition: MiniComponentDefinition | Component,
      componentLocation: AddComponentLocation,
      saveToHistory = true
    ) {
      let newComponent: Component;

      if ("config" in componentOrComponentDefinition) {
        newComponent = componentOrComponentDefinition;
      } else {
        const componentDefinitionCast =
          componentOrComponentDefinition as MiniComponentDefinition;

        const componentDefinition = this.findComponentByTypeAndVersion(
          componentDefinitionCast.type,
          componentDefinitionCast.version
        );

        if (!componentDefinition) {
          throw new Error("Component not found");
        }

        // Create new component with properly instantiated children
        newComponent = {
          id: generateId(),
          type: componentDefinition.type,
          version: componentDefinition.version,
          config: { ...componentDefinition.defaultConfig },
          children: createComponentChildren(
            componentDefinition.defaultChildren || [],
            this._components
          ),
        };
      }

      let targetArray: Component[];
      let insertionIndex: number;

      if (componentLocation.componentId === null) {
        // Adding to root level
        targetArray = this._document;
        insertionIndex =
          componentLocation.type === "parent"
            ? componentLocation.insertionPosition
            : this._document.length;
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

      if (saveToHistory) {
        // Save the current document state to history
        const historyStore = useHistoryStore();
        historyStore.addToHistory(this._document);
      }
    },

    deleteComponent(componentId: string, saveToHistory = true) {
      const location = this.findComponentById(componentId);
      if (!location) {
        throw new Error("Component not found");
      }

      location.parent!.splice(location.index, 1);

      if (this._activeComponent.component?.id === componentId) {
        this._activeComponent.component = null;
      }

      if (saveToHistory) {
        // Save the current document state to history
        const historyStore = useHistoryStore();
        historyStore.addToHistory(this._document);
      }
    },

    updateComponentById(
      componentId: string,
      updatedFields: Partial<Component>,
      saveToHistory = true
    ) {
      const location = this.findComponentById(componentId);
      if (!location) {
        throw new Error("Component not found");
      }

      Object.assign(location.component, updatedFields);

      if (saveToHistory) {
        // Save the current document state to history
        const historyStore = useHistoryStore();
        historyStore.addToHistory(this._document);
      }
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
        componentLocation,
        false
      );

      this.deleteComponent(oldComponentId, false);
      this.updateComponentById(tempComponentId, {
        id: oldComponentId,
      }, false);

      const historyStore = useHistoryStore();
      historyStore.addToHistory(this._document);
    },
  },
});
