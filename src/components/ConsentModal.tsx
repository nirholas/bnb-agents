/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Legal protection for open source projects 🛡️
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  FileText, 
  Lock, 
  CheckCircle,
  ExternalLink,
  Scroll
} from 'lucide-react';

const CONSENT_KEY = 'lyra_terms_accepted';
const CONSENT_VERSION = '1.0.0'; // Increment this to require re-acceptance

interface ConsentModalProps {
  onAccept: () => void;
}

export function useConsent() {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return false;
    try {
      const parsed = JSON.parse(stored);
      return parsed.version === CONSENT_VERSION && parsed.accepted === true;
    } catch {
      return false;
    }
  });

  const acceptTerms = () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({
      accepted: true,
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString()
    }));
    setHasConsented(true);
  };

  return { hasConsented, acceptTerms };
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  const [checkedTerms, setCheckedTerms] = useState(false);
  const [checkedRisks, setCheckedRisks] = useState(false);
  const [checkedNoLiability, setCheckedNoLiability] = useState(false);
  const [checkedEducational, setCheckedEducational] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const allChecked = checkedTerms && checkedRisks && checkedNoLiability && checkedEducational && scrolledToBottom;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Terms of Use & Disclaimer</h2>
          </div>
          <p className="text-white/90 text-sm">
            Please read and accept before using Lyra Web3 Playground
          </p>
        </div>

        {/* Scrollable Content */}
        <div 
          className="p-6 max-h-[45vh] overflow-y-auto"
          onScroll={handleScroll}
        >
          <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                    Important Notice
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300">
                    This is an experimental, open-source educational project provided completely 
                    free of charge. It is a hobby project with no commercial purpose, warranties, 
                    or guarantees of any kind.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer Section */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Scroll className="w-4 h-4" />
                Disclaimer & Limitation of Liability
              </h3>
              <div className="space-y-3 pl-6">
                <p>
                  <strong>1. AS-IS SOFTWARE:</strong> Lyra Web3 Playground is provided "AS IS" and 
                  "AS AVAILABLE" without any warranties of any kind, either express or implied, 
                  including but not limited to implied warranties of merchantability, fitness for 
                  a particular purpose, and non-infringement.
                </p>
                <p>
                  <strong>2. NO FINANCIAL ADVICE:</strong> Nothing on this platform constitutes 
                  financial, investment, legal, or tax advice. Smart contracts and blockchain 
                  technology involve significant risks. Always do your own research and consult 
                  qualified professionals.
                </p>
                <p>
                  <strong>3. EDUCATIONAL PURPOSE ONLY:</strong> All code, examples, tutorials, and 
                  templates are provided solely for educational purposes. They are NOT audited, 
                  NOT production-ready, and should NOT be used in production without thorough 
                  independent security review.
                </p>
                <p>
                  <strong>4. NO LIABILITY:</strong> Under no circumstances shall the creators, 
                  contributors, or maintainers of this project be liable for any direct, indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited 
                  to loss of profits, data, cryptocurrency, digital assets, or other intangible losses.
                </p>
                <p>
                  <strong>5. USER RESPONSIBILITY:</strong> You acknowledge that blockchain 
                  transactions are irreversible. You are solely responsible for any smart contracts 
                  you deploy, any transactions you make, and any losses you may incur.
                </p>
                <p>
                  <strong>6. CODE SECURITY:</strong> The code provided may contain bugs, 
                  vulnerabilities, or errors. AI-generated code is not verified for security. 
                  You assume all risks associated with using any code from this platform.
                </p>
                <p>
                  <strong>7. THIRD-PARTY SERVICES:</strong> This platform interacts with third-party 
                  services including blockchain networks, wallet providers, and APIs. We have no 
                  control over these services and are not responsible for their availability, 
                  security, or functionality.
                </p>
                <p>
                  <strong>8. INDEMNIFICATION:</strong> You agree to indemnify and hold harmless 
                  the project creators and contributors from any claims, damages, or expenses 
                  arising from your use of this platform.
                </p>
              </div>
            </div>

            {/* Privacy Notice */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Privacy Summary
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>We do not collect personal information beyond basic analytics</li>
                <li>We NEVER ask for or store your private keys or seed phrases</li>
                <li>Your code is stored locally in your browser</li>
                <li>Wallet connections are handled by your wallet provider</li>
              </ul>
            </div>

            {/* Links to Full Policies */}
            <div className="flex gap-4 pt-2">
              <Link 
                to="/terms" 
                target="_blank"
                className="inline-flex items-center gap-1 text-primary-600 hover:underline text-sm"
              >
                <FileText className="w-4 h-4" />
                Full Terms of Service
                <ExternalLink className="w-3 h-3" />
              </Link>
              <Link 
                to="/privacy"
                target="_blank" 
                className="inline-flex items-center gap-1 text-primary-600 hover:underline text-sm"
              >
                <Shield className="w-4 h-4" />
                Privacy Policy
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {!scrolledToBottom && (
            <div className="text-center text-xs text-gray-500 mt-4 animate-bounce">
              ↓ Please scroll to read all terms ↓
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-3 bg-gray-50 dark:bg-gray-800/50">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedTerms}
              onChange={(e) => setCheckedTerms(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedEducational}
              onChange={(e) => setCheckedEducational(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              I understand this is an <strong>educational project</strong> and all code is for <strong>learning purposes only</strong>
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedRisks}
              onChange={(e) => setCheckedRisks(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              I acknowledge the <strong>risks of blockchain technology</strong> and that code may contain bugs or vulnerabilities
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checkedNoLiability}
              onChange={(e) => setCheckedNoLiability(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              I agree that <strong>creators are not liable</strong> for any losses, damages, or issues arising from use of this platform
            </span>
          </label>
        </div>

        {/* Accept Button */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAccept}
            disabled={!allChecked}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              allChecked
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {allChecked ? (
              <>
                <CheckCircle className="w-5 h-5" />
                I Accept - Enter Playground
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                Please read and check all boxes above
              </>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">
            By clicking accept, you confirm you are at least 18 years old or have parental consent
          </p>
        </div>
      </div>
    </div>
  );
}
