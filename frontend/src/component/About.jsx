import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-background">
      <div className="about-card">
        <h2>About the Autism Detection Project</h2>
        <p>
          The Autism Detection Project leverages <strong>Artificial Intelligence (AI)</strong> to support early detection of <strong>Autism Spectrum Disorder (ASD)</strong> in young children.
        </p>
        <p>
          Early detection of ASD is crucial because it allows parents, caregivers, and educators to implement interventions that can significantly improve a child's <strong>communication, social interaction, and learning abilities</strong>.
        </p>
        <p>
          Our system analyzes behavioral patterns and developmental indicators through interactive tools, image analysis, and expert recommendations, providing guidance for timely support and personalized care.
        </p>
        <p>
          This project is designed to empower parents and professionals with <strong>reliable, AI-driven insights</strong> while maintaining <strong>privacy and ethical standards</strong>.
        </p>
        <button className="btn about-btn" onClick={() => navigate('/')}>
          Back
        </button>
      </div>
    </div>
  );
}
