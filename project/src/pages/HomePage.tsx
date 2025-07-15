import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Utensils, 
  Brain, 
  TrendingUp, 
  Smartphone, 
  Users, 
  Star,
  ChevronRight,
  CheckCircle,
  Play,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Award,
  Target,
  Heart,
  Clock,
  BarChart3,
  Sparkles,
  Crown,
  Check,
  X
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'Smart Food Recognition',
      description: 'Advanced AI that instantly recognizes foods and provides accurate nutritional analysis with scientific precision.',
      highlight: 'AI Technology'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Insights',
      description: 'Comprehensive analytics and personalized recommendations based on your health goals and nutritional science.',
      highlight: 'Smart Analytics'
    },
    {
      icon: Target,
      title: 'Personalized Goals',
      description: 'AI-calculated nutrition targets based on your body composition, activity level, and health objectives.',
      highlight: 'Personalization'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Advanced tracking and monitoring tools that help you stay on track with your health and fitness goals.',
      highlight: 'Progress Monitoring'
    }
  ];

  const pricingPlans = [
    {
      id: 'free',
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for getting started with nutrition tracking',
      features: [
        'Basic food tracking',
        'Simple nutrition charts',
        'Access to Kenyan food database',
        'Basic meal planning',
        'Community access'
      ],
      limitations: [
        'Limited to 3 meals per day',
        'Basic analytics only',
        'No AI recommendations'
      ],
      cta: 'Get Started Free',
      popular: false,
      color: 'border-secondary-600'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 'KSh 1,500',
      period: 'per month',
      description: 'For serious health enthusiasts and fitness professionals',
      features: [
        'Unlimited meal tracking',
        'AI-powered recommendations',
        'Advanced analytics & reports',
        'Custom meal planning',
        'Recipe creation & sharing',
        'Progress photos',
        'Export data',
        'Priority support'
      ],
      limitations: [],
      cta: 'Get Started Free',
      popular: true,
      color: 'border-primary-500'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For nutritionists, gyms, and healthcare providers',
      features: [
        'Everything in Professional',
        'Multi-client management',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Training & onboarding',
        'SLA guarantee'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false,
      color: 'border-accent-500'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Registered Dietitian',
      location: 'California',
      text: 'proFoodie has revolutionized how I help my clients track their nutrition. The AI recommendations are scientifically accurate and personalized.',
      rating: 5,
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'James Rodriguez',
      role: 'Fitness Coach',
      location: 'Texas',
      text: 'My clients love how easy it is to track their nutrition with AI. The data insights help them reach their fitness goals faster.',
      rating: 5,
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    {
      name: 'Grace Williams',
      role: 'Working Mother',
      location: 'New York',
      text: 'Finally, a nutrition app that actually understands my food! The AI meal planning feature saves me hours every week.',
      rating: 5,
      image: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    }
  ];

  const stats = [
    { number: '98%', label: 'Accuracy Rate', icon: Target },
    { number: '100K+', label: 'Active Users', icon: Users },
    { number: '2.5M+', label: 'Foods Analyzed', icon: BarChart3 },
    { number: '98%', label: 'AI Accuracy', icon: Brain }
  ];

  const faqs = [
    {
      question: 'How accurate is the nutritional data for Kenyan foods?',
      answer: 'Our database is curated by certified nutritionists and includes accurate data for over 500 traditional Kenyan foods, verified against USDA and local nutrition standards.'
    },
    {
      question: 'Can I use proFoodie offline?',
      answer: 'Yes! Core features like meal logging and basic tracking work offline. Data syncs automatically when you reconnect to the internet.'
    },
    {
      question: 'Is my health data secure?',
      answer: 'Absolutely. We use bank-level encryption and comply with international data protection standards. Your health data is never shared without your explicit consent.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, we\'ll refund your payment in full.'
    }
  ];

  // Food emojis for floating animation
  const foodEmojis = ['🥩', '🥬', '🍟', '🍗', '🐟', '🍎', '🥕', '🌽', '🍅', '🥑'];

  return (
    <div className="min-h-screen bg-secondary-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen">
        {/* Enhanced Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/90 via-secondary-900/80 to-primary-900/70" />
        
        {/* Animated Food Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {foodEmojis.map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ 
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <motion.div
                  className="relative w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Utensils className="w-6 h-6 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3"
                    animate={{ 
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-accent-400" />
                  </motion.div>
                </motion.div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold">
                  <span className="text-primary-500 lowercase font-light">pro</span>
                  <span className="text-white uppercase font-black">FOODIE</span>
                </h1>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-secondary-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-secondary-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-secondary-300 hover:text-white transition-colors">Reviews</a>
              <Link to="/auth">
                <motion.button
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-6 py-20 flex items-center min-h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6"
              >
                <Brain className="w-4 h-4 text-primary-400" />
                <span className="text-primary-300 text-sm font-medium">AI-Powered Nutrition • Data-Driven Health</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  Smart Nutrition AI
                </span>
                <br />
                <span className="text-white">for Better Health</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-secondary-300 mb-8 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Revolutionary AI-powered nutrition platform for data-driven health optimization. Track, analyze, and optimize your nutrition with intelligent food recognition, personalized recommendations, and science-based insights.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Link to="/auth">
                  <motion.button
                    className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-xl text-lg shadow-2xl shadow-primary-500/30 flex items-center space-x-3 overflow-hidden"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                
                <motion.button
                  onClick={() => setShowVideoModal(true)}
                  className="group flex items-center space-x-3 px-8 py-4 border-2 border-secondary-600 hover:border-primary-500 text-white font-bold rounded-xl text-lg hover:bg-secondary-800/50 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                  <span className="group-hover:text-primary-300 transition-colors">Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-6 text-secondary-400"
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Global Innovation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-green-400" />
                  <span className="text-sm">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">Data-Driven</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Demo */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-3xl p-8 border border-secondary-700 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-3xl" />
                
                {/* Mock App Interface */}
                <div className="relative space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Today's Goal</p>
                      <p className="text-secondary-400 text-sm">1,847 / 2,000 calories</p>
                    </div>
                  </div>
                  
                  <div className="bg-secondary-700/50 rounded-xl p-4">
                    <p className="text-primary-400 font-medium mb-2">🤖 AI Recommendation</p>
                    <p className="text-white text-sm">"Try adding sukuma wiki to your dinner for more iron and fiber!"</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
                      <p className="text-primary-400 font-bold">85g</p>
                      <p className="text-secondary-400 text-xs">Protein</p>
                    </div>
                    <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
                      <p className="text-accent-400 font-bold">180g</p>
                      <p className="text-secondary-400 text-xs">Carbs</p>
                    </div>
                    <div className="bg-secondary-700/50 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 font-bold">45g</p>
                      <p className="text-secondary-400 text-xs">Fat</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 pb-20 border-t border-primary-500/20 pt-12"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30 rounded-full px-6 py-3 mb-4"
            >
              <BarChart3 className="w-5 h-5 text-primary-400" />
              <span className="text-primary-300 font-semibold">Health Impact & Results</span>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-secondary-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary-800 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6"
            >
              <Brain className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">Powered by AI</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              Smart Nutrition Technology
            </h2>
            <p className="text-xl text-secondary-400 max-w-3xl mx-auto leading-relaxed">
              Advanced AI technology that understands nutrition science and provides personalized, data-driven recommendations for optimal health outcomes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-secondary-700 p-8 rounded-2xl border border-secondary-600 hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs font-medium">
                    {feature.highlight}
                  </span>
                </div>
                
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="w-8 h-8 text-primary-400 group-hover:text-primary-300 transition-colors" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-300 transition-colors">{feature.title}</h3>
                <p className="text-secondary-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400 bg-clip-text text-transparent">
              Trusted by Health Enthusiasts
            </h2>
            <p className="text-xl text-secondary-400">
              See what nutrition experts and health-conscious users are saying
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-secondary-700 p-8 rounded-2xl border border-secondary-600 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <Star className="w-5 h-5 text-accent-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-lg mb-6 italic leading-relaxed text-secondary-200">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-primary-300">{testimonial.name}</p>
                    <p className="text-secondary-400 text-sm">{testimonial.role}</p>
                    <p className="text-secondary-500 text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-secondary-400">
              Everything you need to know about proFoodie
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-secondary-800 border border-secondary-700 rounded-xl p-6 hover:border-primary-500/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-secondary-400 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
            backgroundSize: '50px 50px'
          }}
        />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands discovering the future of nutrition. AI-powered insights that understand your body, goals, and dietary preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span>Smart food recognition</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <CheckCircle className="w-5 h-5" />
                <span>Data-driven insights</span>
              </div>
            </div>
            <Link to="/auth">
              <motion.button
                className="group relative px-12 py-5 bg-white text-primary-500 font-black rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 group-hover:text-primary-600 transition-colors">
                  Start Your Health Journey
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-800 border-t border-secondary-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  <span className="text-primary-500 lowercase">pro</span>
                  <span className="text-white uppercase">FOODIE</span>
                </span>
              </motion.div>
              <p className="text-secondary-400 mb-6 max-w-md">
                Revolutionary AI nutrition platform for data-driven health optimization. Smart tracking, personalized insights, better results.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-secondary-700 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-secondary-700 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-secondary-700 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-secondary-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-500 text-sm mb-4 md:mb-0">
              © 2024 proFoodie. Made with ❤️ for better health.
            </p>
            <div className="flex items-center space-x-6 text-sm text-secondary-400">
              <span>🤖 AI-Powered</span>
              <span>📊 Data-Driven</span>
              <span>🎯 Results-Focused</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-secondary-800 rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Product Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-secondary-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-secondary-700 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <p className="text-white">Demo video coming soon!</p>
                <p className="text-secondary-400 text-sm">See smart nutrition AI in action</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;