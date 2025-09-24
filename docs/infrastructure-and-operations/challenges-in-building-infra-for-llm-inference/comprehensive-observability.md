---
sidebar_position: 3
description: LLM observability provides end-to-end visibility into LLM inference, using metrics, logs, and events to ensure reliable, efficient, and scalable model performance.
keywords:
    - LLM inference observability, LLM-specific metrics, inference metrics
    - LLM monitoring, logging, alerts, tracing
    - Self-hosted LLM challenges
---

# LLM observability

LLM observability is the practice of monitoring and understanding the behavior of LLM inference systems in production. It combines metrics, logs, and events across infrastructure, application, and model layers to provide end-to-end visibility. The goal is to detect issues early, explain why they occur, and ensure reliable, efficient, and high-quality model responses.

Without proper observability, diagnosing latency issues, scaling problems, or GPU underutilization becomes guesswork. Worse, unnoticed issues can degrade performance or break your service without warning.

## What to measure

A production-ready observability stack for LLM inference spans multiple layers. Here's an example breakdown:

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