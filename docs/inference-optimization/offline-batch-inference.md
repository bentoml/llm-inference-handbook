---
sidebar_position: 9
---

# Offline batch inference

Offline batch inference is the process of running models on large, static datasets to generate predictions in batches, rather than one at a time in real-time (online inference). It’s called "offline" because it doesn’t happen interactively; instead, it’s done as a bulk processing job.

By contrast, online inference means that the model only makes predictions on demand, for example, when a client requests a prediction.

**Key benefits of offline batch inference:**

- Precomputing predictions reduces the load on real-time systems
- More flexibility to use complex models that would be too slow for real-time inference.
- Supports post-processing and validation of predictions before using them in production.

**You may want to use offline batch inference in the following cases:**

- Your data doesn’t change often, so you don’t need real-time predictions.
- You have a large dataset to process, and the predictions can be stored and reused later.
- Your model is too big or slow for real-time predictions but works fine if run in advance.
- You want to validate or review predictions before serving them to users (e.g., for quality or compliance checks).