import React, { useState } from "react";
import { z } from "zod";
import { toast } from "sonner"
import {v4 as uuidv4} from "uuid";
import { PlusCircle, AlertCircle, Briefcase, FileText, Clock,Loader, Link, Key } from "lucide-react";
import { Button } from "./ui/Button";
import { generateResponse } from "../lib/GeminiAiModel";
 import { collection,addDoc } from "firebase/firestore";
 import { db,app } from "../config/FirebaseConfig";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
// Zod schema for form validation
const formSchema = z.object({
  role: z.string().min(1, "Role is required"),
  description: z.string().min(1, "Description is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
});
const AddNewInterview = () => {
  const [interviewQuestions, setInterviewQuestions] = useState([]);

  const {userId} = useAuth();
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState(0);
  const [errors, setErrors] = useState({}); // State for validation errors
  const [isSubmitting, setIsSubmitting] = useState(false);
const [airesponse, setAiResponse] = useState([]);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  try {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = { role, description, experience: Number(experience) };

const promptData = `Generate 10 interview questions and answers for:
Job Role: ${role}
Description: ${description}
Experience: ${experience} years

Return ONLY valid JSON in this format: 
[{ "question": "...", "answer": "..." }]`;
     const result = await generateResponse(promptData);

    const cleanedResult = result.replace(/```json/g, "").replace(/```/g, "").trim();
     console.log("The cleanedResult is:", cleanedResult);

    // Validate the JSON structure before parsing
    try {
        let questionsArray = [];

       const parsedData = JSON.parse(cleanedResult);

          questionsArray = parsedData;

      //  console.log("The parsedData is:", parsedData);

      //  const interviewQuestions = parsedData.interviewQuestions;
       //console.log("The interviewQuestions are:", interviewQuestions);

      const qaPairs = questionsArray.map((qa, index) => ({
  Key: index,
  question: qa.question,
}));
      console.log("The qaPairs are given as:", qaPairs);

      setAiResponse(result);
      setRole("");
      setDescription("");
      setExperience(0);

      const resp = await addDoc(collection(db, "ai-mock-interviewer"), {
        tempId: uuidv4(),
        role: role,
        description: description,
        experience: experience,
        // jsonMockResp: result,
        qaPairs: qaPairs,
        createdAt: new Date(),
        createdBy: userId,
      });
      console.log("Document written in Firebase in :", resp);

      // Validate form data
      formSchema.parse(formData);
      setErrors({});
      console.log("Form is valid:", formData);

      setTimeout(() => {
        setIsSubmitting(false);
        toast.success("Interview has been created successfully.", {
          style: {
            background: "black",
            color: "white",
            border: "1px solid #333",
          },
          icon: "🎉",
        });
      }, 200);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      toast.error("Failed to parse the AI response. Please try again.", {
        style: {
          background: "black",
          color: "white",
          border: "1px solid #333",
        },
        icon: "❌",
      });
    }
  } catch (validationError) {
    const validationErrors = {};
    validationError.errors.forEach((err) => {
      validationErrors[err.path[0]] = err.message;
    });
    setErrors(validationErrors);
    console.error("Validation Error:", validationError);
  } finally {
    setIsSubmitting(false);
  }

  navigate("/generate");
};

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 transform transition-all hover:shadow-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <PlusCircle className="mr-3" size={24} />
            Create a New Interview
          </h2>
          <p className="text-sm text-blue-100 mt-1">
            Fill in the details to schedule a new interview.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Role Input */}
          <div className="space-y-4">
            <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center">
              <Briefcase className="mr-2" size={18} />
              Role
            </label>
            <div className="relative">
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className={`block w-full px-4 py-3 bg-gray-50 border ${
                  errors.role ? "border-red-400" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              {errors.role && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
              )}
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="mr-1" size={12} />
                {errors.role}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="mr-2" size={18} />
              Description
            </label>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the role"
                rows="3"
                className={`block w-full px-4 py-3 bg-gray-50 border ${
                  errors.description ? "border-red-400" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              {errors.description && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
              )}
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="mr-1" size={12} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Experience Input */}
          <div className="space-y-4">
            <label htmlFor="experience" className="text-sm font-medium text-gray-700 flex items-center">
              <Clock className="mr-2" size={18} />
              Experience (Years)
            </label>
            <div className="relative">
              <input
                id="experience"
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Required years of experience"
                className={`block w-full px-4 py-3 bg-gray-50 border ${
                  errors.experience ? "border-red-400" : "border-gray-200"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
              {errors.experience && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
              )}
            </div>
            {errors.experience && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="mr-1" size={12} />
                {errors.experience}
              </p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-48 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-3xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <Loader className="opacity-25 " ></Loader>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Generating from AI
              </>
            ) : (
              "Create Interview"
            )}
          </Button>
          {/* </Link> */}
        </form>
      </div>
    </div>
  );
};

export default AddNewInterview;