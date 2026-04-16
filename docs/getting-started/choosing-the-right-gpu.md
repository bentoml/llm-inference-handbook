---
sidebar_position: 2
description: Select the right NVIDIA or AMD GPUs (e.g., L4, A100, H100, B200, MI250X, MI300X, MI350X) for LLM inference.
keywords:
    - NVIDIA GPUs, AMD GPUs
    - GPU inference
---

import LinkList from '@site/src/components/LinkList';
import Button from '@site/src/components/Button';
import GPUTable from '@site/src/components/GPUTable';

# Choosing the right GPU

For AI teams self-hosting LLMs, selecting the right GPU is one of the most important early decisions. The choice directly impacts throughput, latency, memory limits, and overall cost. It’s easy to rely on a GPU benchmark or a GPU comparison chart to guide that decision. However, those numbers rarely capture the full story of LLM workloads in a specific use case.

## GPUs vs. Graphics Cards vs. Accelerators

First, let’s clarify a few terms that are often used interchangeably but actually mean different things.

### GPU (Graphics Processing Unit)

The GPU is the processor chip itself. Originally designed for rendering graphics, it is capable of running thousands of calculations at once. In modern AI workloads, the GPU is the "brain" that does the heavy computational work.

### Graphics card

A graphics card is the full hardware package that contains a GPU. It includes the chip, memory (VRAM), cooling system, power connectors, and output ports. You might also see terms like “video card” or “graphics adapter.” The GPU is just one part of the card, but it’s the central component.

### Accelerator

Accelerators are a broader category of specialized hardware built to speed up certain types of computations. A GPU is one type of accelerator, but there are others, such as:

- AI/ML accelerators (e.g., Google TPUs, Intel NPUs)
- Cryptographic accelerators
- Physics processing units (PPUs)
- Field-programmable gate arrays (FPGAs) configured for specific tasks

The key difference: all modern graphics cards contain GPUs, and all GPUs are accelerators, but not all accelerators are GPUs or graphics-focused. Today, many GPUs are used primarily for non-graphics work like ML/AI training and inference, rather than image rendering.

If you rent compute from a cloud vendor, you usually just see the cost listed under **GPUs**. But when reading their marketing materials or blog posts, it’s important to know exactly what’s being described.

## Why GPU choice matters for inference

Modern AI applications are increasingly powered by Generative AI (GenAI) models like LLMs. Unlike traditional ML models, these models can reach hundreds of billions of parameters, like DeepSeek-V3.1 with 671B parameters. To run models at this scale, you need extremely powerful GPUs such as the NVIDIA H200 or AMD MI300X. This way, you can fully unlock their inference potential with the latest optimization techniques.

However, not every workload needs that much horsepower. Smaller open-source LLMs, such as Llama-3.1-8B, run efficiently on mid-range GPUs like the NVIDIA L4 or AMD MI250. Lightweight models can even run on entry-level cards or commodity cloud instances.

The key is to find the right GPU for the job to achieve the best price-performance ratio. The wrong choice can lead to bottlenecks, limiting throughput, increasing latency, and driving up cost.

## Understanding GPU types

Not all GPUs are built for the same purpose. When you check a GPU benchmark, you’ll often see a mix of data center cards, consumer graphics cards, and even mobile chips. It’s important to understand the major categories before selecting the right one for your inference workload.

### Consumer GPUs

These GPUs are originally made for gaming, but still widely used for smaller open-source LLMs and experimentation. They usually have less VRAM but are cost-effective. Examples include NVIDIA RTX 4090 or AMD Radeon RX 7900 XTX.

### Workstation GPUs

Workstation cards sit between consumer and data center hardware. They’re a good fit for professionals who need strong compute on a single machine, often for 3D design, visualization, or model prototyping. Cards like NVIDIA RTX A6000 or AMD Radeon Pro W6800 fall into this category.

### Data center GPUs

Enterprises rely on data center GPUs for large-scale AI inference and High-Performance Computing (HPC) workloads. They offer high VRAM (40–192GB), strong memory bandwidth, and features like multi-instance GPU (MIG) or NVLink for scaling across clusters. Examples include NVIDIA A100, H100 and B200, as well as AMD MI300X and MI350X.

For teams renting cloud compute or [deploying LLM on-prem](../infrastructure-and-operations/on-prem-llms), data center GPUs are usually the most practical choice.

## Key considerations for choosing GPUs

When selecting GPUs, remember that raw benchmark numbers don’t tell the whole story. The best choice depends on a combination of hardware specifications, workload size, and ecosystem support.

### GPU memory (VRAM)

