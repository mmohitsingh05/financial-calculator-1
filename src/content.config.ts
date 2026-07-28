import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const tools = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.string(),
    tier: z.enum(['high', 'medium', 'low']),
    description: z.string(),
    primaryKeyword: z.string(),
    secondaryKeywords: z.array(z.string()).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
})

const categories = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/categories' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    tools: z.array(z.string()),
  }),
})

export const collections = { tools, categories }