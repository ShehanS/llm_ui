export const NODE_CATALOG = {

    "trigger.http": {
        "type": "trigger.http",
        "label": "HTTP Webhook",
        "color": "#b21531",
        "config": {
            "icon": "webhook",
            "inputProps": [
                {
                    "type": "text",
                    "values": [],
                    "name": "path",
                    "defaultValue": "",
                    "value": "/webhook/{flowId}",
                    "displayName": "Webhook path",
                    "required": true
                },
                {
                    "type": "select",
                    "name": "method",
                    "displayName": "HTTP Method",
                    "values": [
                        {"name": "POST", "value": "POST"},
                        {"name": "GET", "value": "GET"},
                        {"name": "GET & POST", "value": "GET,POST"}
                    ],
                    "defaultValue": "GET",
                    "value": "POST",
                    "required": true
                },
                {
                    "type": "select",
                    "name": "mediaType",
                    "displayName": "Media Type",
                    "values": [
                        { "name": "JSON", "value": "application/json" },
                        { "name": "Form URL Encoded", "value": "application/x-www-form-urlencoded" },
                        { "name": "Multipart", "value": "multipart/form-data" },
                        { "name": "Text", "value": "text/plain" }
                    ],
                    "defaultValue": "application/json",
                    "value": "application/json",
                    "required": true
                },
                {
                    "type": "mapper",
                    "name": "mapper",
                    "displayName": "Object Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                }
            ]
        },
        "inputs": [],
        "outputs": [
            {"id": "default", "label": "Success", "position": "right"},
            {"id": "error", "label": "Error", "position": "right"}
        ]
    },
    "http.response": {
        "type": "http.response",
        "label": "HTTP Response",
        "color": "#22c55e",
        "config": {
            "icon": "response",
            "inputProps": [
                {
                    "type": "select",
                    "name": "status",
                    "displayName": "HTTP Status",
                    "values": [
                        { "name": "200 OK", "value": "200" },
                        { "name": "201 Created", "value": "201" },
                        { "name": "400 Bad Request", "value": "400" },
                        { "name": "401 Unauthorized", "value": "401" },
                        { "name": "403 Forbidden", "value": "403" },
                        { "name": "404 Not Found", "value": "404" },
                        { "name": "500 Internal Server Error", "value": "500" }
                    ],
                    "defaultValue": "200",
                    "value": "200",
                    "required": true
                },
                {
                    "type": "select",
                    "name": "mediaType",
                    "displayName": "Response Media Type",
                    "values": [
                        { "name": "JSON", "value": "application/json" },
                        { "name": "Text", "value": "text/plain" },
                        { "name": "HTML", "value": "text/html" }
                    ],
                    "defaultValue": "application/json",
                    "value": "application/json",
                    "required": true
                },
                {
                    "type": "select",
                    "name": "bodySource",
                    "displayName": "Response Body Source",
                    "values": [
                        { "name": "Body", "value": "body" },
                        { "name": "Headers", "value": "headers" },
                        { "name": "Query Params", "value": "query" },
                        { "name": "Full Context", "value": "all" },
                        { "name": "Expression", "value": "expression" }
                    ],
                    "defaultValue": "expression",
                    "value": "expression",
                    "required": true
                },
                {
                    "type": "text",
                    "name": "body",
                    "displayName": "Response Body",
                    "defaultValue": "{{body}}",
                    "value": "{{body}}",
                    "required": true,
                    "placeholder": "Example: {{body.text}}"
                },
                {
                    "type": "keyValue",
                    "name": "headers",
                    "displayName": "Response Headers",
                    "defaultValue": {},
                    "value": {
                        "Content-Type": "application/json"
                    },
                    "required": false
                }
            ]
        },
        "inputs": [
            { "id": "default", "label": "Input", "position": "left" }
        ],
        "outputs": []
    },
    "trigger.aiAgent": {
        "type": "trigger.aiAgent",
        "label": "AI Agent",
        "color": "#970ec4",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "routeAgent",
                    "name": "routeAgent",
                    "displayName": "Route Agent",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "agentURL",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Agent URL",
                    "required": true
                },
                {
                    "type": "mapper",
                    "name": "inputMapper",
                    "displayName": "Input Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                }
            ]
        },
        "inputs": [
            {"id": "default", "label": "Input", "position": "left"}
        ],
        "outputs": [
            {"id": "success", "label": "Success", "position": "right"},
            {"id": "action", "label": "Action", "position": "right"},
            {"id": "error", "label": "Error", "position": "right"}

        ]
    },
    "trace.inbound": {
        "type": "trace.inbound",
        "label": "Trace-Inbound",
        "color": "#06ab7f",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "text",
                    "values": [],
                    "name": "agentURL",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Agent URL",
                    "required": true
                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}

        ],
        "outputs": []
    },
    "trigger.whatsapp": {
        "type": "trigger.whatsapp",
        "label": "WhatsApp Trigger",
        "color": "#6366f1",
        "config": {
            "icon": "whatsapp",
            "inputProps": [
                {
                    "type": "select",
                    "name": "method",
                    "displayName": "HTTP Method",
                    "values": [
                        { "name": "POST", "value": "POST" },
                        { "name": "GET", "value": "GET" },
                        { "name": "GET & POST", "value": "GET,POST" }
                    ],
                    "defaultValue": "GET",
                    "value": "POST",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "path",
                    "defaultValue": "",
                    "value": "/webhook/{flowId}",
                    "displayName": "Webhook path",
                    "required": true
                },
                {
                    "type": "text",
                    "name": "verifyToken",
                    "displayName": "Verify Token",
                    "defaultValue": "",
                    "value": "",
                    "required": true,
                    "placeholder": "Meta webhook verify token"
                }
            ]
        },
        "inputs": [
            { "id": "default", "label": "HTTP Payload", "position": "left" }
        ],
        "outputs": [
            { "id": "default", "label": "Verified Message", "position": "right" }
        ]
    },
    "gmail.send": {
        "type": "gmail.send",
        "label": "Gmail Send",
        "color": "#ef4444",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "text",
                    "values": [],
                    "name": "password",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Password",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "to",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "To",
                    "required": true
                },
                {
                    "type": "number",
                    "values": [],
                    "name": "port",
                    "defaultValue": 587,
                    "value": 587,
                    "displayName": "To",
                    "required": true
                },
                {
                    "type": "checkBox",
                    "values": [],
                    "name": "tls",
                    "defaultValue": false,
                    "value": false,
                    "displayName": "TLS",
                    "required": true
                }
            ]
        },
        "inputs": [
            {"id": "in-default", "label": "Input", "position": "left"}
        ],
        "outputs": []
    },
    "human.approval": {
        "type": "human.approval",
        "label": "Human Approval",
        "color": "#059fb4",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "approval",
                    "name": "approval",
                    "depend": "whatapp",
                    "displayName": "Approval By",
                    "defaultValue": "",
                    "value": "",
                    "values": [
                        {"name": "WhatApp", "value": "whatapp"},
                        {"name": "Webhook", "value": "webhook"}
                    ],
                    "required": false,
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "accountId",
                    "defaultValue": "",
                    "value": "AC49a3ad33b96d45dd0f83a4edd48a9a81",
                    "dependOn": "whatapp",
                    "displayName": "Account ID(Whatapp-twillo)",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "token",
                    "defaultValue": "",
                    "dependOn": "whatapp",
                    "value": "f688ec8fd98fdef7d5eb337580c05235",
                    "displayName": "Token(Whatapp-twillo)",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "to",
                    "defaultValue": "",
                    "dependOn": "whatapp",
                    "value": "",
                    "displayName": "Whatsapp To(Whatapp-twillo)",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "from",
                    "defaultValue": "",
                    "dependOn": "whatapp",
                    "value": "+14155238886",
                    "displayName": "Whatsapp From(Whatapp-twillo)",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "path",
                    "defaultValue": "",
                    "dependOn": "whatapp",
                    "value": "/whatapp-webhook/{flowId}",
                    "displayName": "Whatsapp Webhook(Whatapp-twillo)",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "dependOn": "webhook",
                    "name": "outboundWebhookUrl",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Outbound Webhook",
                    "required": true,
                    "disabled": false
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "inboundWebhookUrl",
                    "defaultValue": "",
                    "dependOn": "webhook",
                    "value": "/session/{sessionId}/decide",
                    "displayName": "Inbound Webhook",
                    "required": true
                },
                {
                    "type": "mapper",
                    "name": "inputMapper",
                    "displayName": "Input Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                },
            ]
        },
        "inputs": [
            {"id": "action", "label": "Action In", "position": "left"},
            {"id": "source", "label": "Source In", "position": "left"}
        ],
        "outputs": [
            {"id": "success", "label": "Success", "position": "right"},
            {"id": "error", "label": "Error", "position": "right"}

        ]
    },
    "whatsapp.send": {
        "type": "whatsapp.send",
        "label": "WhatsApp Send",
        "color": "#22c55e",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "mapper",
                    "name": "mapper",
                    "displayName": "Object Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                },
                {
                    "type": "text",
                    "values": [],
                    "name": "accountId",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Account ID",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "token",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Token",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "to",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Whatsapp To",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "from",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Whatsapp From",
                    "required": true
                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}
        ],
        "outputs": [

        ]
    },
    "whatsapp.receive": {
        "type": "whatsapp.receive",
        "label": "WhatsApp Receive",
        "color": "#22c55e",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "text",
                    "values": [],
                    "name": "path",
                    "defaultValue": "",
                    "value": "/webhook/{flowId}",
                    "displayName": "Webhook path",
                    "required": true
                },
            ]
        },
        "inputs": [

        ],
        "outputs": [
            {"id": "success", "label": "Success", "position": "right"}
        ]
    },
    "source.org": {
        "type": "source.org",
        "label": "Organization",
        "color": "#c5ab04",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "OrgDataTable",
                    "values": [],
                    "name": "orgSource",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Organization Settings",
                    "required": true
                },
            ]
        },
        "inputs": [

        ],
        "outputs": [
            {"id": "success", "label": "Source Out", "position": "right"}
        ]
    },
    "data.extractor": {
        "type": "data.extractor",
        "label": "Data Extractor",
        "color": "#ff8b0a",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "mapper",
                    "name": "mapper",
                    "displayName": "Object Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                },
                {
                    "type": "logic",
                    "name": "logic",
                    "displayName": "Logic Controller",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}
        ],
        "outputs": [
            {"id": "success", "label": "Output", "position": "right"}
        ]
    },
    "google.driver": {
        "type": "google.driver",
        "label": "Google Driver",
        "color": "#ff7300",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "password",
                    "values": [],
                    "name": "clientId",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Client ID",
                    "required": true
                },
                {
                    "type": "password",
                    "values": [],
                    "name": "apiKey",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "API Key",
                    "required": true
                },
                {
                    "type": "googleDriver",
                    "name": "googleDriver",
                    "displayName": "Google Driver",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""
                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}
        ],
        "outputs": []
    },
    "database.write": {
        "type": "database.write",
        "label": "Database Write",
        "color": "#301e54",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "select",
                    "name": "driverType",
                    "displayName": "Driver Type",
                    "values": [
                        {"name": "MySQL", "value": "mysql"},
                        {"name": "MSSQL", "value": "mssql"}
                    ],
                    "defaultValue": "",
                    "value": "",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "username",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Username",
                    "required": true
                },
                {
                    "type": "password",
                    "values": [],
                    "name": "password",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Password",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "database",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Database",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "host",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Host",
                    "required": true
                },
                {
                    "type": "mapper",
                    "name": "mapper",
                    "displayName": "Object Mapper",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}
        ],
        "outputs": []
    },
    "google.doc": {
        "type": "google.doc",
        "label": "Google Doc",
        "color": "#349bff",
        "config": {
            "icon": "",
            "inputProps": [
                {
                    "type": "googleAuth",
                    "values": [],
                    "name": "googleAuthCode",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Google Auth",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "clientId",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Client Id",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "clientSecret",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "Client Secret",
                    "required": true
                },
                {
                    "type": "text",
                    "values": [],
                    "name": "apiKey",
                    "defaultValue": "",
                    "value": "",
                    "displayName": "API Key",
                    "required": true
                },
                {
                    "type": "googleDriver",
                    "name": "googleDriver",
                    "displayName": "Google Driver",
                    "defaultValue": "",
                    "value": "",
                    "required": false,
                    "placeholder": ""

                }
            ]
        },
        "inputs": [
            {"id": "success", "label": "Input", "position": "left"}
        ],
        "outputs": []
    }
};
