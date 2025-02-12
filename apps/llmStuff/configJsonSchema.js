export const config_json_schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "object",
    "properties": {
      "relays": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "nip65_metadata_profile_relays": {
        "type": "array",
        "items": {
          "type": "string"
        }
      },
      "bot_profile_json": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "picture": {
            "type": "string"
          },
          "banner": {
            "type": "string"
          },
          "website": {
            "type": "string"
          },
          "about": {
            "type": "string"
          },
          "nip05": {
            "type": "string"
          },
          "display_name": {
            "type": "string"
          },
          "displayName": {
            "type": "string"
          },
          "lud06": {
            "type": "string"
          },
          "lud16": {
            "type": "string"
          }
        },
        "required": [
          "name",
          "picture",
          "about",
          "display_name",
          "displayName",
        ]
      },
      "LLM_API_KEY": {
        "type": "string"
      },
      "LLM_BASE_URL": {
        "type": "string"
      },
      "THREADS_ENABLED": {
        "type": "boolean"
      },
      "DMS_ENABLED": {
        "type": "boolean"
      },
      "LLM_MODELS_SUPPORTED": {
        "type": "array",
        "items": {
          "type": "string"
        }
      }
    },
    "required": [
      "relays",
      "nip65_metadata_profile_relays",
      "bot_profile_json",
      "LLM_API_KEY",
      "LLM_BASE_URL",
      "THREADS_ENABLED",
      "DMS_ENABLED",
      "LLM_MODELS_SUPPORTED"
    ]
  }