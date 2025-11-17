import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Header />

            {/* Hero Section */}
            <section className="relative flex items-center justify-center min-h-[80vh] py-20 px-6 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto text-center pt-24 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-gray-900 mb-6 drop-shadow-sm">
                        Build with natural language.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in-up animation-delay-500">
                        KingKong is a revolutionary platform that empowers developers to create, query, and deploy applications using simple natural language prompts.
                    </p>
                    <Link
                        to="/auth/register"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-12 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-1000"
                    >
                        Start Building Now
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </section>

          {/* Features Section */}
                    <section className="py-24 bg-white px-6 border-b border-gray-200">
                        <div className="container mx-auto">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">Features that Elevate your Workflow</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Feature 1 */}
                                <div className="p-6 bg-gray-50 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Natural Language Queries</h3>
                                    <p className="text-gray-600">Instantly query your database or internal APIs with simple, human-like sentences. Say goodbye to complex syntax.</p>
                                </div>
                                {/* Feature 2 */}
                                <div className="p-6 bg-gray-50 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Serverless Deployment</h3>
                                    <p className="text-gray-600">Automatically generate, test, and deploy serverless functions from a single prompt to a live endpoint in minutes.</p>
                                </div>
                                {/* Feature 3 */}
                                <div className="p-6 bg-gray-50 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Scalable</h3>
                                    <p className="text-gray-600">Your data is kept secure with enterprise-grade encryption, and the platform scales effortlessly to meet your growing needs.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-24 text-center px-6 bg-gray-800 text-white">
                        <div className="container mx-auto">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to simplify your workflow?</h2>
                            <p className="text-md md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
                                Join thousands of forward-thinking developers and businesses who are building the future with KingKong.
                            </p>
                            <Link
                                to="/auth/register"
                                className="inline-flex items-center justify-center bg-white hover:bg-gray-200 text-gray-800 font-semibold text-base py-3 px-8 rounded-md shadow-sm transition-colors duration-200"
                            >
                                Get Started for Free
                            </Link>
                        </div>
                    </section>

            <Footer />
        </div>
    );
};

export default LandingPage;