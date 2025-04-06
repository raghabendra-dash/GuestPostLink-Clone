import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle, BarChart, Globe, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative">
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-blue-100">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'url(https://plus.unsplash.com/premium_photo-1683980578016-a1f980719ec2?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-7"
          >
            Publish Your Guest Posts on
            <span className="text-blue-600">
              {' '}Top-Ranking Platforms
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl text-gray-900 mb-8 max-w-3xl mx-auto"
          >
            Boost your online presence with high-quality guest posts on trusted websites.
            Reach new audiences and improve your SEO rankings.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/marketplace" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center">
              Get Started
              {/* <ArrowRight className="ml-2 h-6 w-5" /> */}
            </Link>
            <Link to="/marketplace" className="bg-blue-600 text-gray-100 px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center">
              Browse Marketplace
              {/* <ArrowRight className="ml-2 h-6 w-5" /> */}
            </Link>
          </motion.div>
        </div>
      </section>

      <section ref={ref} className="py-20 bg-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            {/* <div className='bg-blue-10'> */}
            <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              Get your content published on high-authority websites in three simple steps
            </p>
            {/* </div> */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-10 w-10 text-blue-700" />,
                title: "Choose Websites",
                description: "Browse our marketplace and select from hundreds of high-authority websites.",
              },
              {
                icon: <CheckCircle className="h-9 w-9 text-blue-700" />,
                title: "Submit Content",
                description: "Write your content or let our expert writers create it for you.",
              },
              {
                icon: <BarChart className="h-10 w-10 text-blue-700" />,
                title: "Track Progress",
                description: "Monitor your publication status and track performance metrics.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                variants={fadeInUp}
                className="bg-blue-300 p-8 rounded-xl shadow-lg transition-all duration-300 border border-indigo-400"
              >
                <div className="flex flex-col items-center text-center">
                  {step.icon}
                  <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-800">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-200 shadow-lg">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-3xl font-bold text-gray-800 mb-4">
              Why Choose GuestPostLink
            </h2>
            <p className="text-gray-800 max-w-2xl mx-auto">
              We provide the best guest posting service with guaranteed results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-blue-700" />,
                title: "Quality Guaranteed",
                description: "All websites are manually verified for quality and authority.",
              },
              {
                icon: <Globe className="h-8 w-8 text-blue-700" />,
                title: "Global Reach",
                description: "Access websites across different niches and countries.",
              },
              {
                icon: <BarChart className="h-8 w-8 text-blue-700" />,
                title: "SEO Benefits",
                description: "Improve your search rankings with high-quality backlinks.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                variants={fadeInUp}
                className="bg-blue-300 p-6 rounded-xl hover:shadow-sm transition-all duration-300 border border-indigo-400"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-200 p-3 rounded-md">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-800">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;