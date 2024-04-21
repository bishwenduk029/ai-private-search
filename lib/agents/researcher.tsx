import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import {
  ExperimentalMessage,
  ToolCallPart,
  ToolResultPart,
  experimental_streamText
} from 'ai'
import { searchSchema } from '@/lib/schema/search'
import { Section } from '@/components/section'
import { OpenAI } from '@ai-sdk/openai'
import { ToolBadge } from '@/components/tool-badge'
import { SearchSkeleton } from '@/components/search-skeleton'
import { SearchResults } from '@/components/search-results'
import { BotMessage } from '@/components/message'
import Exa from 'exa-js'
import { SearchResultsImageSection } from '@/components/search-results-image'
import { Card } from '@/components/ui/card'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamText: ReturnType<typeof createStreamableValue<string>>,
  messages: ExperimentalMessage[],
  useSpecificModel?: boolean
) {
  const searchAPI: 'searxng' | 'exa' = 'searxng'

  let fullResponse = ''
  let hasError = false
  const answerSection = (
    <Section title="Answer">
      <BotMessage content={streamText.value} />
    </Section>
  )

  const result = await experimental_streamText({
    model: openai.chat(process.env.OPENAI_API_MODEL || 'gpt-4-turbo'),
    maxTokens: 2500,
    system: `As a professional search expert, you possess the ability to search for any information on the web. 
    For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
    If there are any images relevant to your answer, be sure to include them as well.
    Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly.
    Please match the language of the response to the user's language.`,
    messages,
    temperature: 0.3,
    tools: {
      search: {
        description: 'Search the web for information',
        parameters: searchSchema,
        execute: async ({
          query,
          max_results,
          search_depth
        }: {
          query: string
          max_results: number
          search_depth: 'basic' | 'advanced'
        }) => {
          uiStream.update(
            <Section>
              <ToolBadge tool="search">{`${query}`}</ToolBadge>
            </Section>
          )

          uiStream.append(
            <Section>
              <SearchSkeleton />
            </Section>
          )

          const searchResult =
            searchAPI === 'searxng'
              ? await searxngSearch(query, max_results, search_depth)
              : await exaSearch(query)

          uiStream.update(
            <Section title="Images">
              <SearchResultsImageSection
                images={searchResult.images || []}
                query={searchResult.query}
              />
            </Section>
          )
          uiStream.append(
            <Section title="Sources">
              <SearchResults results={searchResult.results} />
            </Section>
          )

          // Append the answer section if the specific model is not used
          if (!useSpecificModel) {
            uiStream.append(answerSection)
          }

          return searchResult
        }
      }
    }
  })

  const toolCalls: ToolCallPart[] = []
  const toolResponses: ToolResultPart[] = []
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          // If the first text delata is available, add a ui section
          if (fullResponse.length === 0 && delta.textDelta.length > 0) {
            // Update the UI
            uiStream.update(answerSection)
          }

          fullResponse += delta.textDelta
          streamText.update(fullResponse)
        }
        break
      case 'tool-call':
        toolCalls.push(delta)
        break
      case 'tool-result':
        toolResponses.push(delta)
        break
      case 'error':
        hasError = true
        fullResponse += `\nError occurred while executing the tool`
        break
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  })

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses })
  }

  return { result, fullResponse, hasError, toolResponses }
}

async function searxngSearch(
  query: string,
  maxResults: number = 10,
  searchDepth: 'basic' | 'advanced' = 'basic'
): Promise<any> {
  const response = await fetch('http://justask-backend:8000/v1/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query
    })
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json()
  return data
}

async function exaSearch(query: string, maxResults: number = 10): Promise<any> {
  const apiKey = process.env.EXA_API_KEY
  const exa = new Exa(apiKey)
  return exa.searchAndContents(query, {
    highlights: true,
    numResults: maxResults
  })
}
