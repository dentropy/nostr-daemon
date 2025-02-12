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
                "banner",
                "website",
                "about",
                "nip05",
                "display_name",
                "displayName",
                "lud06",
                "lud16"
            ]
        },
        "domain_names": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "domain_name": {
                  "type": "string",
                },
                "update_method": {
                  "type": "string",
                },
                "bot_username": {
                  "type": "string",
                },
                "config": {
                  "type": "object",
                  "properties": {},
                  "required": [],
                },
              },
              "required": [
                "domain_name",
                "update_method",
                "bot_username",
                "config",
              ],
            },
          },
    },
    "required": [
        "relays",
        "nip65_metadata_profile_relays",
        "bot_profile_json",
        "domain_names"
    ]
}