import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
ChartJS.register(ArcElement, Tooltip);

function getColor(score) {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export function HealthGauge({ score, size = 160 }) {
  const color = getColor(score);
  const rem = 100 - score;

  const data = {
    datasets: [{
      data: [score, rem],
      backgroundColor: [color, 'rgba(255,255,255,0.06)'],
      borderColor: ['transparent', 'transparent'],
      borderWidth: 0,
      circumference: 270,
      rotation: -135,
    }],
  };

  const options = {
    cutout: '78%',
    plugins: { tooltip: { enabled: false } },
    animation: { animateRotate: true, duration: 1200 },
    responsive: false,
  };

  return (
    <div className="gauge-wrap">
      <div style={{ position: 'relative', width: size, height: size }}>
        <Doughnut data={data} options={options} width={size} height={size} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="gauge-number" style={{ color }}>{score}</span>
          <span className="gauge-label">/ 100</span>
        </div>
      </div>
      <div style={{
        fontSize: '0.8rem', fontWeight: 700, padding: '4px 14px',
        borderRadius: '99px',
        background: score >= 75 ? 'rgba(34,197,94,0.14)' : score >= 50 ? 'rgba(245,158,11,0.14)' : 'rgba(239,68,68,0.14)',
        color,
      }}>
        {score >= 75 ? 'Excellent' : score >= 50 ? 'Moderate' : 'Poor'}
      </div>
    </div>
  );
}

export function ScoreBar({ label, value, color }) {
  return (
    <div className="breakdown-row">
      <div className="breakdown-label-row">
        <span className="breakdown-label">{label}</span>
        <span className="breakdown-value">{value}</span>
      </div>
      <div className="breakdown-track">
        <div
          className="breakdown-fill"
          style={{ width: `${value}%`, background: color || getColor(value) }}
        />
      </div>
    </div>
  );
}
