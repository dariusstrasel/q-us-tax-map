import React from 'react';

type Props = {
  onCsvUpload: (file: File) => void;
  onRandomize: () => void;
};

export const Controls: React.FC<Props> = ({ onCsvUpload, onRandomize }) => (
  <div className="controls">
    <input
      type="file"
      accept=".csv"
      onChange={e => {
        if (e.target.files && e.target.files[0]) onCsvUpload(e.target.files[0]);
      }}
    />
    <button onClick={onRandomize}>Random Scenario</button>
  </div>
);