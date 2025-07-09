---
slug: /
sidebar_position: 0
sidebar_class_name: hidden
description: A practical handbook for engineers building, optimizing, scaling and operating LLM inference systems in production.
keywords:
    - LLM inference guide, LLM inference handbook
    - LLM, LLM inference, AI inference
---

import Features from '@site/src/components/Features';

# Introduction

_LLM Inference in Production_ is your technical glossary, guidebook, and reference - all in one. It covers everything you need to know about LLM inference, from core concepts and performance metrics (e.g., [Time to First Token and Tokens per Second](/inference-optimization/llm-inference-metrics)), to optimization techniques (e.g., [continuous batching](/inference-optimization/static-dynamic-continuous-batching) and [prefix caching](/inference-optimization/prefix-caching)) and operation best practices.

<Features>
  - Practical guidance for deploying, scaling, and operating LLMs in production.
  - Focus on what truly matters, not edge cases or technical noise.
  - Boost performance with optimization techniques tailored to your use case.
  - Continuously updated with the latest best practices and field-tested insights.
</Features>

## Motivation

We wrote this handbook to solve a common problem facing developers: LLM inference knowledge is often fragmented; it’s buried in academic papers, scattered across vendor blogs, hidden in GitHub issues, or tossed around in Discord threads. Worse, much of it assumes you already understand half the stack.

There aren’t many resources that bring it all together — like how [inference differs from training](/llm-inference-basics/training-inference-differences), why [goodput matters more than raw throughput](/inference-optimization/llm-inference-metrics#goodput) for meeting SLOs, or how [prefill-decode disaggregation](/inference-optimization/prefill-decode-disaggregation) works in practice.

So we started pulling it all together.

## Who this is for

This handbook is for engineers deploying, scaling or operating LLMs in production, whether you're fine-tuning a small open model or running large-scale deployments on your own stack.

If your goal is to make LLM inference faster, cheaper, or more reliable, this handbook is for you.

## How to use this

You can read it start-to-finish or treat it like a lookup table. There’s no wrong way to navigate. We’ll keep updating the handbook as the field evolves, because LLM inference is changing fast, and what works today may not be best tomorrow.

## Contributing

We welcome contributions! If you spot an error, have suggestions for improvements, or want to add new topics, please open an issue or submit a pull request on our [GitHub repository](https://github.com/bentoml/llm-inference-in-production).