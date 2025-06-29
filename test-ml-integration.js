// Test script to verify ML model integration
(async () => {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

  console.log('🧪 Testing ML Model Integration...\n');
  
  try {
    // Test the analyze-video API endpoint
    const response = await fetch('http://localhost:3000/api/analyze-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoPath: 'uploads/temp.mp4',
        questionText: 'Tell me about yourself'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API Response Success!');
      console.log('📊 Analysis Results:');
      console.log(JSON.stringify(result, null, 2));
      
      // Verify the expected structure
      const hasRequiredFields = result.speechAnalysis && 
                               result.facialAnalysis && 
                               result.facial_metrics &&
                               result.isComplete;
      
      if (hasRequiredFields) {
        console.log('\n✅ All required fields present!');
        console.log(`📈 Face Visibility: ${result.facial_metrics.face_visibility}%`);
        console.log(`👀 Eye Contact: ${result.facial_metrics.eye_contact}%`);
        console.log(`🎯 Facial Stability: ${result.facial_metrics.facial_stability}%`);
        console.log(`🎤 Speech Confidence: ${(result.speechAnalysis.confidence * 100).toFixed(1)}%`);
      } else {
        console.log('\n❌ Missing required fields in response');
      }
    } else {
      console.log('❌ API request failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
})(); 