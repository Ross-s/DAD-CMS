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
    id?: string;
    internaleName?: string;
    type?: string
    version?: string;
    config?: Record<string, any>;
    children?: Component[];
}

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
    hideFromUI: false,
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
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "5.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World5",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "6.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World6",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "7.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World7",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "8.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World8",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "9.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World9",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "10.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World10",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "11.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World11",
    }
  },
  {
    name: "Text",
    description: "A simple text component",
    type: "text",
    icon: "📝",
    version: "12.0.0",
    configFields: {
      text: {
        type: "select",
        label: "Text",
        nullable: false,
        options: [],
      },
    },
    defaultConfig: {
        text: "Hello World12",
    }
  },
];
