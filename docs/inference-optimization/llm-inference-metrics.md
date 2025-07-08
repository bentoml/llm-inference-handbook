---
sidebar_position: 1
---

# Key metrics for LLM inference

Before exploring optimization techniques, let’s understand the key metrics they target. Evaluating LLM performance involves using various tools that define, measure, and calculate these metrics differently.

## Latency

Latency measures how quickly a model responds to a request. For a single request, latency is the time from sending the request to receiving the final token on the user end. It’s crucial for user experience, especially in real-time applications.

There are two key metrics to measure latency:

- **Time to First Token (TTFT)**: The time it takes to generate the first token after sending a request. It reflects how fast the model can start responding. Different applications usually have different expectations for TTFT. For example, when summarizing a long document, users are usually willing to wait longer for the first token since the task is more demanding.
- **Time per Output Token (TPOT)**: Also known as inter-token latency (ITL), TPOT measures the time between generating each subsequent token. A lower TPOT means the model can produce tokens faster, leading to higher tokens per second.
    
    In streaming scenarios where users see text appear word-by-word (like ChatGPT's interface), TPOT determines how smooth the experience feels. It should be fast enough to keep pace with human reading speed.
    

## Throughput

Throughput describes how much work an LLM can do within a given period. High throughput is essential when serving many users simultaneously or processing large volumes of data.

There are two common ways to measure throughput:

- **Requests per Second (RPS)**: This metric captures how many requests the LLM can successfully complete in one second. It’s calculated as:
    
    ```bash
    Requests per second = Total completed requests / (T1 - T2)
    ```
    
    :::note

    Here, T1 and T2 mark the time window in seconds.

    :::
    
    RPS gives a general sense of how well the LLM handles concurrent requests. However, this metric alone doesn’t capture the complexity or size of each request. For example, generating a short greeting like `“Hi there!”` is far less demanding than writing a long essay.
    
    Factors that impact RPS:
    
    - Prompt complexity and length
    - Model size and hardware specifications
    - Optimizations (e.g., batching, caching, inference engines)
    - Latency per request
  
- **Tokens per Second (TPS)**: This metric provides a finer-grained view of throughput by measuring how many tokens are processed every second across all active requests. It comes in two forms:
    - **Input TPS**: How many input tokens the model processes per second.
    - **Output TPS**: How many output tokens the model generates per second.
    
    Understanding both metrics helps you identify performance bottlenecks based on the nature of your inference workload. For example:
    
    - A summarization request that includes long documents (e.g., 2,000-token inputs) cares more about input TPS.
    - A chatbot that generates long replies from short prompts (e.g., 20-token prompt → 500-token response) depends heavily on output TPS.
    
    When reviewing benchmarks or evaluating LLM performance, **always check whether TPS metrics refer to input, output, or a combined view**. They highlight different strengths and limitations depending on the use case.
    
    Factors that impact TPS:
    
    - Batch size (larger batches can increase TPS until saturation)
    - KV cache efficiency and memory usage
    - Prompt length and generation length
    - GPU memory bandwidth and compute utilization
    
    As the number of concurrent requests increases, the total TPS also grows, until the LLM hits the saturation point of available compute resources. Beyond this point, performance might decrease because the LLM is over capacity.
    
## Goodput

Goodput refines the idea of throughput. It measures how many requests per second the LLM successfully completes while meeting your defined service-level objectives (SLOs). This makes it a much more useful metric for real-world deployments, as it directly reflects service quality.

:::note

A **Service-Level Objective (SLO)** defines the target performance level for a particular metric. It sets a standard for what’s considered acceptable service. For example, an SLO for TTFT might specify that 95% of chatbot interactions should have a TTFT below 200 milliseconds. An SLO is typically a key part of a broader service-level agreement (SLA) between a service provider and its users.

:::

Why does goodput matter? A high throughput doesn’t always mean good user experience. If latency targets aren’t met, many of those requests may not be usable. Goodput is a direct measure of how well an LLM serving system meets both performance and user-experience goals under latency constraints. It helps avoid the trap of maximizing throughput at the cost of real user experience and cost-efficiency.

## Latency vs. throughput tradeoffs

When hosting and optimizing LLM inference, there’s always a balance between two key goals: minimizing latency and maximizing throughput. Let’s break down what that means.

| Goal | Implication |
| --- | --- |
| Maximize throughput (TPS/MW) | Focus on serving as many tokens per watt as possible. This usually means using larger batch sizes and shared compute resources. However, it can slow down responses for individual users. |
| Minimize latency (TPS per user) | Focus on giving each user a fast response (low TTFT). This often involves small batches and isolated compute resources, but it means you’ll use GPUs less efficiently. |
| Balance of both | Some systems aim for a dynamic balance. They tune resource usage in real time based on workload, user priority, and app requirements. This is ideal for serving diverse applications with different SLOs. |

To reach the best trade-off for your use case, you’ll need to adjust several important system-level “knobs”, such as Data Parallelism (DP), Tensor Parallelism (TP), Expert Parallelism (EP), batch size, precision (e.g., FP8, FP4), and disaggregation (separating prefill and decode). These tuning options directly impact how well you can optimize for either low latency or high throughput, or find the right middle ground. More details will be covered in the next section.

Using a serverless API can abstract away these optimizations, leaving you with less control over fine-tuning. On the other hand, building your own programmable and low-level stack lets you navigate these tradeoffs and align your system performance with your app’s specific SLO.