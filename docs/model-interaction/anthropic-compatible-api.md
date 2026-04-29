---
sidebar_position: 2
description: An Anthropic-compatible API implements the same request and response formats as Anthropic's API, allowing developers to swap models or providers without changing existing Claude-based code.
keywords:
    - Anthropic-compatible API, Anthropic-compatible endpoint, Anthropic-compatible server
    - Anthropic Messages API, Claude API, Claude Code, Claude Agent SDK
    - LLM inference API
---

import LinkList from '@site/src/components/LinkList';

# Anthropic-compatible API

The Anthropic API has emerged as a second major standard for interacting with LLMs.

## What is an Anthropic-compatible API?

An Anthropic-compatible API is any API that replicates the interface, request/response schema, and authentication model of Anthropic’s API. As Claude models gained traction, especially through agentic tools like [Claude Code](https://www.anthropic.com/claude-code) and the [Claude Agent SDK](https://docs.claude.com/en/api/agent-sdk/overview), many applications and frameworks were built around the Anthropic API format.

By exposing an Anthropic-compatible endpoint, you can serve an open-source model (e.g., Llama, Qwen, DeepSeek) or another provider while keeping your existing Anthropic-based clients, SDKs, and agent loops unchanged.

## How to call an Anthropic-compatible API

Use the official Anthropic SDK and point `base_url` at your endpoint like this:

```python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://your-custom-endpoint.com",
    api_key="your-api-key"
)

response = client.messages.create(
    model="your-model-name",
    max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "How can I integrate Anthropic-compatible APIs?"}
    ]
)

print(response.content[0].text)
```

You can also call the endpoint directly with `curl`:

```bash
curl https://your-custom-endpoint.com/v1/messages \
  -H "x-api-key: your-api-key" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-name",
    "max_tokens": 1024,
    "system": "You are a helpful assistant.",
    "messages": [
      {"role": "user", "content": "How can I integrate Anthropic-compatible APIs?"}
    ]
  }'
```

### Streaming responses

The Anthropic SDK exposes a `messages.stream()` helper that yields typed events as the model generates the response. This is ideal for chat UIs and latency-sensitive workloads.

```python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://your-custom-endpoint.com",
    api_key="your-api-key"
)

with client.messages.stream(
    model="your-model-name",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Write a short poem about streaming."}
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

The specific schema may be different depending on the framework you use. Always check their official documentation.

### Listing available models

Anthropic exposes a `/v1/models` endpoint, and many compatible servers implement it as well. Use it to discover what `model` names the backend accepts:

```python
from anthropic import Anthropic

client = Anthropic(
    base_url="https://your-custom-endpoint.com",
    api_key="your-api-key"
)

for model in client.models.list().data:
    print(model.id)
```

Or via `curl`:

```bash
curl https://your-custom-endpoint.com/v1/models \
  -H "x-api-key: your-api-key" \
  -H "anthropic-version: 2023-06-01"
```

Use any returned `id` as the `model` field in your `messages.create()` calls.

## Things to keep in mind

A compatible endpoint speaks the Anthropic schema, but it isn’t the official Anthropic API. A few practical caveats:

- **The API key is accepted but not validated**. Most self-hosted inference frameworks don’t verify the value, so you can pass any string (e.g., `"EMPTY"`). Only treat it as a real secret when the endpoint is fronted by a gateway that actually checks it.
- **Configuration is often done via environment variables**. Many frameworks’ docs recommend setting the API key and base URL through environment variables (so the Anthropic SDK picks them up automatically) rather than hard-coding them in client code. The idea is the same across frameworks, but the specific variable names can differ.
- **Not all API fields are supported**. Common fields like `model`, `messages`, and `max_tokens` are usually fine, but coverage thins out beyond that. For example:
  - **Modalities**. The official Anthropic API accepts types like `"image"` and `"document"`. For many open-source LLMs, these are simply not supported. Always check the compatibility doc before assuming a content type will go through.
  - **Advanced features.** Capabilities like prompt caching (`cache_control` for caching prefixes), extended thinking, and some tool-use options may be ignored or rejected. If you depend on these, verify they work end-to-end before porting an Anthropic-based application.

## When to use it

Choose an Anthropic-compatible endpoint when:

- Your application or agent stack is already built on the Anthropic API (e.g., Claude Code, Claude Agent SDK, or custom agent loops using Anthropic-style tool use).
- The downstream tooling (SDKs, proxies, evaluators) expects the Anthropic schema, and rewriting it to OpenAI-compatible is more work than running a compatible endpoint.

For new applications without an existing integration, the [OpenAI-compatible API](./openai-compatible-api) remains the more broadly supported default.

## FAQs

### Should I pick an OpenAI-compatible or Anthropic-compatible API?

It depends on your existing stack rather than the underlying model. If your clients, agent frameworks, or SDKs already speak the OpenAI schema, an OpenAI-compatible endpoint is the easiest path. If they use the Anthropic schema, an Anthropic-compatible endpoint avoids rewriting that integration. The model behind either endpoint can be the same; only the API surface changes.

<LinkList>
  ## Additional resources
  * [Anthropic Messages API documentation](https://docs.claude.com/en/api/messages)
  * [Claude Agent SDK overview](https://docs.claude.com/en/api/agent-sdk/overview)
</LinkList>
