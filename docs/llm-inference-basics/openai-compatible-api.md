---
sidebar_position: 7
description: An OpenAI-compatible API implements the same request and response formats as OpenAI's official API, allowing developers to switch between different models without changing existing code.
keywords:
    - OpenAI-compatible API, OpenAI-compatible endpoint, OpenAI-compatible server
    - OpenAI API, OpenAI compatibility, ChatGPT
    - LLM inference API
---

import LinkList from '@site/src/components/LinkList';

# OpenAI-compatible API

Once an LLM is running, you’ll need a standard way to interact with it. That’s where the OpenAI-compatible API comes in.

## What is an OpenAI-compatible API?

An OpenAI-compatible API is any API that replicates the interface, request/response schema, and authentication model of OpenAI’s original API. While OpenAI didn’t formally define this as an industry standard, their API has become the de facto interface for LLMs.

The rise of ChatGPT in late 2022 demonstrated how powerful and user-friendly this approach could be:

- The clean, well-documented API makes it easy for developers to build applications with LLMs.
- Models like `gpt-4o` are accessible through simple, consistent endpoints.

As a result, it sees rapid adoption and ecosystem growth across various industries.

## Why does compatibility matter?

While OpenAI’s APIs helped kickstart the AI application development, their widespread adoption created ecosystem lock-in. Many developer tools, frameworks, and SDKs are now built specifically around the OpenAI schema. That becomes a problem if you want to:

- Switch to a different model
- Move to a self-hosted deployment
- Try a new inference provider

In these cases, rewriting application logic to fit a new API can be tedious and error-prone.

OpenAI-compatible APIs address these challenges by providing:

- **Drop-in replacement**: Swap out OpenAI’s hosted API for your own self-hosted or open-source model, without changing your application code.
- **Seamless migration**: Move between providers or self-hosted deployments with minimal disruption.
- **Consistent integration**: Maintain compatibility with tools and frameworks that rely on the OpenAI API schema (e.g., `chat/completions`, `embeddings` endpoints).

Many [inference backends](../getting-started/choosing-the-right-inference-framework) (e.g., vLLM and SGLang) and model serving frameworks (e.g., BentoML) provide OpenAI-compatible endpoints out of the box. This makes it easy to switch between different models without changing client code.

## How to call an OpenAI-compatible API

Here’s a quick example of how easy it is to point your existing OpenAI client to a self-hosted or alternative provider’s endpoint:

```python
from openai import OpenAI

# Use your custom endpoint URL and API key
client = OpenAI(
    base_url="https://your-custom-endpoint.com/v1",
    api_key="your-api-key"
)

response = client.chat.completions.create(
    model="your-model-name",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "How can I integrate OpenAI-compatible APIs?"}
    ]
)

print(response.choices[0].message)
```

Note that the OpenAI API requires the `api_key` field. Most inference frameworks don’t validate this value, so you can use anything, like `api_key="EMPTY"`.

You can also call the API directly using a simple HTTP request. Here's an example using `curl`:

```bash
curl https://your-custom-endpoint.com/v1/chat/completions \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "your-model-name",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "How can I integrate OpenAI-compatible APIs?"}
    ]
  }'
```

If you’re already using OpenAI’s SDKs or REST interface, you can simply redirect them to your own API endpoint. This allows you to keep control over your LLM deployment, reduce vendor lock-in, and ensure your application remains future-proof.

## FAQs

### Is an OpenAI-compatible API the same as OpenAI’s official API?

No. It only mirrors the interface, not the underlying model or infrastructure. Think of it as speaking the same “language,” but to a different system. Depending on the provider, the backend might be:

- A self-hosted LLM like Llama or DeepSeek
- A hosted provider like Together AI or Fireworks
- A custom enterprise deployment inside your VPC

Every backend behaves differently in speed and cost, even if the API shape looks the same.

### What models can I run behind an OpenAI-compatible API?

Any modern open-source LLM can be served behind an OpenAI-compatible API, such as Llama, Qwen, Mistral, DeepSeek, Kimi, and domain-specific fine-tuned models.

If you're using frameworks like vLLM and SGLang, they can expose these models through OpenAI-compatible endpoints automatically.

### Is an OpenAI-compatible API required to self-host an LLM?

Not strictly required, but highly recommended. Without it, you might need to manually rebuild agent integrations, SDK integrations, framework compatibility, and so on. Using the OpenAI schema keeps your stack simple and portable.

### Does using an OpenAI-compatible API save cost?

Not by itself. The API format is just an interface. It doesn’t make inference cheaper.

Cost savings come from where the API is running. Here’s the breakdown:

- **If you self-host LLMs through tools like vLLM and SGLang**, you mainly pay for GPUs instead of per-token pricing. You can apply inference optimizations like [KV cache offloading](../inference-optimization/kv-cache-offloading) and [prefill-decode disaggregation](../inference-optimization/prefill-decode-disaggregation) to further cut inference cost. This is usually far cheaper for steady or high-volume workloads.
- **If you use a hosted provider (e.g., Together AI, Fireworks)**, you still pay per-token or per-request, even if the API is “OpenAI-compatible.”
- **If you stay on OpenAI**, you pay per-token at OpenAI pricing.

The reason some AI teams save money isn’t the OpenAI-compatible API; it’s the ability to self-host any model without breaking their existing application code. Learn more about [serverless vs. self-hosted LLM inference](./serverless-vs-self-hosted-llm-inference).

<LinkList>
  ## Additional resources
  * [OpenAI documentation](https://platform.openai.com/docs/quickstart?api-mode=chat)
  * [Examples: Serving LLMs with OpenAI-compatible APIs](https://github.com/bentoml/BentoVLLM)
</LinkList>