import React from 'react';

export default function ReadingTable({ children }) {
  return (
    <div className="reading-table" role="region" aria-label="Table, scroll horizontally if needed" tabIndex={0}>
      <table>{children}</table>
    </div>
  );
}
