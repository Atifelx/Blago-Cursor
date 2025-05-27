





import EditorComponent from '../components/LoggedinComponents/Intial.editer';
import testdemoSvg from '../assets/blago_vid/livepreviewgif.gif';
import smartRewriterZoom from '../assets/blago_vid/rewritezoom.gif';
import smartRewriterDOC from '../assets/blago_vid/smartRewriterDOC.gif';
import smartPublished from '../assets/blago_vid/publishedW.gif';
import webscrap from '../assets/blago_vid/webscrap2.gif';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Edit3, Globe, Download, Zap, Users, Shield, ArrowRight } from 'lucide-react';
//import { Edit3, FileText, Globe, Download, CheckCircle } from 'lucide-react';


function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-xl">
              <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Content Revolution
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Human-Like</span> Content That Beats AI Detection
              </h1>
              
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Transform any text into undetectable, human-quality content. Our advanced AI rewrites, enhances, and optimizes your content while preserving meaning and intent.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-700 rounded-xl hover:from-gray-900 hover:to-emerald-900 transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200">
                  Watch Demo
                </button>
              </div>
              
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">No Credit Card Required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">99% Undetectable</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Placeholder for main hero image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">AI Detection Result</span>
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">Analysis Complete</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Human-written</span>
                      <span className="text-2xl font-bold text-green-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '95%'}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Your content passes all AI detection tests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">99%</div>
              <div className="text-sm text-gray-600">Undetectable Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">1M+</div>
              <div className="text-sm text-gray-600">Content Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>






<section className="py-24 bg-white">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">


    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        Everything You Need to Create 
        <span className="bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent block mt-2 font-bold">
          Perfect Content
        </span>
      </h2>
      <p className="mt-8 text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        Powerful tools designed to help you create, edit, and publish 
        <span className="font-medium text-green-500"> Undetectable Human-like Content</span> with ease.
      </p>
    </div>






          <div className="space-y-24">



            



{/* Feature 1: Smart Text Rewriter */}
<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

  {/* GIF Container - 60% */}
  <div className="flex-[0.6] w-full max-w-3xl">
    <div className="relative">
      <div className="w-full bg-gray-100 rounded-3xl border-gray-100 flex flex-col items-center justify-center shadow-2xl">
        <span className="text-gray-400 text-sm">
          <img 
            src={smartRewriterZoom} 
            alt="Smart Text Rewriter Demo" 
            className="w-full h-auto rounded-2xl mb-8 shadow-sm"
          />
        </span>
      </div>
    </div>
  </div>

  {/* Content - 40% */}
  <div className="flex-[0.4] max-w-xl">
    <div className="text-center lg:text-left">
      <h3 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6 leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        Smart Text <span className="bg-gradient-to-r from-emerald-400 to-cyan-800 bg-clip-text text-transparent font-light">Rewriter</span>
      </h3>
      
      <p className="text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        Select any text and instantly rewrite it to be <span className="font-medium text-yellow-500">99% Undetectable</span> by AI detection tools while maintaining original meaning and context.
      </p>

      <ul className="space-y-4 text-base lg:text-lg text-gray-600">
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Contextual understanding</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Preserve original meaning</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Multiple rewrite options</span>
        </li>
      </ul>

    </div>
  </div>
</div>





{/* Feature 2: Smart Text Rewriter */}
<div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">

  {/* GIF Container - 60% (now on the right) */}
  <div className="flex-[0.6] w-full max-w-3xl">
    <div className="relative">
      <div className="w-full bg-gray-100 rounded-3xl border-gray-100 flex flex-col items-center justify-center shadow-2xl">
        <span className="text-gray-400 text-sm">
          <img 
            src={smartRewriterDOC} 
            alt="Smart Text Rewriter Demo" 
            className="w-full h-auto rounded-2xl mb-8 shadow-sm"
          />
        </span>
      </div>
    </div>
  </div>

  {/* Content - 40% (now on the left) */}
  <div className="flex-[0.4] max-w-xl">
    <div className="text-center lg:text-left">
      <h3 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6 leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Document Upload & <span className="bg-gradient-to-r from-emerald-400 to-cyan-800 bg-clip-text text-transparent font-light">Rewriter</span>
      </h3>
      
      <p className="text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Generate Content <span className="font-medium text-yellow-500"> from uploaded file</span> Creating unique undetectable content which is likely generated by human
      </p>

      <ul className="space-y-4 text-base lg:text-lg text-gray-600">
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>AI-powered document rewriting</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Human-like content generation</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Rewrites without plagiarism</span>
        </li>
      </ul>

    </div>
  </div>
