import React from 'react'
import { useRouter, useParams } from 'next/navigation'

const Report = ({aiReport, onUploadNew}:any) => {
  const router = useRouter();
  const params = useParams();
  const recordId = params?.recordid;
  const [loading, setLoading] = React.useState(false);

  const handleReanalyze = async () => {
    setLoading(true);
    if (!recordId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/reanalyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId }),
      });
      const data = await res.json();
      if (data.newRecordId) {
        router.push(`/ai-tools/ai-resume-analyzer/${data.newRecordId}`);
      }
    } catch (err) {
      // No need to setError here, as the error handling is removed
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 gradient-component-text">AI Analysis Results</h2>
        </div>

        {/* Resume Score */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6 border border-blue-200 transform hover:scale-[1.01] transition-transform duration-300 ease-in-out">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4 flex items-center">
                <i className="fas fa-star text-yellow-500 mr-2"></i> Overall Score
              </h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-6xl font-extrabold text-blue-600">{aiReport?.overall?.score}<span className="text-2xl">/100</span></span>
                <div className="flex items-center">
                  <i className="fas fa-arrow-up text-green-500 text-lg mr-2"></i>
                  {aiReport?.overall?.score >= 85 && (
                    <span className="text-green-500 text-lg font-bold">Excellent!</span>
                  )}
                  {aiReport?.overall?.score >= 70 && aiReport?.overall?.score < 85 && (
                    <span className="text-blue-500 text-lg font-bold">Good</span>
                  )}
                  {aiReport?.overall?.score >= 50 && aiReport?.overall?.score < 70 && (
                    <span className="text-yellow-500 text-lg font-bold">Average</span>
                  )}
                  {aiReport?.overall?.score < 50 && (
                    <span className="text-red-500 text-lg font-bold">Needs Improvement</span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
              <div className="text-sm font-medium text-foreground dark:text-gray-100">Industry Benchmark</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{aiReport?.comparative_analysis?.industry_benchmark}</div>
              <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">Top Percentile: {aiReport?.comparative_analysis?.percentile}</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${aiReport?.overall?.score || 80}%`}}></div>
          </div>
          <p className="text-gray-600 dark:text-gray-100 text-sm">{aiReport?.overall?.feedback}</p>
        </div>

        {/* Section Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Info */}
          <div className="bg-card rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-3">
              <i className="fas fa-user-circle text-gray-500 mr-2"></i> Contact Info
            </h4>
            <span className="text-4xl font-bold text-green-600">{aiReport?.section_analysis?.contact_info?.score}%</span>
            <p className="text-sm text-foreground mt-2">{aiReport?.section_analysis?.contact_info?.comment}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Experience */}
          <div className="bg-card rounded-lg shadow-md p-5 border border-green-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-3">
              <i className="fas fa-briefcase text-gray-500 mr-2"></i> Experience
            </h4>
            <span className="text-4xl font-bold text-green-600">{aiReport?.section_analysis?.experience?.score}%</span>
            <p className="text-sm text-foreground mt-2">
              {aiReport?.section_analysis?.experience?.comment}
              <br />
              <span className="font-medium">Action verbs used:</span> {aiReport?.section_analysis?.experience?.action_verbs}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Education */}
          <div className="bg-card rounded-lg shadow-md p-5 border border-yellow-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-3">
              <i className="fas fa-graduation-cap text-gray-500 mr-2"></i> Education
            </h4>
            <span className="text-4xl font-bold text-yellow-600">{aiReport?.section_analysis?.education?.score}%</span>
            <p className="text-sm text-foreground mt-2">{aiReport?.section_analysis?.education?.comment}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Skills */}
          <div className="bg-card rounded-lg shadow-md p-5 border border-red-200 relative overflow-hidden group">
            <h4 className="text-lg font-semibold text-foreground dark:text-gray-100 mb-3">
              <i className="fas fa-lightbulb text-gray-500 mr-2"></i> Skills
            </h4>
            <span className="text-4xl font-bold text-red-600">{aiReport?.section_analysis?.skills?.score}%</span>
            <p className="text-sm text-foreground mt-2">{aiReport?.section_analysis?.skills?.comment}</p>
            <div className="text-xs mt-2">
              <span className="font-medium">Keyword Optimization:</span> {aiReport?.section_analysis?.skills?.keyword_optimization}%
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Tips & Improvements */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4 flex items-center">
            <i className="fas fa-lightbulb text-orange-400 mr-2"></i> Optimization Recommendations
          </h3>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Critical Fixes</h4>
            <ol className="list-decimal list-inside space-y-3 text-foreground text-sm">
              {aiReport?.optimization_recommendations?.critical?.map((tip: string, idx: number) => (
                <li key={idx}>{tip}</li>
              ))}
            </ol>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">Content Improvements</h4>
            <ol className="list-decimal list-inside space-y-3 text-foreground text-sm">
              {aiReport?.optimization_recommendations?.content?.map((tip: string, idx: number) => (
                <li key={idx}>{tip}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-2">Formatting Suggestions</h4>
            <ol className="list-decimal list-inside space-y-3 text-foreground text-sm">
              {aiReport?.optimization_recommendations?.formatting?.map((tip: string, idx: number) => (
                <li key={idx}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Skills Breakdown */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4 flex items-center">
            <i className="fas fa-code text-blue-500 mr-2"></i> Skills Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-foreground dark:text-gray-100 mb-2">Technical Skills ({aiReport?.section_analysis?.skills?.hard_skills?.length})</h4>
              <div className="flex flex-wrap gap-2">
                {aiReport?.section_analysis?.skills?.hard_skills?.map((skill: string, idx: number) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground dark:text-gray-100 mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {aiReport?.optimization_recommendations?.keyword_suggestions?.map((keyword: string, idx: number) => (
                  <span key={idx} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths / Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card rounded-lg shadow-md p-5 border border-green-200">
            <h3 className="text-lg font-bold text-foreground dark:text-gray-100 mb-3 flex items-center">
              <i className="fas fa-hand-thumbs-up text-green-500 mr-2"></i> What's Good
            </h3>
            <ul className="list-disc list-inside text-foreground text-sm space-y-2">
              {aiReport?.overall?.strengths?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg shadow-md p-5 border border-red-200">
            <h3 className="text-lg font-bold text-foreground dark:text-gray-100 mb-3 flex items-center">
              <i className="fas fa-hand-thumbs-down text-red-500 mr-2"></i> Needs Improvement
            </h3>
            <ul className="list-disc list-inside text-foreground text-sm space-y-2">
              {aiReport?.overall?.weaknesses?.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h3 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4 flex items-center">
            <i className="fas fa-info-circle text-gray-500 mr-2"></i> Analysis Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-foreground dark:text-gray-100">Analysis Date</div>
              <div>{aiReport?.metadata?.analysis_date}</div>
            </div>
            <div>
              <div className="font-medium text-foreground dark:text-gray-100">ATS Compatibility</div>
              <div className="capitalize">{aiReport?.metadata?.ats_compatibility}</div>
            </div>
            <div>
              <div className="font-medium text-foreground dark:text-gray-100">Resume Length</div>
              <div>{aiReport?.metadata?.resume_length}</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6 text-center gradient-button-bg">
          <h3 className="text-2xl font-bold mb-3">Ready to refine your resume?</h3>
          <p className="text-base mb-4">Make your application stand out with our premium insights and features.</p>
          <button
            type="button"
            onClick={() => router.push('/upgrade')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Upgrade to Premium <i className="fas fa-arrow-right ml-2 text-blue-600"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Report