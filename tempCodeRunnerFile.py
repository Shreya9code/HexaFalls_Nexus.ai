# -*- coding: utf-8 -*-
# === Facial Expression Analyzer ===
# Focuses only on facial expressions and visual feedback

import cv2
import os
import json
from datetime import datetime
import numpy as np
import tkinter as tk
from tkinter import filedialog, messagebox

class FacialExpressionAnalyzer:
    def __init__(self):
        # Load only essential OpenCV models with proper path handling
        haarcascades_path = cv2.data.haarcascades
        self.face_cascade = cv2.CascadeClassifier(os.path.join(haarcascades_path, "haarcascade_frontalface_default.xml"))
        self.eye_cascade = cv2.CascadeClassifier(os.path.join(haarcascades_path, "haarcascade_eye.xml"))
        
        # Verify models loaded successfully
        if self.face_cascade.empty():
            raise ValueError("Failed to load face cascade model")
        if self.eye_cascade.empty():
            raise ValueError("Failed to load eye cascade model")
        
        print("✅ Facial expression models loaded successfully!")
        
    def choose_video_file(self):
        """Open file dialog to choose video file"""
        # Create a root window but hide it
        root = tk.Tk()
        root.withdraw()  # Hide the main window
        
        # Open file dialog
        file_path = filedialog.askopenfilename(
            title="Choose Video File for Facial Expression Analysis",
            filetypes=[
                ("Video files", "*.mp4 *.avi *.mov *.mkv *.wmv"),
                ("MP4 files", "*.mp4"),
                ("AVI files", "*.avi"),
                ("All files", "*.*")
            ]
        )
        
        # Destroy the root window
        root.destroy()
        
        if file_path:
            print(f"✅ Selected video: {file_path}")
            return file_path
        else:
            print("❌ No file selected")
            return None
        
    def analyze_facial_expressions(self, video_path):
        """Analyze facial expressions from video"""
        if not os.path.exists(video_path):
            return {"error": "Video file not found"}
        
        print("😊 Analyzing facial expressions...")
        
        # Analyze video frames
        analysis = self._analyze_frames(video_path)
        feedback = self._generate_facial_feedback(analysis)
        
        return feedback
    
    def _analyze_frames(self, video_path):
        """Analyze video frames for facial expressions"""
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return {"error": "Cannot open video"}
        
        # Video info
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        duration = total_frames / fps if fps > 0 else 0
        
        # Facial expression counters
        frames_with_face = 0
        frames_with_eyes = 0
        total_processed = 0
        face_positions = []
        eye_contact_frames = 0
        
        # Process every 10th frame for speed
        frame_skip = 10
        frame_count = 0
        
        print(f"📹 Analyzing {total_frames} frames for facial expressions...")
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Only process every 10th frame
            if frame_count % frame_skip == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Detect faces
                faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
                
                if len(faces) > 0:
                    frames_with_face += 1
                    
                    # Track face position for stability
                    (x, y, w, h) = faces[0]
                    center = (x + w//2, y + h//2)
                    face_positions.append(center)
                    
                    # Analyze eyes for eye contact
                    face_roi = gray[y:y+h, x:x+w]
                    eyes = self.eye_cascade.detectMultiScale(face_roi)
                    
                    if len(eyes) >= 2:  # Both eyes detected
                        frames_with_eyes += 1
                        eye_contact_frames += 1
                
                total_processed += 1
            
            frame_count += 1
            
            # Show progress
            if frame_count % 500 == 0:
                progress = (frame_count / total_frames) * 100
                print(f"⏳ {progress:.1f}% complete...")
        
        cap.release()
        
        # Calculate facial expression metrics
        face_visibility = (frames_with_face / total_processed) * 100 if total_processed > 0 else 0
        eye_contact_rate = (eye_contact_frames / frames_with_face) * 100 if frames_with_face > 0 else 0
        facial_stability = self._calculate_facial_stability(face_positions)
        
        return {
            "duration": duration,
            "face_visibility": face_visibility,
            "eye_contact_rate": eye_contact_rate,
            "facial_stability": facial_stability,
            "total_frames": total_frames
        }
    
    def _calculate_facial_stability(self, positions):
        """Calculate facial stability (how still the face stays)"""
        if len(positions) < 2:
            return 50  # Default score
        
        movements = []
        for i in range(1, len(positions)):
            prev = positions[i-1]
            curr = positions[i]
            distance = np.sqrt((curr[0] - prev[0])**2 + (curr[1] - prev[1])**2)
            movements.append(distance)
        
        if not movements:
            return 50
        
        avg_movement = np.mean(movements)
        # Convert to stability score (less movement = higher score)
        stability = max(0, 100 - (avg_movement / 5))
        return min(100, stability)
    
    def _generate_facial_feedback(self, analysis):
        """Generate specific facial expression feedback"""
        if "error" in analysis:
            return analysis
        
        # Facial expression assessment
        face_visibility = analysis["face_visibility"]
        eye_contact = analysis["eye_contact_rate"]
        stability = analysis["facial_stability"]
        
        # Generate facial expression feedback
        facial_feedback = {
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": round(analysis["duration"], 1),
            "facial_analysis": {
                "face_visibility": round(face_visibility, 1),
                "eye_contact": round(eye_contact, 1),
                "facial_stability": round(stability, 1)
            },
            "facial_expression_feedback": self._get_facial_expression_feedback(face_visibility, eye_contact, stability),
            "facial_suggestions": self._get_facial_suggestions(face_visibility, eye_contact, stability)
        }
        
        return facial_feedback
    
    def _get_facial_expression_feedback(self, visibility, eye_contact, stability):
        """Get specific feedback about facial expressions"""
        feedback_parts = []
        
        # Face visibility feedback
        if visibility >= 90:
            feedback_parts.append("Excellent face visibility - you stayed well-positioned in the camera frame.")
        elif visibility >= 70:
            feedback_parts.append("Good face visibility - you maintained good positioning most of the time.")
        elif visibility >= 50:
            feedback_parts.append("Fair face visibility - try to stay more centered in the camera view.")
        else:
            feedback_parts.append("Poor face visibility - ensure you're properly positioned in front of the camera.")
        
        # Eye contact feedback
        if eye_contact >= 80:
            feedback_parts.append("Strong eye contact - you maintained excellent engagement with the camera.")
        elif eye_contact >= 60:
            feedback_parts.append("Good eye contact - you showed consistent engagement.")
        elif eye_contact >= 40:
            feedback_parts.append("Fair eye contact - try to look at the camera more consistently.")
        else:
            feedback_parts.append("Weak eye contact - practice looking directly at the camera during interviews.")
        
        # Facial stability feedback
        if stability >= 80:
            feedback_parts.append("Excellent facial stability - you remained composed and steady.")
        elif stability >= 60:
            feedback_parts.append("Good facial stability - you stayed relatively still.")
        elif stability >= 40:
            feedback_parts.append("Fair facial stability - try to reduce unnecessary facial movements.")
        else:
            feedback_parts.append("Poor facial stability - work on staying more composed and reducing movement.")
        
        return " ".join(feedback_parts)
    
    def _get_facial_suggestions(self, visibility, eye_contact, stability):
        """Get specific suggestions for improving facial expressions"""
        suggestions = []
        
        if visibility < 70:
            suggestions.append("Position yourself better in the camera frame")
        
        if eye_contact < 60:
            suggestions.append("Practice maintaining eye contact with the camera")
        
        if stability < 60:
            suggestions.append("Work on staying more still and composed")
        
        if not suggestions:
            suggestions.append("Great facial expressions! Keep up the excellent work")
        
        return suggestions

# === Simple API Functions ===
def analyze_facial_expressions(video_path):
    """Analyze facial expressions in video"""
    analyzer = FacialExpressionAnalyzer()
    return analyzer.analyze_facial_expressions(video_path)

def print_facial_feedback(feedback):
    """Print formatted facial expression feedback"""
    if "error" in feedback:
        print(f"❌ Error: {feedback['error']}")
        return
    
    print("\n" + "="*60)
    print("😊 FACIAL EXPRESSION ANALYSIS")
    print("="*60)
    print(f"⏱️ Duration: {feedback['duration_seconds']} seconds")
    
    print(f"\n📊 FACIAL METRICS:")
    print(f"   • Face Visibility: {feedback['facial_analysis']['face_visibility']}%")
    print(f"   • Eye Contact: {feedback['facial_analysis']['eye_contact']}%")
    print(f"   • Facial Stability: {feedback['facial_analysis']['facial_stability']}%")
    
    print(f"\n💬 FACIAL EXPRESSION FEEDBACK:")
    print(f"   {feedback['facial_expression_feedback']}")
    
    print(f"\n💡 FACIAL EXPRESSION SUGGESTIONS:")
    for suggestion in feedback['facial_suggestions']:
        print(f"   • {suggestion}")
    
    print("="*60)

# === Test Function ===
if __name__ == "__main__":
    print("😊 FACIAL EXPRESSION ANALYZER")
    print("="*50)
    
    # Create analyzer and choose file
    analyzer = FacialExpressionAnalyzer()
    video_file = analyzer.choose_video_file()
    
    if video_file and os.path.exists(video_file):
        print("🚀 Starting facial expression analysis...")
        result = analyzer.analyze_facial_expressions(video_file)
        print_facial_feedback(result)
    else:
        print("❌ No valid video file selected")
        print("💡 Please run the program again and select a video file") 