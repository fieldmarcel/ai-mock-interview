import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function generateResponse(prompt) {
  const chatSession = model.startChat({
    generationConfig,
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text().replace('```json','').replace('```','');
}

/**
 * Generate an ideal answer for a given interview question
 */
export async function generateIdealAnswer(question, role, description, experience) {
  try {
    const prompt = `
You are an expert interviewer for the role: ${role}.
Role description: ${description}
Experience level: ${experience} years

Generate an IDEAL answer for the following interview question. The answer should:
- Be comprehensive and well-structured
- Include specific examples and metrics where applicable
- Demonstrate the expected depth of knowledge for ${experience} years of experience
- Use the STAR method (Situation, Task, Action, Result) for behavioral questions
- Be 3-5 sentences long for most questions
- Show technical expertise for technical questions

Question: ${question}

Provide ONLY the ideal answer, nothing else.
`;

    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating ideal answer:", error);
    throw error;
  }
}

/**
 * Compare user's answer with ideal answer and provide detailed feedback
 */
export async function compareAnswers(question, idealAnswer, userAnswer, role) {
  try {
    const prompt = `
You are an expert interview evaluator for the role: ${role}.

Question: ${question}

Ideal Answer:
${idealAnswer}

User's Answer:
${userAnswer}

Compare the user's answer with the ideal answer and provide a detailed evaluation in the following JSON format:
{
  "score": <number between 0-100>,
  "strengths": [<array of 2-4 specific strengths in the user's answer>],
  "improvements": [<array of 2-4 specific areas where the user can improve>],
  "feedback": "<detailed paragraph explaining the comparison, what was good, what was missing>"
}

Scoring criteria:
- 90-100: Exceptional answer that matches or exceeds the ideal answer
- 80-89: Very good answer with minor gaps
- 70-79: Good answer but missing some key points
- 60-69: Satisfactory answer but lacks depth or detail
- 50-59: Answer needs significant improvement
- Below 50: Poor answer with major gaps

Be specific and constructive in your feedback. Identify concrete strengths and improvements.
Return ONLY valid JSON, no additional text or markdown.
`;

    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Ensure arrays exist
      if (!Array.isArray(parsed.strengths)) {
        parsed.strengths = ["Answer provided"];
      }
      if (!Array.isArray(parsed.improvements)) {
        parsed.improvements = ["Could provide more specific examples"];
      }
      
      return parsed;
    }
    
    // Fallback if JSON parsing fails
    return {
      score: 70,
      strengths: ["Answer was provided"],
      improvements: ["Could provide more specific examples and details"],
      feedback: "Unable to generate detailed feedback at this time. Please try again."
    };
  } catch (error) {
    console.error("Error comparing answers:", error);
    
    // Return a default comparison on error
    return {
      score: 70,
      strengths: ["Answer was provided"],
      improvements: ["Consider adding more specific details and examples"],
      feedback: "Error occurred during comparison analysis. The system was unable to complete the evaluation."
    };
  }
}

/**
 * Generate overall feedback for the entire interview
 */
export async function generateFeedback(interviewInfo, userAnswers) {
  try {
    const analysisData = {
      role: interviewInfo.role,
      description: interviewInfo.description,
      experience: interviewInfo.experience,
      questions: userAnswers.map(qa => ({
        question: qa.question,
        answer: qa.answer
      }))
    };

    const prompt = `
Analyze this interview performance and provide constructive feedback:

JOB ROLE: ${analysisData.role}
JOB DESCRIPTION: ${analysisData.description}
REQUIRED EXPERIENCE: ${analysisData.experience} years

INTERVIEW QUESTIONS AND ANSWERS:
${analysisData.questions.map((qa, index) => `
Question ${index + 1}: ${qa.question}
Candidate's Answer: ${qa.answer}
`).join('\n')}

Please provide comprehensive feedback in the following format:

Overall Assessment: [Brief 2-3 sentence summary of performance]

Strengths: [3-4 key strengths demonstrated across answers]

Areas for Improvement: [3-4 specific areas to work on with concrete suggestions]

Technical Competency: [Assessment of technical knowledge and depth]

Communication Skills: [Evaluation of clarity, structure, and articulation]

Recommendations: [Actionable advice for improvement and interview preparation]

Score: [Overall score out of 100 with brief justification]

Keep the feedback professional, constructive, and focused on helping the candidate improve.
Be specific about what was good and what needs work. Use concrete examples from their answers.
`;

    const chatSession = model.startChat({ generationConfig });
    const result = await chatSession.sendMessage(prompt);
    
    const feedbackText = result.response.text();
    
    // Extract score from feedback (look for patterns like "Score: 85/100")
    const scoreMatch = feedbackText.match(/Score:\s*(\d+)\s*\/\s*100/i) || 
                      feedbackText.match(/(\d+)\s*\/\s*100/i);
    const overallScore = scoreMatch ? parseInt(scoreMatch[1]) : 70;

    return {
      feedback: feedbackText,
      overallScore: overallScore,
      analyzedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error("Failed to generate AI feedback");
  }
}