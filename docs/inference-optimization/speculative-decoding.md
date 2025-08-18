---
sidebar_position: 5
description: Speculative decoding accelerates LLM inference with draft model predictions verified by the target model.
keywords:
    - Speculative decoding, speculative sampling
    - Draft model, target model
    - Distributed inference, distributed LLM inference
    - LLM inference optimization, LLM inference optimization techniques​
    - Speed up LLM inference
---

import LinkList from '@site/src/components/LinkList';

# Speculative decoding

LLMs are powerful, but their text generation is slow. The main bottleneck lies in [auto-regressive decoding](../llm-inference-basics/how-does-llm-inference-work#the-two-phases-of-llm-inference), where each token is generated one at a time. This sequential loop leads to high latency, as each step depends on the previous token. Additionally, while GPUs are optimized for parallelism, this sequential nature leads to underutilized compute resources during inference.

What if you could parallelize parts of the generation process, even if not all of it?

That’s where speculative decoding comes in.

## What is speculative decoding?

Speculative decoding is an inference-time optimization that combines two models:

- **Draft model:** A smaller, faster model (like a distilled version of the target model) proposes a draft sequence of tokens. A core driver behind this is that some tokens are easier to predict than others and can be easily handled by a smaller model.
- **Target model:** The original larger model verifies the draft’s tokens at once and decides which to accept.

The draft model delivers fast guesses, and the target model ensures accuracy. This method helps shift the generation loop from purely sequential to partially parallel, improving hardware utilization and reducing latency.

Two key metrics in speculative decoding:

- **Acceptance rate**: Number of draft tokens accepted by the target model. A low acceptance rate limits the speedup and can become a major bottleneck.
- **Speculative token count**: Number of tokens proposed by the draft model each step. Most inference frameworks allow you to configure this value when speculative decoding is enabled.

## How it works

Here’s the step-by-step process:

1. The draft model predicts the next *K tokens* after the input sequence.
2. The target model then verifies these *K tokens* in parallel to see if it would also predict them.
3. The target model accepts the longest prefix of these *K tokens* that it agrees with.
4. If it accepts *h* tokens, it then generates the *(h+1)*-th token itself (so that generation remains on track).
5. The process repeats: the draft model proposes the next *K tokens* based on this new extended sequence.
    
![spec-decoding.png](./img/spec-decoding.png)
    
## Benefits and limitations

Key benefits of speculative decoding include:

- **Parallel verification:** Since verification doesn’t depend on previous verifications, it’s faster than generation (which is sequential).
- **High acceptance for easy tokens:** The draft model can often get the next few tokens correct, which speeds up generation.
- **Better use of hardware:** Because verification uses hardware resources that would otherwise be idle, overall throughput improves.

However, speculative decoding has its own costs. 

- **Increased memory usage**: Because both the draft model and the target model need to be loaded into memory, it increases overall VRAM usage. This reduces the available memory for other tasks (e.g., batch processing), which can limit throughput, especially under high load or when serving large models.
- **Wasted compute on rejection**: If many draft tokens are rejected (low acceptance rate), compute is wasted on both drafting and verification.

<LinkList>
  ## Additional resources
  * [Looking back at speculative decoding](https://research.google/blog/looking-back-at-speculative-decoding/)
  * [EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty](https://arxiv.org/pdf/2401.15077)
  * [Fast Inference from Transformers via Speculative Decoding](https://arxiv.org/abs/2211.17192)
  * [Accelerating Large Language Model Decoding with Speculative Sampling](https://arxiv.org/abs/2302.01318)
  * [Blockwise Parallel Decoding for Deep Autoregressive Models](https://arxiv.org/abs/1811.03115)
</LinkList>