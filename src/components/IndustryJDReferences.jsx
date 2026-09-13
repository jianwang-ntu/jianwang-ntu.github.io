import React from 'react';
import ReactMarkdown from 'react-markdown';
import references from '../content/industry-jd-references.md?raw';

// Matched records transcribed from the supplied Research_Overview_JD_Method.md.
export default function IndustryJDReferences() {
  return (
    <details className="industry-references" id="industry-jd-references">
      <summary>References (JD sources)</summary>
      <div className="industry-references-body">
        <ReactMarkdown>{references}</ReactMarkdown>
      </div>
    </details>
  );
}
