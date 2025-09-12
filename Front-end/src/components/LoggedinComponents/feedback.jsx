import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

export default function FeedbackApp() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [improvement, setImprovement] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (newFeature.trim() || improvement.trim()) {
      try {
        // Send email using mailto link
        const subject = encodeURIComponent('Customer Feedback - New Feature Request & Improvements');
        const body = encodeURIComponent(`
New Feature Request:
${newFeature.trim() || 'No new feature requested'}

Improvements Suggested:
${improvement.trim() || 'No improvements suggested'}

---
This feedback was submitted through the customer feedback form.
        `);
        
        const mailtoLink = `mailto:aatif2003@gmail.com?subject=${subject}&body=${body}`;
        window.open(mailtoLink, '_blank');
        
        setIsSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setNewFeature('');
          setImprovement('');
        }, 2000);
      } catch (error) {
        console.error('Error sending feedback:', error);
        alert('There was an error sending your feedback. Please try again.');
      }
    }
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Main App Content */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Your App Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-gray-600 mb-4 text-sm sm:text-base">Welcome to your application! We're always looking to improve.</p>
          
          {/* Feedback Icon Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-3 sm:p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
              aria-label="Share Feedback"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">We Value Your Feedback</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {!isSubmitted ? (
                <>
                  {/* New Feature Section */}
                  <div className="mb-6">
                    <label className="block text-base sm:text-lg font-semibold text-cyan-700 mb-3">
                      What new feature you want?
                    </label>
                    <textarea
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Describe the new feature you'd like to see..."
                      className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm sm:text-base"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs sm:text-sm text-gray-500">Describe in 50 words</p>
                      <span className={`text-xs sm:text-sm ${getWordCount(newFeature) > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                        {getWordCount(newFeature)}/50 words
                      </span>
                    </div>
                  </div>

                  {/* Improvement Section */}
                  <div className="mb-6">
                    <label className="block text-base sm:text-lg font-semibold text-cyan-700 mb-3">
                      What we can improve?
                    </label>
                    <textarea
                      value={improvement}
                      onChange={(e) => setImprovement(e.target.value)}
                      placeholder="Tell us what we can do better..."
                      className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none text-sm sm:text-base"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs sm:text-sm text-gray-500">Describe in 50 words</p>
                      <span className={`text-xs sm:text-sm ${getWordCount(improvement) > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                        {getWordCount(improvement)}/50 words
                      </span>
                    </div>
                  </div>

                  {/* Notice */}
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3 sm:p-4 mb-6">
                    <p className="text-cyan-700 text-xs sm:text-sm">
                      <strong>Note:</strong> Your feedback will directly go to our{' '}
                      <span className="font-semibold">"developer team"</span> and we will soon be implementing those features.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!newFeature.trim() && !improvement.trim()}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 sm:px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </button>
                  </div>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Your feedback has been sent to our developer team.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}