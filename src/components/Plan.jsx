import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Sparkles, Zap, Target, Users, Clock, TrendingUp } from 'lucide-react';

const Plan = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const iconVariants = {
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: { duration: 0.5 }
    }
  };

  const features = {
    quick: [
      "Unlimited 5-minute mock interviews",
      "Role-based questions for fast prep",
      "Real-time feedback to improve instantly",
      "Practice company-level, resume-based, MBA & salary negotiation questions (limited attempts)",
      "JD-based & system design basics (limited attempts)",
      "AI Resume Analyzer & Builder (limited access)"
    ],
    jobReady: [
      "Extended Interviews - Up to 30-minute sessions for deeper, more effective practice",
      "Scenario-Based Practice - Resume, company-level, MBA & salary negotiation interviews (30 mins each)",
      "Unlimited JD & System Design - No limits on job description or system design interviews",
      "Advanced AI Resume Tools - Create and analyze ATS-ready resumes—unlimited access"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-6 py-2 mb-6 border border-purple-500/30"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Take your interview preparation to the next level</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            IntervueX
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Choose the perfect plan for your interview success journey
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
        >
          {/* Quick Practice Plan */}
          <motion.div
            className="relative group"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredPlan('quick')}
            onHoverEnd={() => setHoveredPlan(null)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <Zap className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">Quick Practice</h3>
                  <p className="text-purple-300">On-the-Go Preparation</p>
                </div>
              </div>

              <div className="mb-8">
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  animate={{ 
                    scale: hoveredPlan === 'quick' ? 1.1 : 1,
                    color: hoveredPlan === 'quick' ? '#a855f7' : '#ffffff'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Free
                </motion.div>
                <p className="text-gray-400">Perfect for quick practice sessions</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.quick.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <motion.div
                      className="p-1 bg-green-500/20 rounded-full mt-1"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-3 h-3 text-green-400" />
                    </motion.div>
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/25"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Get Started Free
              </motion.button>
            </div>
          </motion.div>

          {/* Job-Ready Plan */}
          <motion.div
            className="relative group"
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredPlan('jobReady')}
            onHoverEnd={() => setHoveredPlan(null)}
          >
            {/* Popular Badge */}
            <motion.div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Most Popular
              </div>
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-400/50 hover:border-yellow-400/80 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <Target className="w-6 h-6 text-black" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">Job-Ready Preparation</h3>
                  <p className="text-yellow-300">Complete Interview Mastery</p>
                </div>
              </div>

              <div className="mb-8">
                <motion.div 
                  className="text-4xl font-bold mb-2 flex items-baseline gap-2"
                  animate={{ 
                    scale: hoveredPlan === 'jobReady' ? 1.1 : 1,
                    color: hoveredPlan === 'jobReady' ? '#f59e0b' : '#ffffff'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  $29
                  <span className="text-lg text-gray-400">/month</span>
                </motion.div>
                <p className="text-gray-400">Everything you need to land your dream job</p>
              </div>

              <div className="space-y-4 mb-8">
                {features.jobReady.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                  >
                    <motion.div
                      className="p-1 bg-yellow-500/20 rounded-full mt-1"
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-3 h-3 text-yellow-400" />
                    </motion.div>
                    <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-semibold text-black shadow-lg hover:shadow-yellow-500/25"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Start Premium Trial
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          variants={containerVariants}
        >
          {[
            { icon: Users, value: "50K+", label: "Active Users" },
            { icon: Clock, value: "1M+", label: "Practice Sessions" },
            { icon: TrendingUp, value: "94%", label: "Success Rate" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="inline-flex p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <stat.icon className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Plan;     