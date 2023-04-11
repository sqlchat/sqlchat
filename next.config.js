const apiEndpoint = process.env.OPENAI_API_ENDPOINT || "https://api.openai.com";

module.exports = {
    async rewrites() {
      return [
        {
            source: "/v1/chat/completions",
            destination: `${apiEndpoint}/v1/chat/completions`,
          },
      ]
    },
  }