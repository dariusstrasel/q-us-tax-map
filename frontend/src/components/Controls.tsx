import React from 'react';

type ControlsProps = {
  onCsvUpload: (file: File) => void;
  onRandomize: () => void;
};

export function Controls({ onCsvUpload, onRandomize }: ControlsProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onCsvUpload(file);
  }

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center">
      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
        <span className="font-medium">Upload CSV:</span>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="block text-xs sm:text-sm"
        />
      </label>

      <button
        type="button"
        onClick={onRandomize}
        className="w-full sm:w-auto rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition"
      >
        Random Scenario
      </button>
    </div>
  );
}