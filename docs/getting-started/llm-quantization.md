---
sidebar_position: 4
description: Understand LLM quantization and different quantization formats and methods.
keywords:
    - LLM quantization, how does quantization work, LLM quantization accuracy
    - Quantization formats, quantization types, quantization techniques
    - AWQ, SmoothQuant, GPTQ
---

import LinkList from '@site/src/components/LinkList';

# LLM quantization

Quantization is a technique used to reduce the memory and compute requirements of models by converting their weights and activations from high-precision formats (like `FP32`) to lower-precision formats such as `int8`, `int4`, or even `int2`.

Fewer bits mean lower the model’s memory consumption will be. For example:

- A 7B model in FP32 format is highly precise, but it requires 28 GB of memory just for the weights.
- The same model in FP16 cuts memory use in half.
- Lower-precision formats like int8 or int4 compress the model even further, dramatically reducing the size.

These figures only account for model weights. Runtime elements, such as attention caches, activations, and framework overhead, require additional memory.

## Why use quantization

Quantization is widely used because it:

- **Reduces memory usage**, which not only allows large models to fit on smaller GPUs, but also reduces the KV cache size per token. This leads to higher throughput since you can fit more tokens into the same GPU memory.
- **Speeds up inference**, particularly on edge devices or during batch processing.
- **Lowers compute requirements**, which helps reduce cost and energy usage.

This tradeoff between precision and size comes with **some drop in accuracy**. For many applications, however, the impact is minimal, especially with carefully tuned quantization methods.

## Quantization formats

Different quantization formats offer a balance between size savings and accuracy. Here's a quick guide:

| Format | Size vs FP32 | Accuracy Drop | Use Case | Memory | Notes |
| --- | --- | --- | --- | --- | --- |
| **FP32** | 100% | None | Training | High | Full precision, but slow |
| **FP16** | 50% | Minimal | Training & Inference | Medium | Standard for most LLMs |
| **FP8** | 25% | Low | Training & Inference | Low | Still emerging |
| **int8** | 25% | Low | Inference | Low | Good all-around trade-off |
| **int4** | 12.5% | Moderate | Inference | Very Low | Needs methods like GPTQ/AWQ |
| **int2** | 6.25% | High | Rare/Experimental | Tiny | Accuracy often poor |

## What to quantize

Generally, you want to focus on what consumes the most memory without hurting performance too much.

- Model weights are the most commonly quantized component. They’re stable and contribute heavily to memory usage.
- Activations can also be quantized, but this is trickier and may lead to more accuracy loss.

## When to use quantization

Quantization is a good choice if:

- You're deploying to hardware with limited GPU memory (e.g., 24GB or less).
- You want lower inference latency.
- You need to reduce serving costs.
- You want to support higher concurrency. Quantization reduces KV cache size per token, allowing more tokens (and therefore more parallel requests) to fit within the same GPU memory.
- You can tolerate small accuracy trade-offs.

Quantization may not be a good choice if:

- You need the highest possible accuracy (e.g., for sensitive or safety-critical tasks).
- Your model is already small (quantization offers limited benefit here).
- Your deployment hardware doesn't support quantized formats.

## Quantization methods

Several advanced quantization techniques have been developed to make LLMs more efficient without significant loss in performance.

Below are some widely adopted quantization approaches:

### AWQ

[Activation-aware Weight Quantization (AWQ)](https://arxiv.org/pdf/2306.00978) is designed specifically for running LLMs on edge or resource-constrained devices. The core insight is that not all weights contribute equally to performance. Its developers believe only ~1% of weights are "salient" and need extra care during quantization. Therefore, this approach selectively protects the most impactful weights based on activation distributions, not just the weights themselves.

At a high level, AWQ applies an equivalent transformation that scales important weight channels based on offline-collected activation statistics.

It is ideal for low-bit quantization on models deployed in edge settings or latency-sensitive environments.

### SmoothQuant

[SmoothQuant](https://arxiv.org/abs/2211.10438) is a general-purpose, training-free method for post-training quantization (PTQ) that enables efficient 8-bit quantization of both weights and activations (W8A8).

While quantizing weights is relatively straightforward, activations are much harder due to outliers that can significantly degrade accuracy. SmoothQuant solves this by "smoothing" the activation outliers. It mathematically shifts quantization difficulty from activations to weights through an equivalent transformation. As a result, it achieves up to 2× memory reduction and up to 1.56× speedup for LLMs.

SmoothQuant is a great choice when you want:

- Full INT8 quantization (weights and activations)
- High hardware efficiency without retraining
- Minimal accuracy drop
- Plug-and-play compatibility with most transformer models

It’s a turn-key solution that balances accuracy, performance, and ease of use. It’s ideal for production scenarios that demand efficiency at scale.

### GPTQ

[GPTQ](https://arxiv.org/abs/2210.17323) is a fast, post-training quantization method that compresses large transformer models to 3–4 bits per weight with minimal accuracy loss. It’s specifically designed for scaling to models with hundreds of billions of parameters and does so without retraining.

Highlights:

- Efficient at scale: Can quantize models like OPT-175B or BLOOM-176B in ~4 GPU hours.
- Minimal accuracy loss: Maintains low perplexity, even with aggressive compression.
- Extreme quantization: Supports 2-bit and ternary quantization, still with usable performance.
- Runs massive models on single GPUs: Enables inference of 175B models on a single A100 or two A6000s.
- Performance gains: Custom GPU kernels yield ~3.25× speedup over FP16.

GPTQ is widely used in open-source model serving pipelines, especially with AutoGPTQ. It is a go-to choice for high-speed, low-memory inference of large models.

<LinkList>
  ## Additional resources
  * [Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference](https://arxiv.org/abs/1712.05877)
  * [AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration](https://arxiv.org/abs/2306.00978)
  * [GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323)
  * [SmoothQuant: Accurate and Efficient Post-Training Quantization for Large Language Models](https://arxiv.org/abs/2211.10438)
</LinkList>