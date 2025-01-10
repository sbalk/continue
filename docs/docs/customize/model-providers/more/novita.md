# Novita

[Novita AI](https://novita.ai?utm_source=github_continuedev&utm_medium=github_readme&utm_campaign=github_link) offers an affordable, reliable, and simple inference platform with scalable [LLM API](https://novita.ai/docs/model-api/reference/introduction.html), empowering developers to build AI applications. Try the [Novita AI Llama 3 API Demo](https://novita.ai/model-api/product/llm-api/playground/meta-llama-llama-3.1-70b-instruct?utm_source=github_continuedev&utm_medium=github_readme&utm_campaign=github_link) today!. You can sign up [here](https://novita.ai/user/login?&redirect=/&utm_source=github_continuedev&utm_medium=github_readme&utm_campaign=github_link), copy your API key on the [Key Management](https://novita.ai/settings/key-management?utm_source=github_continuedev&utm_medium=github_readme&utm_campaign=github_link), and then hit the play button on any model from the [Novita AI Models list](https://novita.ai/llm-api?utm_source=github_continuedev&utm_medium=github_readme&utm_campaign=github_link). Change `~/.continue/config.json` to look like this:

```json title="config.json"
{
  "models": [
    {
      "title": "Llama 3.1 8B",
      "provider": "novita",
      "model": "meta-llama/llama-3.1-8b-instruct",
      "apiKey": "YOUR_API_KEY"
    }
  ]
}
```

[View the source](https://github.com/continuedev/continue/blob/main/core/llm/llms/Novita.ts)