</div>




{/* Feature 3: Smart Text Rewriter */}
<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

  {/* GIF Container - 60% */}
  <div className="flex-[0.6] w-full max-w-3xl">
    <div className="relative">
      <div className="w-full bg-gray-100 rounded-3xl border-gray-100 flex flex-col items-center justify-center shadow-2xl">
        <span className="text-gray-400 text-sm">
          <img 
            src={smartPublished} 
            alt="Smart Text Rewriter Demo" 
            className="w-full h-auto rounded-2xl mb-8 shadow-sm"
          />
        </span>
      </div>
    </div>
  </div>

  {/* Content - 40% */}
  <div className="flex-[0.4] max-w-xl">
    <div className="text-center lg:text-left">
      <h3 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6 leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Instant  <span className="bg-gradient-to-r from-emerald-400 to-cyan-800 bg-clip-text text-transparent font-light">WordPress Publishing</span>
      </h3>
      
      <p className="text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Publish rewritten content to your WordPress blog in seconds—no copy-paste, no formatting issues. ,  <span className="font-medium text-yellow-500">saving you time</span> Blog smarter, not harder.
      </p>

      <ul className="space-y-4 text-base lg:text-lg text-gray-600">
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Instant WordPress Integration</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>No Copy-Paste Needed</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Instant WordPress Integration</span>
        </li>
      </ul>

    </div>
  </div>
</div>




{/* Feature 3: Smart Text Rewriter */}
<div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

  {/* GIF Container - 60% */}
  <div className="flex-[0.6] w-full max-w-3xl">
    <div className="relative">
      <div className="w-full bg-gray-100 rounded-3xl border-gray-100 flex flex-col items-center justify-center shadow-2xl">
        <span className="text-gray-400 text-sm">
          <img 
            src={webscrap} 
            alt="Smart Text Rewriter Demo" 
            className="w-full h-auto rounded-2xl mb-8 shadow-sm"
          />
        </span>
      </div>
    </div>
  </div>

  {/* Content - 40% */}
  <div className="flex-[0.4] max-w-xl">
    <div className="text-center lg:text-left">
      <h3 className="text-3xl lg:text-4xl font-light text-gray-800 mb-6 leading-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Effortless  <span className="bg-gradient-to-r from-emerald-400 to-cyan-800 bg-clip-text text-transparent font-light">Web Data Extraction</span>
      </h3>
      
      <p className="text-gray-600 mb-8 text-lg lg:text-xl leading-relaxed font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      Collects only publicly available content and structures it for <span className="font-medium text-yellow-500">research, analysis, or educational use </span>Helping you spark inspiration without copying.
      </p>

      <ul className="space-y-4 text-base lg:text-lg text-gray-600">
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>AI-rewritten for originality without copying.</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Grab Data with One Click</span>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
          <span className="font-light" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>Fast, Clean, Structured Output</span>
        </li>
      </ul>

    </div>
  </div>
</div>














<div className="flex items-center justify-center">
  <img 
    src={testdemoSvg} 
    alt="Smart Text Rewriter Demo" 
    className="w-96 h-auto rounded-2xl  shadow-sm"
  />
</div>

<EditorComponent />


          </div>
        </div>
      </section>












      

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Input Your Content</h3>
              <p className="text-gray-600">
                Paste text, upload documents, or scrape content from any URL. Our system handles all major formats.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Rewriting Magic</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes and rewrites your content to be 99% undetectable while preserving meaning.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export & Publish</h3>
              <p className="text-gray-600">
                Download as Word, publish directly to WordPress, or copy your human-like content ready for use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Trusted by Content Creators Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "This tool has revolutionized my content creation process. The AI detection bypass is incredible - I've never had content flagged!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Content Marketing Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The WordPress integration saves me hours every week. I can rewrite and publish content seamlessly without switching tools."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">Blog Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "As a freelance writer, this tool is a game-changer. The quality of rewritten content is consistently high and undetectable."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Rodriguez</div>
                  <div className="text-sm text-gray-600">Freelance Writer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




