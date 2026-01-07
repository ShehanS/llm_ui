export const NODE_CATALOG = {
    "trigger.llm": {
        type: "trigger.llm",
        label: "LLM Model",
        color: "#970ec4",
        config: {
            icon: "",
            inputProps: [
                {
                    type: "select",
                    name: "LLM Model",
                    displayName: "Select Option",
                    values: [{name: "OpenAI", value: "OpenAI"}, {name: "Gemini", value: "Gemini"}],
                    defaultValue: {name: "OpenAI", value: "OpenAI"},
                    required: true,
                    value: null
                },
                {
                    type: "text",
                    values: [],
                    name: "apiKey",
                    defaultValue: "",
                    value: "",
                    displayName: "API Key",
                    required: true
                },
                {
                    type: "number",
                    values: [],
                    name: "temperature",
                    defaultValue: 0,
                    value: 0,
                    displayName: "Temperature",
                    required: true
                }
            ]
        },
        inputs: [{id: "in-default", label: "Input", position: "left"}],
        outputs: [{id: "out-default", label: "Default", position: "right"}],
    },
    "trigger.whatsapp": {
        type: "trigger.whatsapp",
        label: "WhatsApp Trigger",
        color: "#6366f1",
        config: {
            icon: "",
            inputProps: [
                {
                    type: "text",
                    values: [],
                    name: "apiKey",
                    defaultValue: "",
                    value: "",
                    displayName: "API Key",
                    required: true
                },
                {
                    type: "text",
                    values: [],
                    name: "auth",
                    defaultValue: "",
                    value: "",
                    displayName: "Auth",
                    required: true
                },

            ]
        },
        inputs: [],
        outputs: [{id: "out-default", label: "Default", position: "right"}],
    },

    "whatsapp.send": {
        type: "whatsapp.send",
        label: "WhatsApp Send",
        color: "#22c55e",
        config: {template: "received"},
        inputs: [{id: "in-default", label: "Input", position: "left"}],
        outputs: [{id: "out-success", label: "Success", position: "right"}],
    },

    "gmail.send": {
        type: "gmail.send",
        label: "Gmail Send",
        color: "#ef4444",
        config: {
            icon: "",
            inputProps: [
                {
                    type: "text",
                    values: [],
                    name: "password",
                    defaultValue: "",
                    value: "",
                    displayName: "Password",
                    required: true
                },
                {
                    type: "text",
                    values: [],
                    name: "to",
                    defaultValue: "",
                    value: "",
                    displayName: "To",
                    required: true
                },
                {
                    type: "number",
                    values: [],
                    name: "port",
                    defaultValue: 587,
                    value: 587,
                    displayName: "To",
                    required: true
                },
                {
                    type: "checkBox",
                    values: [],
                    name: "tls",
                    defaultValue: false,
                    value: false,
                    displayName: "TLS",
                    required: true
                },


            ]
        },
        inputs: [{id: "in-default", label: "Input", position: "left"}],
        outputs: [],
    },
};
