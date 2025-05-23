"use client"

// LighthouseReport.tsx
import { useState, useEffect } from 'react';
import RankPilot from './svg/RankPilot.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LighthouseData {
  reportJson: {
    categories: Record<string, {
      id: string;
      title: string;
      score: number;
      description: string;
    }>;
    audits: Record<string, {
      id: string;
      title: string;
      description: string;
      score: number | null;
      displayValue?: string;
      details?: any;
    }>;
  };
  reportHtml?: string;
}

export default function LighthouseReport() {
  const [url, setUrl] = useState('https://example.com');
  const [data, setData] = useState<LighthouseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'audits'>('summary');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const runAudit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://lighthouse-297g.onrender.com/api/lighthouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Audit failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderScore = (score: number | null) => {
    if (score === null) return <span className="score na">N/A</span>;

    const percentage = Math.round((score || 0) * 100);
    const scoreClass = score >= 0.9 ? 'good' : score >= 0.5 ? 'average' : 'poor';

    return (
      <span className={`score ${scoreClass}`}>
        {percentage}
      </span>
    );
  };

  const renderCategoryDetails = (categoryId: string) => {
    if (!data?.reportJson.categories[categoryId]) return null;
    const category = data.reportJson.categories[categoryId];

    return (
      <div className="category-details">
        <h3>{category.title}</h3>
        <p>{category.description}</p>
        <div className="score-display">
          Score: {renderScore(category.score)}
        </div>
      </div>
    );
  };

  const renderAuditDetails = (auditId: string) => {
    if (!data?.reportJson.audits[auditId]) return null;
    const audit = data.reportJson.audits[auditId];

    return (
      <div className="audit-details">
        <h4>{audit.title}</h4>
        <p>{audit.description}</p>
        <div className="audit-meta">
          <span>Score: {renderScore(audit.score)}</span>
          {audit.displayValue && <span>Value: {audit.displayValue}</span>}
        </div>
        {audit.details && (
          <details>
            <summary>Technical Details</summary>
            <pre>{JSON.stringify(audit.details, null, 2)}</pre>
          </details>
        )}
      </div>
    );
  };

 if (loading) {
        return (
          <div className="flex flex-col items-center justify-center h-screen">
            <DotLottieReact
              src="https://lottie.host/db692c44-1bf1-49dc-bf24-765ad7164838/S7oJjhDRIy.lottie"
              loop
              autoplay
              style={{ width: '200px', height: '200px' }}
            />
            <p className="mt-4 text-lg">Running Lighthouse audit...</p>
          </div>
        );
      }

  return (
    <div className="lighthouse-container">
   <>
        <nav className='flex justify-between w-dvw px-2'>
          <RankPilot />
        </nav>
        <div className="controls pt-5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to audit"
            className='rounded-lg'
          />
          <button onClick={runAudit} disabled={loading}>
            {loading ? 'Running...' : 'Run Audit'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {data && (
          <div className="report-container">
            <div className="tabs">
              <button
                className={activeTab === 'summary' ? 'active' : ''}
                onClick={() => setActiveTab('summary')}
              >
                Summary
              </button>
              <button
                className={activeTab === 'audits' ? 'active' : ''}
                onClick={() => setActiveTab('audits')}
              >
                Detailed Audits
              </button>
            </div>

            {activeTab === 'summary' && (
              <div className="summary-view">
                <h2 className='text-2xl pb-5'>Performance Summary</h2>
                <div className="categories-grid">
                  {data.reportJson.categories && Object.entries(data.reportJson.categories).map(([id, category]) => (
                    <div
                      key={id}
                      className={`category-card ${activeCategory === id ? 'active' : ''} rounded-2xl transform hover:-translate-y-1.5`}
                      onClick={() => setActiveCategory(id)}
                    >
                      <h3>{category.title}</h3>
                      {renderScore(category.score)}
                    </div>
                  ))}
                </div>

                {activeCategory && renderCategoryDetails(activeCategory)}
              </div>
            )}

            {activeTab === 'audits' && (
              <div className="audits-view">
                <h2 className='text-2xl pb-5'>Detailed Audits</h2>
                <div className="audits-list">
                  {data.reportJson.audits && Object.entries(data.reportJson.audits).map(([id, audit]) => (
                    <div key={id} className="audit-item rounded-lg">
                      {renderAuditDetails(id)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.reportHtml && (
              <details className="html-report">
                <summary>View Full HTML Report</summary>
                <iframe
                  srcDoc={data.reportHtml}
                  title="Lighthouse HTML Report"
                  width="100%"
                  height="600px"
                />
              </details>
            )}
          </div>
        )}
      </>


      <style>{`
        .lighthouse-container {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .controls {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        input {
          flex: 1;
          padding: 8px;
          font-size: 16px;
          border:1px solid #80ed99;
        }

        button {
          padding: 8px 16px;
          background: #80ed99;
          color: black;
          border: none;
          cursor: pointer;
          border-radius : 10px;
          transition:all ease 0.5s;
        }

        button:disabled {
          background: #ccc;
        }
        button:hover{
        transform:translateY(-5px) scaleX(1.05);
        transition:all ease 0.5s;
        }
        .error {
          color: #d13438;
          padding: 10px;
          background: #fde7e9;
          margin: 10px 0;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #80ed99;
        }

        .tabs button {
          background: none;
          color: #fff;
          border: none;
          border-bottom: 3px solid transparent;
          border-radius: 0;
        }

        .tabs button.active {
          border-bottom-color: #80ed99;
          color: #80ed99;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .category-card {
          border: 1px solid #ddd;
          padding: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-card:hover, .category-card.active {
          border-color: #80ed99;
          box-shadow: 0 2px 50px #80ed99;
        }

        .category-card h3 {
          margin-top: 0;
        }

        .score {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
        }

        .score.good {
          background: #d4edda;
          color: #155724;
        }

        .score.average {
          background: #fff3cd;
          color: #856404;
        }

        .score.poor {
          background: #f8d7da;
          color: #721c24;
        }

        .score.na {
          background: #e2e3e5;
          color: #383d41;
        }

        .audit-item {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #eee;
        }

        .audit-meta {
          display: flex;
          gap: 15px;
          margin: 10px 0;
        }

        details pre {
          background: #f5f5f5;
          padding: 10px;
          overflow-x: auto;
        }

        .html-report {
          margin-top: 30px;
        }

        .html-report iframe {
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}
