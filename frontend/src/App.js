import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [revenue, setRevenue] = useState("");
  const [customers, setCustomers] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!revenue || !customers) return;
    setLoading(true);

    const res = await fetch("https://ai-backend-i1fs.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  revenue: Number(revenue),
  customers: Number(customers)
})
    });

    const data = await res.json();

    const rev = Number(revenue);
    const cust = Number(customers);

    let strategy = [];

    if (rev < 20000) {
      strategy = [
        "Social media acquisition campaigns",
        "Discount funnel optimization",
        "Customer retention automation"
      ];
    } else if (cust < 100) {
      strategy = [
        "Referral growth loops",
        "Influencer campaigns",
        "Conversion optimization"
      ];
    } else {
      strategy = [
        "Scale paid ads",
        "Upsell premium offers",
        "Market expansion strategy"
      ];
    }

    setResult({
      ...data,
      strategy,

      // ✅ FIXED GROWTH (MAX 100%)
      growth: rev
        ? Math.min(
            Math.round(((data.predicted_revenue - rev) / rev) * 100),
            100
          )
        : 0,

      conversion: Math.min(48, Math.round(cust / 4)),
      health:
        rev > 50000 ? "Strong" : rev > 25000 ? "Growing" : "Early Stage"
    });

    setLoading(false);
  };

  const metrics = result
    ? [
        { label: "Revenue Growth", value: result.growth + "%" },
        { label: "Conversion", value: result.conversion + "%" },
        { label: "Business Health", value: result.health },
        {
          label: "Customer Value",
          value:
            "₹" +
            Math.round(result.predicted_revenue / Number(customers || 1))
        }
      ]
    : [];

  return (
    <div style={styles.app}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>NEXORA</h2>

        <button style={styles.navBtn} onClick={() => setPage("dashboard")}>
          Dashboard
        </button>

        <button style={styles.navBtn} onClick={() => setPage("reports")}>
          Reports
        </button>

        <button style={styles.navBtn} onClick={() => setPage("analytics")}>
          Analytics
        </button>

        <div style={styles.sideCard}>
          <h4>Business Pro</h4>
          <p>AI Forecast Enabled</p>
          <p>Insights Active</p>
        </div>
      </div>

      <div style={styles.main}>
        {page === "dashboard" && (
          <>
            <div style={styles.topbar}>
              <div>
                <h1 style={styles.heading}>AI Business Intelligence</h1>
                <p style={styles.sub}>
                  Revenue forecasting and growth optimization
                </p>
              </div>

              <button style={styles.exportBtn}>Export Report</button>
            </div>

            <div style={styles.statsRow}>
              {[
                ["Revenue", result ? "₹" + result.predicted_revenue : "—"],
                ["Customers", customers || "—"],
                ["Growth", result ? result.growth + "%" : "—"],
                ["Market Index", result ? "87/100" : "—"]
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.03 }}
                  style={styles.kpiCard}
                >
                  <h4>{item[0]}</h4>
                  <h2>{item[1]}</h2>
                </motion.div>
              ))}
            </div>

            <div style={styles.grid}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.panel}
              >
                <h3>Forecast Engine</h3>

                <input
                  style={styles.input}
                  placeholder="Enter Revenue"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                />

                <input
                  style={styles.input}
                  placeholder="Enter Customers"
                  value={customers}
                  onChange={(e) => setCustomers(e.target.value)}
                />

                <button style={styles.primaryBtn} onClick={analyze}>
                  {loading ? "Analyzing..." : "Run Analysis"}
                </button>

                <div style={styles.progressWrap}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: result ? "82%" : "18%"
                    }}
                  ></div>
                </div>
              </motion.div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={styles.panel}
                >
                  <h3>Executive Insights</h3>

                  <div style={styles.insightBox}>
                    <h2>
                      Predicted Revenue ₹{result.predicted_revenue}
                    </h2>
                    <p>{result.insights[0]}</p>
                  </div>

                  <h4>Recommended Growth Actions</h4>

                  {result.strategy.map((item, i) => (
                    <div key={i} style={styles.strategyItem}>
                      <div style={styles.dot}></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {result && (
              <>
                <h2 style={{ marginTop: 40 }}>Performance Metrics</h2>

                <div style={styles.metricGrid}>
                  {metrics.map((m, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.03 }}
                      style={styles.metricCard}
                    >
                      <h4>{m.label}</h4>
                      <h2>{m.value}</h2>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {page === "reports" && (
          <>
            <h1 style={styles.heading}>Financial Reports</h1>

            <div style={styles.reportGrid}>
              <div style={styles.reportCard}>
                <h3>Revenue Projection</h3>
                <h1>
                  {result
                    ? "₹" + result.predicted_revenue
                    : "Run Analysis"}
                </h1>
              </div>

              <div style={styles.reportCard}>
                <h3>Growth Summary</h3>
                <p>
                  {result
                    ? `${result.growth}% projected upside`
                    : "Awaiting analysis"}
                </p>
              </div>

              <div style={styles.reportCard}>
                <h3>Capital Allocation</h3>
                <p>
                  40% Acquisition
                  <br />
                  35% Retention
                  <br />
                  25% Expansion
                </p>
              </div>
            </div>
          </>
        )}

        {page === "analytics" && (
          <>
            <h1 style={styles.heading}>Business Analytics</h1>

            <div style={styles.metricGrid}>
              <div style={styles.metricCard}>
                <h4>Demand</h4>
                <h2>{result ? "High" : "—"}</h2>
              </div>

              <div style={styles.metricCard}>
                <h4>Profit Trend</h4>
                <h2>{result ? "Upward" : "—"}</h2>
              </div>

              <div style={styles.metricCard}>
                <h4>Retention</h4>
                <h2>{result ? result.conversion + "%" : "—"}</h2>
              </div>

              <div style={styles.metricCard}>
                <h4>Risk</h4>
                <h2>{result ? "Low" : "—"}</h2>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    background: "#ffffff",
    minHeight: "100vh",
    color: "#111",
    fontFamily: "Arial"
  },

  sidebar: {
    width: "260px",
    background: "#fafafa",
    borderRight: "1px solid #ddd",
    padding: "35px 24px"
  },

  logo: {
    fontSize: "30px",
    marginBottom: "45px"
  },

  navBtn: {
    width: "100%",
    padding: "16px",
    marginBottom: "14px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "14px",
    fontWeight: "600"
  },

  sideCard: {
    marginTop: "55px",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "20px"
  },

  main: {
    flex: 1,
    padding: "50px 70px"
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  heading: {
    fontSize: "50px",
    fontWeight: "800"
  },

  sub: {
    color: "#555"
  },

  exportBtn: {
    background: "#111",
    color: "#fff",
    padding: "14px 24px",
    border: "none",
    borderRadius: "12px"
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    margin: "35px 0"
  },

  kpiCard: {
    background: "#fff",
    padding: "28px",
    borderRadius: "22px",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px"
  },

  panel: {
    background: "#fff",
    padding: "35px",
    borderRadius: "24px",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)"
  },

  input: {
    width: "100%",
    padding: "18px",
    marginTop: "18px",
    border: "1px solid #ddd",
    borderRadius: "14px"
  },

  primaryBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "18px",
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: "14px"
  },

  progressWrap: {
    height: "10px",
    background: "#eee",
    marginTop: "25px",
    borderRadius: "20px"
  },

  progressBar: {
    height: "100%",
    background: "#111",
    borderRadius: "20px"
  },

  insightBox: {
    background: "#f7f7f7",
    padding: "22px",
    borderRadius: "16px",
    marginBottom: "20px"
  },

  strategyItem: {
    display: "flex",
    gap: "12px",
    padding: "12px 0"
  },

  dot: {
    width: "10px",
    height: "10px",
    background: "#111",
    borderRadius: "50%"
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginTop: "20px"
  },

  metricCard: {
    background: "#fff",
    padding: "28px",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)"
  },

  reportGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "24px",
    marginTop: "35px"
  },

  reportCard: {
    background: "#fff",
    padding: "35px",
    borderRadius: "22px",
    boxShadow: "0 8px 30px rgba(0,0,0,.06)"
  }
};