import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Save } from 'lucide-react';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setStatus('Settings saved successfully!');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header__title">Settings</h1>
      </div>

      <div className="card max-w-2xl">
        <div className="form__section mb-6">
          <label className="form__label">Gemini API Key</label>
          <div className="text-sm text-text-light mb-2">
            Required for AI lesson generation. Keys are stored locally in your browser.
          </div>
          <input
            type="password"
            className="form__input"
            placeholder="Enter your Google Gemini API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={handleSave} className="gap-2">
            <Save size={18} />
            Save Settings
          </Button>
          {status && <span className="text-green-600 font-bold animate-pulse">{status}</span>}
        </div>
      </div>
    </div>
  );
}
