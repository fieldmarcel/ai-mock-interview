// src/components/MiddleSection.jsx
import React from 'react';
import { Mic, Zap, Key, Trophy, Grid, Smartphone, Layers, BarChart, Brain, Globe } from 'lucide-react';

const MiddleSection = () => {
  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Speech Recognition",
      subtitle: "Real-Time Audio Intelligence",
      description: "Experience unmatched speed with our industry-leading 116ms response time, ensuring seamless and natural interview interactions."
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Premium AI",
      subtitle: "Advanced AI Models",
      description: "Powered by fine-tuned Deepseek V3 (rivaling GPT-4o), Azure GPT-4o & GPT-o3-mini, Google Gemini 2.0, and Claude 3.5 & 3.7 Sonnet (Beta) — delivering superior reasoning and accuracy compared to the GPT-4o Mini models used by 99% of similar platforms. Advanced models also come equipped with a WebSearch tool feature."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "AI-driven evaluation",
      subtitle: "Guaranteed Results",
      description: "80% of our subscribers secure their dream jobs within 3 months, with 40% landing $100K+ offers. Your success is our guarantee."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Full Coverage",
      subtitle: "Complete Career Ecosystem",
      description: "Access comprehensive interview prep, resume building, mock interviews, and join the largest community of tech professionals on Discord."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Optimized",
      subtitle: "Practice Anywhere",
      description: "No app download needed - get real-time answers in your live interview and conduct mock interviews anywhere, anytime with our mobile-optimized platform. Start practicing interviews instantly from your phone's browser."
    },
    {
      icon: <Layers className="w-8 h-8" />,
      title: "Cutting-Edge Technology",
      subtitle: "Dual-Layer AI Platform",
      description: "The only dual-layer platform offering both an AI Copilot and an AI Coach running simultaneously, delivering real-time insights and instant corrections."
    }
  ];

  return (
    <section className="w-full py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full mb-4">
            <Zap className="w-5 h-5 mr-2" />
            <span>Why use intervueX?</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The most advanced interview preparation platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Backed by cutting-edge AI technology designed to help you land your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="p-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-lg font-medium text-purple-600 mb-4">{feature.subtitle}</p>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20  rounded-3xl p-8 md:p-12 border border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center bg-amber-200 rounded-3xl p-8 md:p-12 shadow-green-950">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Proven Results Across Industries
                </h3>
                <p className="text-gray-600 mb-6">
                  Our AI-powered platform delivers measurable outcomes for job seekers at all career levels.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">80%</div>
                    <div className="text-gray-600">Job placement rate within 3 months</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">40%</div>
                    <div className="text-gray-600">Land $100K+ offers</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">3.2x</div>
                    <div className="text-gray-600">Faster interview preparation</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">94%</div>
                    <div className="text-gray-600">User satisfaction rate</div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">intervueX</div>
                        <div className="text-lg text-purple-600 mt-2">AI-Powered Success</div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold transform rotate-6">
                    Guaranteed Results
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MiddleSection;