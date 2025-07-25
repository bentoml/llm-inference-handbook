---
sidebar_position: 3
description: Ensure reliable LLM inference with comprehensive observability across metrics, logs, and GPU performance.
keywords:
    - LLM inference observability, LLM-specific metrics, inference metrics
    - GPU utilization, tokens per second, time to first token, total generation time, time per output token
    - LLM monitoring, logging, alerts, tracing
    - Self-hosted LLM challenges
---

# Comprehensive observability

Running LLM inference in production requires more than just getting the model to respond. You need full visibility into how your system is behaving at every level. Without proper observability, diagnosing latency issues, scaling problems, or GPU underutilization becomes guesswork. Worse, unnoticed issues can degrade performance or break your service without warning.

Effective observability requires the right metrics, dashboards, logs, and event streams, all tailored to the unique demands of LLM inference workloads.

## What to measure

A production-grade observability stack for LLM inference should cover metrics across the infrastructure, application, and model layers. Here's an example breakdown:

| **Category** | **Metric** | **What it tells you** |
| --- | --- | --- |
| **Container & Deployment** | Pod status | Detects failed, stuck, or restarting Pods before they affect availability |
|  | Number of replicas | Verifies autoscaling behavior and helps troubleshoot scaling delays or limits |
| **App Performance** | Requests per second (RPS) | Measures incoming traffic and system load |
|  | Request latency | Helps identify response delays and bottlenecks |
|  | In-progress requests | Indicates concurrency pressure; reveals if the app is keeping up with demand |
|  | Error rate | Tracks failed or invalid responses; useful for SLA monitoring |
|  | Queue wait time | Reveals delays caused by waiting for an available replica |
| **Cluster Resources** | Resource quotas & limits | Tracks usage boundaries; helps tune requests/limits and avoid over/under-provisioning |
| **LLM-Specific Metrics** | Tokens per second | Reflects model throughput and performance efficiency |
|  | Time to first token | Affects user-perceived latency; critical for streaming or chat-like experiences |
|  | Total generation time | Measures end-to-end performance for full completions |
| **GPU Metrics** | GPU utilization | Shows how busy your GPUs are; low values may signal underuse or poor batching |
|  | GPU memory usage | Helps with capacity planning and avoiding OOM errors |

Metrics tell you what is happening, but events and logs tell you why.

- **Events**: Useful for tracking cluster activity like Pod restarts, scaling events, or scheduling delays.
- **Log aggregation**: Centralized logs let you search across containers and time windows. This is vital for debugging request failures, identifying crashes, and tracing performance issues across services.