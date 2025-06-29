export type ComponentConfigField<TName> = {
  type: TName;
  label?: string;
  nullable?: boolean;
};

export type ComponentConfigFieldWithExtraFields<
  TName,
  TExtraFields
> = ComponentConfigField<TName> & TExtraFields;

export type ComponentConfigFieldSelectionOption = {
  label: string;
  value: string;
};

export type Component = {
  id?: string;
  internalName?: string;
  type?: string;
  version?: string;
  config?: Record<string, any>;
  children?: Component[];
};

export type MiniComponentDefinition = {
  type: string;
  version: string;
};

export type ComponentDefinition = {
  name: string;
  description: string;
  type: string;
  icon: string;
  version: string;
  hideFromUI?: boolean;
  defaultConfig?: Record<string, any>;
  defaultChildren?: Component[];
  configFields: {
    [key: string]:
      | ComponentConfigFieldWithExtraFields<
          "text",
          {
            maxLength?: number;
            minLength?: number;
          }
        >
      | ComponentConfigFieldWithExtraFields<
          "number",
          {
            min?: number;
            max?: number;
          }
        >
      | ComponentConfigField<"boolean">
      | ComponentConfigFieldWithExtraFields<
          "select",
          { options: ComponentConfigFieldSelectionOption[] }
        >
      | ComponentConfigField<"color">
      | ComponentConfigField<"url">
      | ComponentConfigField<"tabManager">;
  };
};

export const ALL_COMPONENTS: ComponentDefinition[] = [
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "1.0.0",
    configFields: {
      text: {
        type: "text",
        label: "Text",
        nullable: false,
        minLength: 1,
        maxLength: 1000,
      },
      test: {
        type: "select",
        label: "Test",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ],
        nullable: true,
      },
    },
    defaultConfig: {
      text: "Hello World1",
      test: "",
    },
  },
  {
    name: "Container",
    description: "A container component that can hold other components",
    type: "container",
    icon: "📦",
    hideFromUI: false,
    version: "1.0.0",
    configFields: {},
    defaultConfig: {},
    defaultChildren: [
      {
        type: "text",
        version: "1.0.0",
        config: {
          text: "Default Text in Container",
        },
        children: [],
      },
    ],
  },
  {
    name: "Tabs",
    description: "A component that holds multiple tabs",
    type: "tabs",
    icon: "📑",
    version: "1.0.0",
    configFields: {
      tabs: {
        type: "tabManager",
        label: "Tabs",
        nullable: false,
      },
    },
    defaultConfig: {},
    defaultChildren: [
      {
        type: "tab",
        version: "1.0.0",
        internalName: "New Tab",
        config: {
          title: "New Tab",
        }
      },
    ],
  },
  {
    name: "Tab",
    description: "A single tab within a Tabs component",
    type: "tab",
    icon: "🗂️",
    version: "1.0.0",
    configFields: {
      title: {
        type: "text",
        label: "Tab Title",
        nullable: false,
        minLength: 1,
        maxLength: 30,
      },
    },
    hideFromUI: true,
    defaultConfig: {
      title: "New Tab",
    },
    defaultChildren: [
      {
        type: "text",
        version: "1.0.0",
        config: {
          text: "Default Text in Tab",
        },
        children: [],
      },
    ],
  },
];
