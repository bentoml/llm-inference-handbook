---
sidebar_position: 6
description: Prefix caching speeds up LLM inference by reusing shared prompt KV cache across requests.
keywords:
    - Prefix caching, prompt caching, context caching
    - KV cache, KV caching
    - Distributed inference, distributed LLM inference
    - Inference optimization
    - Dynamo, SGLang, vLLM, llm-d
    - LLM inference optimization, LLM inference optimization techniques​
    - Speed up LLM inference
---

import LinkList from '@site/src/components/LinkList';
import Button from '@site/src/components/Button';

# Prefix caching

Prefix caching (also known as prompt caching or context caching) is one of the most effective techniques to reduce latency and cost in LLM inference. It's especially useful in production workloads with repeated prompt structures, such as chat systems, AI agents, and RAG pipelines.

The idea is simple: By caching the KV cache of an existing query, a new query that shares the same prefix can skip recomputing that part of the prompt. Instead, it directly reuses the cached results.

Prefix caching is different from simple semantic caching, where the full input and output text are stored in a database and only exact match (or similar queries) can hit the cache and return immediately.

## How does prefix caching work?

1. During prefill, the model performs a forward pass over the entire input and builds up a key-value (KV) cache for attention computation.
2. During decode, the model generates output tokens one by one, using the cached states from the prefill stage. The attention mechanism computes a matrix of token interactions. The resulting KV pairs for each token are stored in GPU memory.
3. For a new request with a matching prefix, you can skip the forward pass for the cached part and directly resume from the last token of the prefix.

:::important
This works only when the prefix is exactly identical, including whitespace and formatting. Even a single character difference breaks the cache.
:::

For example, consider a chatbot with this system prompt:

```bash
You are a helpful AI writer. Please write in a professional manner.
```

This prompt doesn’t change from one conversation to the next. Instead of recalculating it every time, you store its KV cache once. Then, when new messages come in, you reuse this stored prefix cache, only processing the new part of the prompt.

## What is the difference between KV caching and prefix caching?

KV caching is used to store the intermediate attention states of each token in GPU memory. It was originally used to describe caching within a **single inference request**, especially critical for speeding up the decoding stage.

LLMs work autoregressively during decode as they output the next new token based on the previously generated tokens (i.e. reusing their KV cache). Without the KV cache, the model needs to recompute everything for the previous tokens in each decode step (and the context grows with every step), which would be a huge waste of resources.

When extending this caching concept across **multiple requests**, it’s more accurate to call it prefix caching. Since the computation of the KV cache only depends on all previous tokens, different requests with identical prefixes can reuse the same cache of the prefix tokens and avoid recomputing them.

## How to structure prompts for maximum cache hits

Prefix caching only helps when prompts are consistent. Here are some best practices to maximize cache hit rates:

- **Front-load static content**: Place any constant or rarely changing information at the beginning of your prompt. This could include system messages, context, or instructions that remain the same across multiple queries. Move dynamic or user-specific content to the end of your prompt.
- **Batch similar requests**: Group together queries (especially when serving multiple users or agents) that share the same prefix so that cached results can be reused efficiently.
- **Avoid dynamic elements in the prefix**: Don’t insert timestamps, request IDs, or any other per-request variables early in the prompt. These lower your cache hit rate.
- **Use deterministic serialization**: Make sure your context or memory serialization (e.g. JSON) is stable in key ordering and structure. Non-deterministic serialization leads to cache misses even if the content is logically the same.
- **Monitor and analyze cache hit rates**: Regularly review your cache performance to identify opportunities for optimization.

## Adoption and performance gains

Prefix caching can reduce compute and latency by an order of magnitude in some use cases.

- Anthropic Claude Sonnet offers [prompt caching](https://www.anthropic.com/news/prompt-caching) with up to 90% cost savings and 85% latency reduction for long prompts.
- Google Gemini [discounts cached tokens](https://ai.google.dev/gemini-api/docs/caching?lang=python) and charges for storage separately.
- Frameworks like vLLM, TensorRT-LLM, and SGLang support automatic prefix caching for different open-source LLMs.

In agent workflows, the benefit is even more pronounced. Some use cases have input-to-output token ratios of 100:1, making the cost of reprocessing large prompts disproportionately high.

## Limitations

For applications with long, repetitive prompts, prefix caching can significantly reduce both latency and cost. Over time, however, your KV cache size can be quite large. GPU memory is finite, and storing long prefixes across many users can eat up space quickly. You’ll need cache eviction strategies or memory tiering.

The open-source community is actively working on distributed serving strategies. See [prefix cache-aware routing](./prefix-caching-cache-aware-routing) for details.

---

Optimizing LLM prefix caching requires flexible customization in your LLM serving and infrastructure stack. At Bento, we provide the infrastructure for dedicated and customizable LLM deployments with fast auto-scaling and scaling-to-zero capabilities to ensure resource efficiency.

<div style={{ margin: '3rem 0' }}>
[<Button>Talk to us</Button>](https://l.bentoml.com/contact-us-llm-inference-handbook)
</div>

<LinkList>
  ## Additional resources
  * [Prompt Cache: Modular Attention Reuse for Low-Latency Inference](https://arxiv.org/abs/2311.04934)
  * [Prompt Caching in Claude](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)
  * [Design Around the KV-Cache](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus)
</LinkList>