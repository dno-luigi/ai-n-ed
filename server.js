import express from 'express';
    import axios from 'axios';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();
    const app = express();
    app.use(cors());
    app.use(express.json());

    const SERPER_API_KEY = process.env.SERPER_API_KEY;
    const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;

    async function searchWithSerper(query) {
      const url = 'https://google.serper.dev/search';
      const headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      };
      const data = { q: query };

      try {
        const response = await axios.post(url, data, { headers });
        return response.data.organic || [];
      } catch (error) {
        console.error('Serper API Error:', error);
        return [];
      }
    }

    async function callCloudflareLLM(query, context, model = '@cf/meta/llama-3-8b-instruct') {
      const url = `https://api.cloudflare.com/client/v4/accounts/771ee2cc20f09248129114b7535b2cc9/ai/run/${model}`;
      const headers = {
        Authorization: `Bearer ${CLOUDFLARE_API_KEY}`,
        'Content-Type': 'application/json',
      };
      const data = {
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: query },
        ],
      };

      try {
        const response = await axios.post(url, data, { headers });
        return response.data.result.response;
      } catch (error) {
        console.error('Cloudflare LLM Error:', error);
        return 'An error occurred while generating the response.';
      }
    }

    function getSnippetsForPrompt(snippets) {
      return snippets.map((snippet, i) => `[citation:${i + 1}] ${snippet.snippet}`).join('\n\n');
    }

    function setupGetAnswerPrompt(snippets) {
      const startingContext = `
        You are an assistant written by Josh Clemm. You will be given a question. And you will respond with two things.
        First, respond with an answer to the question. It must be accurate, high-quality, and expertly written in a positive, interesting, and engaging manner. It must be informative and in the same language as the user question.
        Second, respond with 3 related followup questions. First print "==== RELATED ====" verbatim. Then, write the 3 follow up questions in a JSON array format, so it's clear you've started to answer the second part. Do not use markdown. Each related question should be no longer than 15 words. They should be based on user's original question and the citations given in the context. Do not repeat the original question. Make sure to determine the main subject from the user's original question. That subject needs to be in any related question, so the user can ask it standalone.
        For both the first and second response, you will be provided a set of citations for the question. Each will start with a reference number like [citation:x], where x is a number. Always use the related citations and cite the citation at the end of each sentence in the format [citation:x]. If a sentence comes from multiple citations, please list all applicable citations, like [citation:2][citation:3].
        Here are the provided citations:
      `;
      return `${startingContext}\n\n${getSnippetsForPrompt(snippets)}`;
    }

    app.post('/search', async (req, res) => {
      const { query } = req.body;

      try {
        // 1. Call Serper API
        const snippets = await searchWithSerper(query);
        console.log('Sources:', snippets);

        // 2. Create a prompt and call Cloudflare LLM
        const answerPromptContext = setupGetAnswerPrompt(snippets);
        const answer = await callCloudflareLLM(query, answerPromptContext);

        res.json({ sources: snippets, answer });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
