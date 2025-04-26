import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

/**
 * Generates a summary of a GitHub repository based on its README content
 * @param {string} readmeContent - The content of the repository's README file
 * @returns {Promise<Object>} - A structured summary with main summary and cool facts
 */
export async function generateSummary(readmeContent) {
	// Define schema with Zod
	const summarySchema = z.object({
		summary: z.string()
			.min(50, 'Summary must be at least 50 characters')
			.max(500, 'Summary must not exceed 500 characters'),
		cool_facts: z.array(z.string())
			.min(1, 'Must provide at least 1 cool fact')
			.max(5, 'Cannot exceed 5 cool facts')
			.refine(facts => facts.every(fact => fact.length <= 100), {
				message: 'Each fact must not exceed 100 characters'
			})
	})

	// Create output parser with schema validation
	const parser = StructuredOutputParser.fromZodSchema(summarySchema)

	// Get format instructions
	const formatInstructions = parser.getFormatInstructions()

	// Create the prompt template
	const prompt = ChatPromptTemplate.fromTemplate(`
		Summarize this github repository from the readme file content below.
		Provide a concise summary (50-500 chars) and extract 1-5 interesting facts (max 100 chars each).
		
		README CONTENT:
		{readme}
		
		{format_instructions}
	`)

	// Use our mock LLM to generate a response
	const response = await mockLLM(readmeContent, formatInstructions)
	
	return response
}

/**
 * A mock LLM implementation that generates responses based on input content
 * @param {string} content - The content to analyze
 * @param {string} formatInstructions - Instructions for formatting the output
 * @returns {Promise<Object>} - A structured response
 */
async function mockLLM(content, formatInstructions) {
	// Extract key information from the content
	const titleMatch = content.match(/^#\s+(.+)$/m)
	const title = titleMatch ? titleMatch[1] : 'GitHub Repository'
	
	const descriptionMatch = content.match(/^(.+)$/m)
	const description = descriptionMatch ? descriptionMatch[1] : 'A repository with various features and functionality.'
	
	// Extract potential facts from the content
	const facts = []
	
	// Look for bullet points or numbered lists
	const bulletPoints = content.match(/^[-*]\s+(.+)$/gm) || []
	bulletPoints.forEach(point => {
		if (point.length <= 100) {
			facts.push(point.replace(/^[-*]\s+/, ''))
		}
	})
	
	// Look for code blocks
	const codeBlocks = content.match(/```[\s\S]+?```/g) || []
	if (codeBlocks.length > 0) {
		facts.push(`Contains ${codeBlocks.length} code examples`)
	}
	
	// Look for links
	const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []
	if (links.length > 0) {
		facts.push(`References ${links.length} external resources`)
	}
	
	// Generate a summary based on the extracted information
	const summary = `${title} is ${description.substring(0, 100)}... This repository contains various features and documentation to help users understand and utilize the project effectively.`
	
	// Ensure we have at least one fact
	if (facts.length === 0) {
		facts.push('This repository has comprehensive documentation')
		facts.push('The project follows modern development practices')
	}
	
	// Limit to 5 facts
	const limitedFacts = facts.slice(0, 5)
	
	// Return the structured response
	return {
		summary,
		cool_facts: limitedFacts
	}
} 