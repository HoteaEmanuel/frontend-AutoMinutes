const AiScanningLoader = () => (
  <div className="ai-scan-loader" role="status" aria-label="Analyzing transcript">
    <div className="ai-scan-mini">
      <div className="ai-scan-bars">
        <span className="ai-scan-bar ai-scan-bar-1" />
        <span className="ai-scan-bar ai-scan-bar-2" />
        <span className="ai-scan-bar ai-scan-bar-3" />
      </div>
      <svg
        className="ai-scan-icon"
        viewBox="0 0 101 114"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          strokeWidth={10}
          transform="rotate(36.0692 46.1726 46.1727)"
          r={29.5497}
          cy={46.1727}
          cx={46.1726}
        />
        <line strokeWidth={10} y2={111.784} x2={97.7088} y1={67.7837} x1={61.7089} />
      </svg>
    </div>
  </div>
);

export default AiScanningLoader;
