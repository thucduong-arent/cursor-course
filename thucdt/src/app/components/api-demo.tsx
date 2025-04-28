"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BookOpen, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface ApiResponse {
  summary: string
  cool_facts: string[]
}

export default function ApiDemo() {
  const [githubUrl, setGithubUrl] = useState("https://github.com/assafelovic/gpt-researcher")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    summary:
      "GPT Researcher is an autonomous agent designed for comprehensive online research on various tasks. It aims to produce detailed, factual, and unbiased research reports by leveraging AI technology. The project addresses issues of misinformation, speed, determinism, and reliability in research tasks.",
    cool_facts: [
      "The project leverages both 'gpt-4o-mini' and 'gpt-4o' (128K context) to complete research tasks, optimizing costs by using each only when necessary.",
      "The average research task using GPT Researcher takes around 2 minutes to complete and costs approximately $0.005.",
    ],
  })
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (session) {
      // If authenticated, redirect to playground
      router.push('/playground')
      return
    } else {
      // If not authenticated, redirect to login
      router.push('/auth/signin')
      return
    }
    
    // The code below will not execute due to the redirects above
    setLoading(true)
    setError(null)

    try {
      // In a real implementation, this would make an actual API call
      // For demo purposes, we're simulating a response
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (!githubUrl.includes("github.com")) {
        throw new Error("Please enter a valid GitHub URL")
      }

      // Generate a simulated response based on the URL
      const repoName = githubUrl.split("/").pop() || "repository"

      setResponse({
        summary: `${repoName} is a GitHub repository that provides valuable tools and resources for developers. This analysis provides insights into its structure, features, and community engagement.`,
        cool_facts: [
          `This repository has gained significant attention in the developer community for its innovative approach.`,
          `The average time to analyze this repository was approximately 2.5 seconds.`,
          `The repository demonstrates best practices in code organization and documentation.`,
        ],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the repository")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">API Demo</CardTitle>
        <CardDescription className="text-muted-foreground">Try our GitHub Analyzer API by entering a repository URL below</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="Enter GitHub repository URL"
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="mt-2">
              <div className="rounded-md bg-muted p-4 overflow-auto max-h-[300px]">
                <pre className="text-sm">
                  {`POST https://cursor-course-gamma.vercel.app/api/github-summarizer

{
  "githubUrl": "${githubUrl}"
}`}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="response" className="mt-2">
              <div className="rounded-md bg-muted p-4 overflow-auto max-h-[300px]">
                {error ? (
                  <div className="text-destructive">{error}</div>
                ) : (
                  <pre className="text-sm">
                    {`{
  "message": "GitHub repository summary generated successfully",
  "summary": "🔎 GPT Researcher is <div align=\"center\" id=\"top\">... This repository contains various features and documentation to help users understand and utilize the project effectively.",
  "cool_facts": [
    "Objective conclusions for manual research can take weeks, requiring vast resources and time.",
    "Current LLMs have token limitations, insufficient for generating long research reports.",
    "Limited web sources in existing services lead to misinformation and shallow results.",
    "Selective web sources can introduce bias into research tasks.",
    "Create a task-specific agent based on a research query."
  ],
  "stars": 21151,
  "latestVersion": "v3.2.7",
  "websiteUrl": "https://gptr.dev",
  "licenseType": "Apache-2.0"
}`}
                  </pre>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Response time: {loading ? "..." : "0.8s"}</div>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Documentation
        </Button>
      </CardFooter>
    </Card>
  )
} 