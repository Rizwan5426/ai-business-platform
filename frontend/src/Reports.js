import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Reports() {

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue Trend",
        data: [20000, 35000, 30000, 50000, 65000],
        borderColor: "#38bdf8",
        tension: 0.4
      }
    ]
  };

  return (
    <div style={styles.container}>
      
      <h1 style={styles.title}>📊 SaaS Analytics</h1>

      {/* KPI CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>💰 Revenue</h3>
          <p>₹65,000</p>
        </div>

        <div style={styles.card}>
          <h3>👥 Users</h3>
          <p>1,250</p>
        </div>

        <div style={styles.card}>
          <h3>📈 Growth</h3>
          <p>+18%</p>
        </div>
      </div>

      {/* CHART */}
      <div style={styles.chart}>
        <Line data={data} />
      </div>

    </div>
  );
}

const styles = {
  container: {
    color: "white"
  },
  title: {
    marginBottom: "20px"
  },
  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px"
  },
  card: {
    flex: 1,
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "12px",
    transition: "0.3s",
    cursor: "pointer"
  },
  chart: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px"
  }
};

export default Reports;