{/* Pricing Section */}
<section className="py-20 bg-gray-50">
  <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Try Everything Free for 30 Days
      </h2>
      <p className="mt-4 text-xl text-gray-600">
        Get unlimited access to all premium features with no restrictions
      </p>
    </div>

    <div className="max-w-2xl mx-auto">
      {/* Single Premium Plan */}
      <div className="bg-gradient-to-br from-green-400 to-cyan-700 p-8 rounded-2xl shadow-2xl text-white relative">
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-xs font-semibold bg-yellow-400 text-gray-900 rounded-full">
            30-Day Free Trial
          </span>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold">All Access Premium</h3>
          <div className="mt-4">
            <span className="text-5xl font-bold">Free</span>
            <span className="text-blue-100 text-lg"> for 30 days</span>
          </div>
          <div className="mt-2">
            <span className="text-blue-100">Then $29/month - Cancel anytime</span>
          </div>
          <p className="mt-4 text-blue-100 text-lg">Everything you need for content creation</p>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Content Features */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-yellow-300">Content Creation</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Unlimited words/month</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Advanced AI rewriting</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Built-in editor</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Document upload</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Web scraping</span>
              </li>
            </ul>
          </div>

          {/* Integration & Collaboration */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-yellow-300">Integration & More</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>WordPress integration</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Export to Word</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>API access</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                <span>Custom integrations</span>
              </li>
            </ul>
          </div>
        </div>

       

        <div className="mt-8">
          <Link
            to="/signup"
            className="block w-full px-8 py-4 text-center font-bold text-lg text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            Start Your 30-Day Free Trial
          </Link>
          <p className="text-center mt-3 text-blue-100 text-sm">
            No credit card required • Cancel anytime • Full access to everything
          </p>
        </div>
      </div>
    </div>

    {/* Trust indicators */}
    <div className="mt-12 text-center">
      <p className="text-gray-600 mb-4">Join thousands of content creators who trust our platform</p>
      <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          <span>No setup fees</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  </div>
</section>




































      {/* FAQ Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How does the AI detection bypass work?
              </h3>
              <p className="text-gray-600">
                Our advanced AI analyzes the structure, tone, and patterns of your content, then rewrites it using human-like language patterns that are virtually undetectable by AI detection tools while preserving the original meaning.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What file formats do you support for document upload?
              </h3>
              <p className="text-gray-600">
                We support all major document formats including DOC, DOCX, PDF, TXT, RTF, and more. Our system can extract and rewrite content from any text-based document format.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I integrate this with my existing WordPress site?
              </h3>
              <p className="text-gray-600">
                Yes! Our WordPress integration allows you to connect your site and publish rewritten content directly. You can schedule posts, optimize for SEO, and manage everything from our platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a limit to how much content I can rewrite?
              </h3>
              <p className="text-gray-600">
                This depends on your plan. Our Free plan includes 1,000 words per month, Pro plan includes 50,000 words, and Enterprise plan offers unlimited rewriting capabilities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How accurate is the web scraping feature?
              </h3>
              <p className="text-gray-600">
                Our web scraping technology can extract content from most websites with high accuracy. It automatically identifies and extracts the main content while filtering out navigation, ads, and other non-essential elements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-400 via-cyan-700 to-blue-900">
        <div className="px-4 mx-auto text-center max-w-4xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Create Undetectable Human-Like Content?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of content creators, marketers, and writers who trust our AI-powered platform to create authentic, engaging content that passes all detection tests.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1 shadow-lg"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-200">
              Schedule Demo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center text-blue-100">
              <Shield className="w-5 h-5 mr-2" />
              <span>99% Undetectable</span>
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <Users className="w-5 h-5 mr-2" />
              <span>50,000+ Happy Users</span>
            </div>
            <div className="flex items-center justify-center text-blue-100">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/api" className="text-gray-400 hover:text-white transition-colors">API</Link></li>
                <li><Link to="/integrations" className="text-gray-400 hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/status" className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
                <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link to="/compliance" className="text-gray-400 hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Blago AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;