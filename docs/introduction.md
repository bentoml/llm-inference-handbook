---
slug: /
sidebar_position: 0
sidebar_class_name: hidden
description: A practical handbook for engineers building, optimizing, scaling and operating LLM inference systems in production.
keywords:
    - LLM inference guide, LLM inference handbook
    - LLM, LLM inference, AI inference
---

# Introduction

We wrote this handbook to solve a common problem facing developers while working with LLMs: the foundational knowledge about LLM inference is scattered, inconsistent, and often assumes you already know half the stack.

You’ll find explanations buried in academic papers, hidden in vendor blogs, spread across GitHub issues, or tossed around in Discord servers. But very few places tie it all together — like how inference differs from training, why goodput matters more than raw throughput for meeting SLOs, or how prefill-decode disaggregation works in practice.

So we started pulling it all together.

## What's inside

**LLM Inference in Production** is meant to serve as a technical glossary, guidebook, and reference - all in one. It covers everything about LLM inference, from basic metrics like Time to First Token (TTFT) and Tokens per Second (TPS), to advanced techniques like [continuous batching](/inference-optimization/static-dynamic-continuous-batching), [speculative decoding](/inference-optimization/speculative-decoding), and [prefix caching](/inference-optimization/prefix-caching).

## Who this is for

It’s written for engineers deploying, scaling or operating LLM applications, whether you're fine-tuning a small open model or running large-scale deployments on your own stack.

## How to use this handbook

You can read it start-to-finish or treat it like a lookup table. There’s no wrong way to navigate. We’ll keep updating the handbook as the field evolves, because LLM inference is moving fast, and what works today may not be best tomorrow.

If your goal is to make LLM inference faster, cheaper, or more reliable, this handbook is for you.