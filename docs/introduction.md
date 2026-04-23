---
slug: /
sidebar_position: 0
sidebar_class_name: hidden
description: A practical handbook for engineers building, optimizing, scaling and operating LLM inference systems in production.
keywords:
    - LLM inference guide, LLM inference handbook, LLM inference book, LLM inference best practices
    - Inference, LLM, LLM inference, AI inference, GenAI inference
    - Inference optimization, inference techniques, LLM fast inference
    - Inference platform, inference operations
    - Efficient generative LLM inference, distributed LLM inference
---

import Features from '@site/src/components/Features';
import Newsletter from '@site/src/components/Newsletter';
import StackQuiz from '@site/src/components/StackQuiz';

# LLM Inference Handbook

_LLM Inference Handbook_ is your technical glossary, guidebook, and reference - all in one. It covers everything you need to know about LLM inference, from core concepts and performance metrics (e.g., [Time to First Token and Tokens per Second](/llm-inference-basics/llm-inference-metrics)), to optimization techniques (e.g., [continuous batching](/inference-optimization/static-dynamic-continuous-batching) and [prefix caching](/inference-optimization/prefix-caching)), [GPU achitecture](./kernel-optimization/gpu-architecture-fundamentals), and deployment patterns like [BYOC](./getting-started/bring-your-own-cloud) and [on-prem](./getting-started/on-prem-llms).

<Features>
  - Practical guidance for deploying, scaling, and operating LLMs in production.
  - Explore concepts with interactive calculators, simulators, and visual tools.
  - Boost performance with optimization techniques tailored to your use case.
  - Continuously updated with the latest best practices and field-tested insights.
</Features>

## Motivation

We wrote this handbook to solve a common problem facing developers: LLM inference knowledge is often fragmented; it’s buried in academic papers, scattered across vendor blogs, hidden in GitHub issues, or tossed around in Discord threads. Worse, much of it assumes you already understand half the stack.

There aren’t many resources that bring it all together — like how [inference differs from training](/llm-inference-basics/training-inference-differences), why [goodput matters more than raw throughput](/llm-inference-basics/llm-inference-metrics#goodput) for meeting SLOs, or how [prefill-decode disaggregation](/inference-optimization/prefill-decode-disaggregation) works in practice.

So we started pulling it all together.

## Who this is for

This handbook is for engineers deploying, scaling or operating LLMs in production, whether you're fine-tuning a small open model or running large-scale deployments on your own stack.

If your goal is to make LLM inference faster, cheaper, or more reliable, this handbook is for you.

## How to use this

You can read it start-to-finish or treat it like a lookup table. There’s no wrong way to navigate. We’ll keep updating the handbook as the field evolves, because LLM inference is changing fast, and what works today may not be best tomorrow.

<StackQuiz />

## Interactive tools

This handbook provides various interactive tools to help you learn by trying the concepts directly:

- [LLM Inference Visualizer](/llm-inference-basics/what-is-llm-inference): Walk through the request lifecycle and see how tokens flow through prefill and decode.
- [Context Window Simulator](/llm-inference-basics/how-does-llm-inference-work#what-is-a-context-window-and-how-does-it-work-in-llm-inference): See how the full conversation is re-sent each turn and fills the context window.
- [Latency Metrics Playground](/llm-inference-basics/llm-inference-metrics#latency): Explore TTFT, E2EL, TPOT, and SLO-based goodput.
- [GPU Memory Calculator](/getting-started/calculating-gpu-memory-for-llms#): Estimate VRAM requirements for serving an LLM.
- [Batching Strategy Simulator](/inference-optimization/static-dynamic-continuous-batching): Compare static, dynamic, and continuous batching behavior.
- [KV Cache Memory Calculator](/inference-optimization/kv-cache-offloading#how-to-calculate-the-kv-cache-size): Estimate how much memory the KV cache consumes.
- [Quantization Memory Impact Visualizer](/model-preparation/llm-quantization#quantization-formats): Compare weight memory across quantization formats.
- [GPU Comparison Table](/getting-started/choosing-the-right-gpu#matching-gpus-to-open-source-llms): Match popular open-source LLMs to suitable NVIDIA and AMD GPUs.
- [GPU Execution and Memory Map](/kernel-optimization/gpu-architecture-fundamentals): Visualize how threads, warps, SMs, and the GPU memory hierarchy fit together.

## Contributing

We welcome contributions! If you spot an error, have suggestions for improvements, or want to add new topics, please open an issue or submit a pull request on our [GitHub repository](https://github.com/bentoml/llm-inference-handbook).

<Newsletter />
