---
slug: /
sidebar_position: 1
---

import Features from '@site/src/components/Features';
import LinkList from '@site/src/components/LinkList';
import Button from '@site/src/components/Button';

# What is LLM Inference?

LLM inference refers to using trained LLMs, such as GPT-4, Llama, and DeepSeek, to generate meaningful outputs from user inputs, typically provided as natural language prompts.

<Features>
  * Customer support chatbots generating personalized, contextually relevant replies
  * Writing assistants completing sentences, correcting grammar, or summarizing documents
  * Developer tools converting natural language descriptions into executable code
  * AI agents performing complex, multi-step reasoning and decision-making processes
</Features>

## What is LLM Inference?

LLM inference is the practical application of trained language models to generate meaningful outputs from user inputs. This process involves the model processing prompts through its vast parameter set to produce responses like text, code, summaries, or structured data.

**Training Phase:** This is the initial, computationally intensive phase where the model learns patterns from vast datasets. Training employs techniques like supervised learning (input-output pairs), reinforcement learning (trial and error with feedback), and self-supervised learning (predicting missing data parts). While training requires extensive GPU/TPU clusters and represents a significant upfront cost, it's typically a one-time expense per model version.

<div style={{ margin: '3rem 0' }}>
[<Button>Talk to us</Button>](https://docs.bentoml.org/en/latest/index.html)
</div>

**Inference Phase:** This is where the trained model actively serves users in real-time. Unlike training, inference happens continuously, responding immediately to user requests. While each individual inference operation may be computationally lighter than training, the cumulative demand across all users can result in substantial ongoing operational costs that scale with traffic and usage patterns.

:::tip

LLM inference costs can vary significantly based on model size, request frequency, and hardware configuration. It's important to monitor and optimize your inference pipeline for production workloads.

:::

```python
# Example: Simple LLM inference with BentoML
import bentoml
from transformers import AutoTokenizer, AutoModelForCausalLM

# Load a pre-trained model for inference
model_name = "microsoft/DialoGPT-medium"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@bentoml.service
class LLMInferenceService:
    def __init__(self):
        self.tokenizer = tokenizer
        self.model = model

    @bentoml.api
    def chat(self, user_input: str) -> str:
        # Tokenize user input
        inputs = self.tokenizer.encode(user_input + self.tokenizer.eos_token,
                                     return_tensors="pt")

        # Generate response
        with torch.no_grad():
            outputs = self.model.generate(
                inputs,
                max_length=1000,
                num_return_sequences=1,
                temperature=0.7,
                pad_token_id=self.tokenizer.eos_token_id
            )

        # Decode and return response
        response = self.tokenizer.decode(outputs[:, inputs.shape[-1]:][0],
                                       skip_special_tokens=True)
        return response
```

## What is the difference between LLM training and inference?

LLM training and inference are two different phases in the lifecycle of a model.

### Training: Building the model's understanding

Training occurs initially when building a model. It is about teaching the model how to recognize patterns and make accurate predictions. This is done by exposing the model to vast amounts of data and adjusting its parameters based on the data it encounters.

Common techniques used in the LLM training phase include:

- **Supervised learning:** Showing the model examples of inputs paired with the correct outputs.
- **Reinforcement learning:** Allowing the model to learn by trial and error, optimizing based on feedback or rewards.
- **Self-supervised learning:**. Learning by predicting missing or corrupted parts of the data, without explicit labels.

Training is computationally intensive, often requiring extensive GPU or TPU clusters. While this initial cost can be very high, it is more or less a one-time expense. Once the model achieves desired accuracy, retraining is usually only necessary to update or improve the model periodically.

### Inference: Using the model in real-time

LLM inference means applying the trained model to new data to make predictions. Unlike training, inference happens continuously and in real-time, responding immediately to user input or incoming data. It is the phase where the model is actively "in use." Better-trained and more finely-tuned models typically provide more accurate and useful inference.

Inference compute needs are ongoing and can become very high, especially as user interactions and traffic grow. Each inference request consumes computational resources such as GPUs. While each inference step may be smaller than training in isolation, the cumulative demand over time can lead to significant operational expenses.

<LinkList>
  ### Additional Resources
  * [Understanding LLM Inference](https://docs.bentoml.org/en/latest/index.html)
  * [BentoML LLM Examples](https://docs.bentoml.org/en/latest/index.html)
  * [Hugging Face Transformers Guide](https://docs.bentoml.org/en/latest/index.html)
</LinkList>
