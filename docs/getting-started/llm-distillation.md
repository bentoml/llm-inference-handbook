---
sidebar_position: 6
description: Learn how LLM distillation works, how it compares to quantization, and how to use it to build smaller, faster, and more efficient models for inference.
keywords:
    - LLM distillation, knowledge distillation, model distillation
    - Teacher-student model, distilled LLM
    - Response distillation, chain-of-thought distillation
    - DeepSeek-R1 distillation
---

import LinkList from '@site/src/components/LinkList';

# LLM distillation

[Knowledge distillation](https://arxiv.org/abs/1503.02531) is a model compression technique that trains a smaller student model to replicate the behavior of a larger teacher model. The result is a model that is smaller, faster, and cheaper to run during inference. More importantly, it retains much of the teacher's capability.

A simple way to think about it:

- The teacher already knows how to solve the task well
- The student learns by copying the outputs from the teacher

Unlike [quantization](./llm-quantization), which reduces the precision of existing weights, distillation produces an entirely new model. The two techniques are complementary. A distilled model can also be quantized for further efficiency.

DeepSeek-R1 (671B parameters) is a good example of what distillation enables. Researchers used it to transfer reasoning ability into smaller models, including 1.5B, 7B, 8B, 14B, 32B, and 70B variants. They reason in a style similar to the teacher, at a fraction of the inference cost.

## How distillation works

Standard training teaches a model using hard labels: the correct answer for a given input.

Distillation instead trains the student on the teacher's soft labels, which are the full probability distribution over possible next tokens.

These soft labels contain richer information than a single correct answer. For example, if a teacher assigns 40% probability to "car" and 30% to "vehicle", the student learns not just the answer, but also which alternatives are plausible and how confident the teacher is. This helps the student generalize better.

The student is typically trained using a combination of:

- **Distillation loss**: Measures how closely the student matches the output distribution of the teacher.
- **Cross-entropy loss**: Standard next-token prediction on labeled data.

These objectives are combined to balance knowledge transfer and task performance.

## Types of distillation

### Response distillation

The student is trained to match the output token probabilities of the teacher. This is the most common form because it only requires access to the teacher's outputs. It scales well and is widely used to produce smaller, general-purpose models.

### Feature distillation

The student is trained to mimic the intermediate representations: hidden states, attention patterns, or layer activations. This requires access to the internals of the teacher and is more expensive to implement, but can produce better knowledge transfer for architecturally similar models.

### Chain-of-thought distillation

The teacher generates full reasoning traces, namely step-by-step solutions to problems, and the student is fine-tuned on those traces. This is how DeepSeek-R1 distilled variants were created. It has significantly improved the reasoning ability of smaller models, especially for tasks like math, coding, and logical problem solving.

## When to use distillation

Distillation is a good choice if:

- You need a smaller, faster model for latency-sensitive or resource-constrained deployments.
- A quantized version of a large model still exceeds your VRAM or latency budget.
- You have access to a strong teacher model and can afford the training cost.
- You want to transfer a specific capability (such as reasoning or coding) into a smaller model.

Distillation may not be the right choice if:

- The capability gap between the student and teacher is too large for the student architecture to absorb.
- You don't have the compute to run the teacher model at inference time during training.
- A quantized or fine-tuned version of an existing model already meets your requirements.
- You need maximum possible accuracy.

:::note
Not all models can be distilled. Some licenses prohibit using model outputs to train other models.
:::

## How distillation impacts inference

Distillation happens during training, but the benefits show up during inference.

By creating a smaller model, it directly improves serving efficiency:

- **Lower latency**: Faster token generation
- **Lower memory usage**: Requires less GPU memory
- **Higher throughput**: More requests can run in parallel on the same hardware
- **Lower cost**: Less compute required per request

In other words, distillation reduces the baseline cost of inference before any runtime optimizations are applied.

You can think of it this way:

- Distillation makes the model smaller
- Quantization makes the model lighter
- [Inference optimizations](../inference-optimization) (like [prefix caching](../inference-optimization/prefix-caching)) make serving more efficient

You can combine these techniques in you inference systems: Large model → Distill → Smaller model → Quantize (if needed) → Optimize serving → Deploy

## FAQs

### What are the main challenges of distillation?

Distillation can be effective, but it has the following trade-offs:

- Requires additional training compute
- Depends on the quality of the teacher model
- May lose performance on complex tasks
- Requires careful data generation and filtering

Therefore, many teams start with quantization and only use distillation when needed.

### What is the difference between distillation and quantization?

Here is a side-by-side comparison:

|  | Distillation | Quantization |
| --- | --- | --- |
| **What it changes** | Trains a new, smaller model | Reduces precision of an existing model |
| **Output** | A different model (student) | Same model, lower precision weights |
| **When it happens** | During training | After training |
| **Compute required** | High, requires training | Low, can be applied quickly |
| **Impact on size** | Reduces number of parameters | Reduces memory per parameter |
| **Ease of use** | More complex | Easier to apply |
| **Typical use case** | Build smaller production models | Optimize existing models for deployment |

<LinkList>
  ## Additional resources
  * [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948)
  * [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531)
  * [DistilBERT, a distilled version of BERT: smaller, faster, cheaper and lighter](https://arxiv.org/abs/1910.01108)
</LinkList>
