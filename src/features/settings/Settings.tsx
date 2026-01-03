import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

import { DEFAULT_GEMINI_KEY } from '../../constants';
export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    } else {
      setApiKey(DEFAULT_GEMINI_KEY);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setStatus('Settings saved successfully!');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Save className="text-indigo-600" size={28} />
          Settings
        </h1>
        <p className="text-gray-500 mt-1 ml-9">Manage your API keys and application preferences.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* API Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
             <h2 className="font-semibold text-gray-800">AI Configuration</h2>
             {status && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full animate-in fade-in">{status}</span>}
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gemini API Key</label>
              <p className="text-sm text-gray-500 mb-3">
                Required for AI lesson generation. The key is stored locally in your browser for security.
              </p>
              <div className="relative">
                <input
                  type="password"
                  className="w-full text-sm border-gray-200 rounded-lg shadow-sm border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400"
                  placeholder="Enter your Google Gemini API Key (starts with AIza...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={handleSave} 
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-bold transition-all duration-200 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <Save size={16} className="mr-2" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
