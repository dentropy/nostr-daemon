import {
  help_response,
  LLMSlashCommandConvoParser,
  msg_offset_error,
  reset_response,
  select_model_error,
} from "./LLMSlashCommandConvoParser.js";
import { assertEquals } from "jsr:@std/assert";
import { delay } from "jsr:@std/async";
import Handlebars from "npm:handlebars";

Deno.test("example test", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

Deno.test("example async test", async () => {
  const x = 1 + 2;
  await delay(100);
  assertEquals(x, 3);
});

Deno.test("slash-command-prase /help", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/help",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase /help with breakline", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/help\nI don't know what I am doing",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase without breakline", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/help I don't know what I am doing",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase /asdf invalid command produce help_response", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/asdf I don't know what I am doing",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase '/asdf I don't know what I am doing'", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/asdf I don't know what I am doing",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase '/llm help'", () => {
  const models_supported = ["llama3.2:latest"];
  const example_convo = [
    {
      decrypted_content: "/asdf I don't know what I am doing",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase '/llm list-models'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "/llm list-models",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(JSON.stringify(models_supported), parsed_command);
});

Deno.test("slash-command-prase '/llm list-models' with breakline data", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "/llm list-models\nI Like Pie",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(JSON.stringify(models_supported), parsed_command);
});

Deno.test("slash-command-prase '/llm list-models' with additional args to break slash command parser returning help command", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "/llm list-models extra data",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(help_response, parsed_command);
});

Deno.test("slash-command-prase '/reset'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content: "/reset",
    },
    {
      decrypted_content: "What is the Capital of Egypt?",
    },
  ];
  const return_value = {
    model_selected: models_supported[0],
    parsed_convo: [{
      decrypted_content: "What is the Capital of Egypt?",
    }],
  };
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(return_value, parsed_command);
});

Deno.test("slash-command-prase '/llm reset'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content: "/llm reset",
    },
    {
      decrypted_content: "What is the Capital of Egypt?",
    },
  ];
  const return_value = {
    model_selected: models_supported[0],
    parsed_convo: [{
      decrypted_content: "What is the Capital of Egypt?",
    }],
  };
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(return_value, parsed_command);
});

Deno.test("slash-command-prase '/llm reset with spaces'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content: "/llm    reset   ",
    },
    {
      decrypted_content: "What is the Capital of Egypt?",
    },
  ];
  const return_value = {
    model_selected: models_supported[0],
    parsed_convo: [{
      decrypted_content: "What is the Capital of Egypt?",
    }],
  };
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(return_value, parsed_command);
});

Deno.test("slash-command-prase '/llm reset with spaces'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content: "    /llm    reset   ",
    },
    {
      decrypted_content: "What is the Capital of Egypt?",
    },
  ];
  const return_value = {
    model_selected: models_supported[0],
    parsed_convo: [{
      decrypted_content: "What is the Capital of Egypt?",
    }],
  };
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  assertEquals(return_value, parsed_command);
});

Deno.test("slash-command-prase '/llm run select-model:llama3.2-uncensored:FAILURE'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content: "/llm run select-model: llama3.2-uncensored:FAILURE",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  const select_model_template = Handlebars.compile(select_model_error);
  const temoplate_response = select_model_template({
    "select-model": "llama3.2-uncensored:FAILURE",
    "models_supported": JSON.stringify(models_supported),
  });
  assertEquals(temoplate_response, parsed_command);
});

Deno.test("slash-command-prase '/llm run select-model:llama3.2-uncensored:FAILURE'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "What is 2+2",
    },
    {
      decrypted_content:
        "   /llm run select-model: llama3.2-uncensored:FAILURE   ",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  const select_model_template = Handlebars.compile(select_model_error);
  const temoplate_response = select_model_template({
    "select-model": "llama3.2-uncensored:FAILURE",
    "models_supported": JSON.stringify(models_supported),
  });
  assertEquals(temoplate_response, parsed_command);
});

// msg-offset test
Deno.test("slash-command-prase '/llm run msg-offset: 2'", () => {
  const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
  const example_convo = [
    {
      decrypted_content: "001 Luke was a Farmer",
    },
    {
      decrypted_content: "002 Mary was a Scientist",
    },
    {
      decrypted_content: "003 Mark likes Wool Socks",
    },
    {
      decrypted_content: "   /llm run msg-offset: 2  ",
    },
  ];
  const parsed_command = LLMSlashCommandConvoParser(
    example_convo,
    models_supported,
  );
  const the_result = {
    model_selected: "llama3.2:latest",
    parsed_convo: [
      {
        decrypted_content: "002 Mary was a Scientist",
      },
      {
        decrypted_content: "003 Mark likes Wool Socks",
      },
      {
        decrypted_content: "",
      },
    ],
  };
  assertEquals(the_result, parsed_command);
});

Deno.test("slash-command-prase '/llm run msg-offset: 2'", () => {
    const models_supported = ["llama3.2:latest", "llama3.2-uncensored:latest"];
    const example_convo = [
      {
        decrypted_content: "001 Luke was a Farmer",
      },
      {
        decrypted_content: "002 Mary was a Scientist",
      },
      {
        decrypted_content: "003 Mark likes Wool Socks",
      },
      {
        decrypted_content: "   /llm run msg-offset: 2 select-model:llama3.2-uncensored:latest ",
      },
    ];
    const parsed_command = LLMSlashCommandConvoParser(
      example_convo,
      models_supported,
    );
    const the_result = {
      model_selected: "llama3.2:latest",
      parsed_convo: [
        {
          decrypted_content: "002 Mary was a Scientist",
        },
        {
          decrypted_content: "003 Mark likes Wool Socks",
        },
        {
          decrypted_content: "",
        },
      ],
    };
    assertEquals(the_result, parsed_command);
  });
  