[VRAM](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference) sets the ceiling on model size and context length. For example, DeepSeek V3 and R1, with 671B parameters, require 8 NVIDIA H200 GPUs (141 GB each) to run. In contrast, smaller models such as Phi-3 can fit within 16–24GB when quantized.

A major challenge is the KV cache. Its size grows linearly with sequence length, meaning long-context workloads can quickly exhaust memory. To avoid bottlenecks, you need [distributed inference](../llm-inference-basics/distributed-inference) techniques like [prefill-decode disaggregation](../inference-optimization/prefill-decode-disaggregation) and [KV cache offloading](../inference-optimization/kv-cache-offloading).

### Memory bandwidth

Memory bandwidth determines how quickly tokens can be processed. You can prevent slowdowns by using higher-bandwidth cards like the NVIDIA H100 or AMD MI300X. However, you should fully test your model and inference runtime before deploying them into production.

### Compute throughput

Floating point operations per second (FLOPS) are commonly used to compare cards, but in practice what matters more is tokens per second. It becomes extremely important in high-concurrency scenarios, where latency directly affects user experience. To further improve throughput, you can apply techniques like [speculative decoding](../inference-optimization/speculative-decoding).

### Cost and availability

Consumer and workstation GPUs are accessible and cheaper but often limited in VRAM. Data center GPUs provide the scale and reliability for enterprise AI deployments, though **at a premium**. This is especially true for high-performance GPUs like NVIDIA H100 and H200.

For enterprise AI teams, a bigger challenge is what we call the **GPU CAP Theorem**: a GPU infrastructure cannot guarantee **Control**, on-demand **Availability**, and **Price** at the same time.

|  | Hyperscaler | NeoCloud (Serverless) | NeoCloud (Long-term Commitment) | On-Prem |
| --- | --- | --- | --- | --- |
| **Control** | ✅ High | ❌ Low | 🟡 Medium | ✅ High |
| On-demand **Availability** | 🟡 Medium | ✅ High | ❌ Low | ❌ Low |
| **Price** | ❌ High | 🟡 Medium | ✅ Low | 🟡 Medium |

