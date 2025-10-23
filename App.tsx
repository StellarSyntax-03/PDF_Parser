import React, { useState, useCallback } from 'react';
import { AppStatus, StatementData } from './types';
import { parseCreditCardStatement } from './services/geminiService';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statementData, setStatementData] = useState<StatementData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setStatus(AppStatus.IDLE);
    setStatementData(null);
    setError(null);
  };

  const resetState = () => {
    setStatus(AppStatus.IDLE);
    setSelectedFile(null);
    setStatementData(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const handleParse = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }
    
    setStatus(AppStatus.PROCESSING);
    setError(null);
    setStatementData(null);

    try {
      const base64String = await fileToBase64(selectedFile);
      const data = await parseCreditCardStatement(base64String);
      setStatementData(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      setStatus(AppStatus.ERROR);
    }
  }, [selectedFile]);

  const renderContent = () => {
    switch (status) {
      case AppStatus.PROCESSING:
        return (
          <div className="text-center p-8 space-y-4">
            <SpinnerIcon className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Analyzing your document...</p>
            <p className="text-sm text-slate-500">This may take a moment. Please wait.</p>
          </div>
        );
      case AppStatus.SUCCESS:
        return statementData && (
          <div className="flex flex-col items-center space-y-6">
            <ResultsDisplay data={statementData} />
            <button
              onClick={resetState}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors"
            >
              Parse Another Statement
            </button>
          </div>
        );
      case AppStatus.ERROR:
        return (
          <div className="flex flex-col items-center space-y-6 max-w-lg text-center">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 w-full rounded-r-lg">
                <h3 className="text-lg font-bold text-red-800">Parsing Failed</h3>
                <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={resetState}
              className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      case AppStatus.IDLE:
      default:
        return (
          <div className="flex flex-col items-center space-y-6">
            {/* FIX: Removed redundant status check. Inside this case, status is always IDLE, so the component should not be disabled. */}
            <FileUpload onFileSelect={handleFileSelect} disabled={false} />
            {selectedFile && (
              <div className="w-full max-w-lg text-center">
                <p className="text-sm text-slate-500 mb-4">
                  File selected: <span className="font-medium text-slate-700">{selectedFile.name}</span>
                </p>
                <button
                  onClick={handleParse}
                  // FIX: Removed redundant status check. Inside this case, status is always IDLE. The button's disabled state only depends on whether a file is selected.
                  disabled={!selectedFile}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Parse Statement
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
                Statement Parser
            </h1>
            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                Effortlessly extract key data from your credit card statements. Powered by Gemini.
            </p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full flex items-center justify-center min-h-[350px]">
          {renderContent()}
        </div>
        <footer className="mt-10 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Statement Parser. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
