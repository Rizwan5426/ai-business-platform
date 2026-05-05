import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function Dashboard() {
  const [revenue, setRevenue] = useState("");
  const [customers, setCustomers] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ revenue, customers })
    });

    const data = await res.json();
    setResult(data);
  };

  // ✅ FIXED GROWTH (MAX 100%)
  const growth = result && revenue
    ? Math.min(
        Math.round(((result.predicted_revenue - Number(revenue)) / Number(revenue)) * 100),
        100
      )
    : 0;

  const chartData = {
    labels: ["Revenue", "Predicted"],
    datasets: [
      {
        label: "Growth",
        data: result ? [Number(revenue), result.predicted_revenue] : [0, 0],
        backgroundColor: ["#6366f1", "#22c55e"]
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>AI Business Dashboard</h1>

      {/* INPUT CARD */}
      <div style={styles.glassCard}>
        <input
          style={styles.input}
          placeholder="Enter Revenue"
          onChange={(e) => setRevenue(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Enter Customers"
          onChange={(e) => setCustomers(e.target.value)}
        />

        <button style={styles.button} onClick={analyze}>
          Analyze
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={styles.resultGrid}>
          
          <div style={styles.glassCard}>
            <h2>₹{result.predicted_revenue}</h2>
            <p>Predicted Revenue</p>
          </div>

          {/* ✅ NEW GROWTH CARD */}
          <div style={styles.glassCard}>
            <h2 style={{ color: growth >= 0 ? "#22c55e" : "#ef4444" }}>
              {growth}%
            </h2>
            <p>Growth</p>
          </div>

          <div style={styles.glassCard}>
            <h3>Insights</h3>
            {result.insights.map((i, idx) => (
              <p key={idx}>• {i}</p>
            ))}
          </div>

          <div style={styles.glassCard}>
            <h3>Marketing</h3>
            {result.marketing.map((m, idx) => (
              <p key={idx}>• {m}</p>
            ))}
          </div>

          <div style={styles.chartBox}>
            <Bar data={chartData} />
          </div>

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "white"
  },
  title: {
    marginBottom: "20px"
  },
  glassCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    transition: "0.3s"
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(45deg,#6366f1,#22c55e)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px"
  },
  chartBox: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px"
  }
};

export default Dashboard;