For more information, see [How to Beat the GPU CAP Theorem in AI Inference](https://www.bentoml.com/blog/how-to-beat-the-gpu-cap-theorem-in-ai-inference).

### Ecosystem and framework support

A GPU is only as effective as the software that supports it. NVIDIA benefits from a mature CUDA Toolkit and TensorRT-LLM ecosystem. AMD’s ROCm stack is improving steadily, with growing support across PyTorch, vLLM, and SGLang.

Read the blog posts about the data center GPUs from NVIDIA and AMD for details:

- [NVIDIA Data Center GPUs Explained: From A100 to B200 and Beyond](https://www.bentoml.com/blog/nvidia-data-center-gpus-explained-a100-h200-b200-and-beyond)
- [AMD Data Center GPUs Explained: MI250X, MI300X, MI350X and Beyond](https://www.bentoml.com/blog/amd-data-center-gpus-mi250x-mi300x-mi350x-and-beyond)

## Matching GPUs to open-source LLMs

Different models perform best on different types of GPUs. The table below maps popular NVIDIA and AMD GPUs to suitable open-source LLMs. Some models require **multiple GPUs to meet VRAM demands** or you may need optimization techniques like [quantization](./llm-quantization).

<GPUTable />

:::note
Use this table as a reference only. For production deployments, always benchmark your own models against the target hardware.
:::

Things to keep in mind:

- **FP8 support**. If you choose NVIDIA GPUs, note that LLMs that rely on native FP8 weights can only run on NVIDIA H-series (or newer) GPUs. This is because A-series cards lack FP8 hardware support.
- **Single vs. Multi-GPU**. Some models can run on one card, but usually performance improves with multiple GPUs (e.g., for high-concurrency scenarios).
- **Hardware flexibility**. Most models can run on different hardware. For instance, gpt-oss-20b and gpt-oss-120b can run on NVIDIA A100, H100, H200, B200 GPUs, or AMD MI300X, MI325X, MI355X GPUs. The limiting factor is usually VRAM and cluster size, not architecture. Learn how to [calculate GPU memory for serving LLMs](./calculating-gpu-memory-for-llms).

---

If you're evaluating GPU options for self-hosting LLMs, we support running both open and custom models across NVIDIA, AMD, Apple Silicon, CPUs, and more with a single codebase. You can run models locally, deploy in your own cloud (BYOC), or use shared and dedicated endpoints depending on your needs.

<div style={{ margin: '3rem 0' }}>
[<Button>Talk to us</Button>](https://www.modular.com/request-demo?utm_source=bentoml_llm)
</div>

## FAQs

### What is the best GPU comparison tool for AI workloads?

Most generic GPU comparison tools focus on gaming or graphics performance, which doesn’t reflect real AI inference workloads. For LLMs, you need tools that measure [throughput and latency metrics like TTFT and ITL](../inference-optimization/llm-inference-metrics).

You can start by checking open-source leaderboards from frameworks such as vLLM, SGLang, and TensorRT-LLM. They provide ready-to-use scripts that help you compare inference performance across different GPUs.

However, these frameworks usually require manual configuration and tuning, which can be time-consuming.

A faster option is [llm-optimizer](https://www.bentoml.com/blog/announcing-llm-optimizer), an open-source tool for benchmarking and optimizing LLM inference. It works across multiple inference frameworks and supports any open-source LLM. It lets you define constraints such as *“TTFT under 200ms”* or *“P99 ITL below 10ms.”* This helps you quickly find the optimal configurations that meet your performance goals.

### Where can I buy or rent GPU servers?

You can either buy on-premises GPU servers or rent cloud GPUs depending on your scale, control needs, and budget.

Cloud providers such as AWS, Google Cloud and Azure let you rent H100, H200 or MI300X GPUs on demand.

NeoClouds like CoreWeave and Nebius provide lower-cost access and flexible billing. However, they typically offer less control and fewer compliance guarantees for regulated or enterprise environments.

If you prefer full ownership, you can purchase GPU servers outright from original equipment (OE) partners like Dell, GIGABYTE, or HPE, which work directly with NVIDIA and AMD. This route gives you maximum control, but also means higher upfront costs and longer procurement cycles.

For details, read the [2026 GPU Procurement Guide](https://www.bentoml.com/blog/where-to-buy-or-rent-gpus-for-llm-inference).

### How can I check what GPU I have?

On most systems, you can quickly verify your GPU type using command-line tools:

- **Linux**: `nvidia-smi` (for NVIDIA) or `amd-smi` (for AMD).
- **macOS**: `system_profiler SPDisplaysDataType`.
- **Windows**: Open **Device Manager** → **Display Adapters**.

### How important are CUDA and driver versions when choosing a GPU?

Very important. GPU performance isn’t just about the hardware. Your NVIDIA driver, CUDA version, and framework build (e.g., PyTorch, vLLM, SGLang, TensorRT-LLM) all need to line up. When they don’t, you’ll see errors, slowdowns, or missing features like FP8 or [FlashAttention](../kernel-optimization/flashattention). If you want the lower-level reason these mismatches matter, refer to [GPU architecture fundamentals](../kernel-optimization/gpu-architecture-fundamentals).

For NVIDIA GPUs:

- **Driver** contains the [CUDA Driver API](https://docs.nvidia.com/cuda/cuda-driver-api/index.html) and talks directly to the GPU
- **CUDA toolkit** provides development tools, compilers and libraries
- **cuDNN, cuBLAS and NCCL** power operations inside PyTorch and most inference engines
- **Framework builds** are compiled for a specific CUDA toolkit version

If any part of the stack is outdated, you might hit issues like:

- “CUDA driver version is insufficient”
- Kernel failures
- Poor throughput
- Missing FP8, FlashAttention, or device-level optimizations

A simple rule of thumb:

- Your **driver's CUDA version** must be ≥ the **CUDA toolkit version** your framework was built with.
- Newer drivers are usually backwards compatible with older CUDA toolkits.
- Older drivers can’t run newer CUDA runtimes.

You can confirm your driver and GPU with:

```bash
nvidia-smi

# Example output:
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.129.03             Driver Version: 535.129.03   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
```

This means your driver supports up to CUDA 12.2 runtime. Your framework can be built with CUDA 12.2, 12.1, 11.8, etc., but not 12.3 or newer.

To upgrade, download the official [CUDA toolkit](https://developer.nvidia.com/cuda-downloads) and [driver](https://www.nvidia.com/en-us/drivers/) packages.

<LinkList>
  ## Additional resources
  * [NVIDIA Data Center GPUs Explained: From A100 to B200 and Beyond](https://www.bentoml.com/blog/nvidia-data-center-gpus-explained-a100-h200-b200-and-beyond)
  * [AMD Data Center GPUs Explained: MI250X, MI300X, MI350X and Beyond](https://www.bentoml.com/blog/amd-data-center-gpus-mi250x-mi300x-mi350x-and-beyond)
  * [How to Beat the GPU CAP Theorem in AI Inference](https://www.bentoml.com/blog/how-to-beat-the-gpu-cap-theorem-in-ai-inference)
  * [What is GPU Memory and Why it Matters for LLM Inference](https://www.bentoml.com/blog/what-is-gpu-memory-and-why-it-matters-for-llm-inference)
</LinkList>
