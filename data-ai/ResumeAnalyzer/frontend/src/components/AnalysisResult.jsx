import React from "react";

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const { analysis, resume_score, resume_rating } = result;

  // Determine progress bar color based on score
  const getProgressColor = (score) => {
    if (score >= 80) return "green";
    if (score >= 60) return "blue";
    if (score >= 40) return "orange";
    return "red";
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📊 Resume Analysis</h2>

      {resume_score !== undefined && (
        <div style={{ marginBottom: "1rem" }}>
          <p>
            <strong>Score:</strong> {resume_score}/100
          </p>
          <div
            style={{
              background: "#e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              height: "20px",
              width: "100%",
            }}
          >
            <div
              style={{
                width: ${resume_score}%,
                background: getProgressColor(resume_score),
                height: "100%",
                transition: "width 0.5s ease-in-out",
              }}
            />
          </div>
          <p>
            <strong>Rating:</strong> {resume_rating}
          </p>
        </div>
      )}

      {analysis ? (
        <div
          className="result-box"
          style={{
            background: "#f9f9f9",
            padding: "1rem",
            borderRadius: "8px",
            whiteSpace: "pre-line",
          }}
        >
          <p>{analysis}</p>
        </div>
      ) : (
        <p>No analysis available.</p>
      )}
    </div>
  );
};

export default AnalysisResult;
