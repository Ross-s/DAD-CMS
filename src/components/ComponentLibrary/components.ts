export type ComponentConfigField<TName, TValueType> = {
  type: TName;
  label?: string;
  nullable?: boolean;
};

export type ComponentConfigFieldWithExtraFields<
  TName,
  TValueType,
  TExtraFields
> = ComponentConfigField<TName, TValueType> & TExtraFields;

export type ComponentConfigFieldSelectionOption = {
  label: string;
  value: string;
};

export type Component = {
    type?: string
    version?: string;
    config?: Record<string, any>;
    children?: Component[];
}

export type MiniComponentMetadata = {
  type: string;
  version: string;
};


export type ComponentDefinition = {
  name: string;
  description: string;
  type: string;
  icon: string;
  version: string;
  allowsChildren?: boolean;
  defaultConfig?: Record<string, any>;
  configFields: {
    [key: string]:
      | ComponentConfigField<"text", string>
      | ComponentConfigFieldWithExtraFields<
          "number",
          number,
          {
            min?: number;
            max?: number;
          }
        >
      | ComponentConfigField<"boolean", boolean>
      | ComponentConfigFieldWithExtraFields<
          "select",
          string,
          { options: ComponentConfigFieldSelectionOption[] }
        >
      | ComponentConfigField<"color", string>
      | ComponentConfigField<"url", string>;
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
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World1",
    }
  },
  {
    name: "Container",
    description: "A container component that can hold other components",
    type: "container",
    icon: "📦",
    version: "1.0.0",
    configFields: {},
    defaultConfig: {},
    allowsChildren: true
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "2.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World2",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "3.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World3",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "4.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World4",
    }
  },
];
