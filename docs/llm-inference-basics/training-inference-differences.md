---
sidebar_position: 2
description: LLM training builds the model while LLM inference applies it to generate real-time outputs from new inputs.
keywords:
    - LLM training vs. inference
    - LLM training, LLM inference
    - Differences between LLM inference and training
    - AI training, training techniques
    - Traning and inference
---

# What is the difference between LLM training and inference?

LLM training and inference are two different phases in the lifecycle of a model.

## Training: Building the model’s understanding

Training occurs initially when building an LLM. It is about teaching the model how to recognize patterns and make accurate predictions. This is done by exposing the model to vast amounts of data and adjusting its parameters based on the data it encounters.

Common techniques used in LLM training include:

- **Supervised learning**: Show the model examples of inputs paired with the correct outputs.
- **Reinforcement learning**: Allow the model to learn by trial and error, optimizing based on feedback or rewards.
- **Self-supervised learning**: Learn by predicting missing or corrupted parts of the data, without explicit labels.

Training is computationally intensive, often requiring expensive GPU or TPU clusters. While this initial cost can be very high, it is more or less a one-time expense. Once the model achieves desired accuracy, retraining is usually only necessary to update or improve the model periodically.

## Inference: Using the model in real-time

LLM inference means applying the trained model to new data to make predictions. Unlike training, inference [happens continuously and in real-time](./what-is-llm-inference), responding immediately to user input or incoming data. It is the phase where the model is actively "in use." Better-trained and more finely-tuned models typically provide more accurate and useful inference.

Inference compute needs are ongoing and can become very high, especially as user interactions and traffic grow. Each inference request consumes computational resources such as GPUs. While each inference step may be smaller than training in isolation, the cumulative demand over time can lead to significant operational expenses.
