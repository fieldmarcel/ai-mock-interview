// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");
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

export async function generateFeedback(interviewInfo, userAnswers) {
  try {
    // Prepare data for AI analysis
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

      Please provide feedback in the following format:
      
      Overall Assessment: [Brief summary of performance]
      
      Strengths: [3-4 key strengths]
      
      Areas for Improvement: [3-4 specific areas to work on]
      
      Technical Competency: [Assessment of technical knowledge]
      
      Communication Skills: [Evaluation of clarity and structure]
      
      Recommendations: [Actionable advice for improvement]
      
      Score: [Overall score out of 100 with brief justification]

      Keep the feedback professional, constructive, and focused on helping the candidate improve.
      Be specific about what was good and what needs work.
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