
'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_BASE = "https://sharkfin-2mrg.onrender.com";

const MarketInsightApp = () => {
  const [insights, setInsights] = useState([]);
  const [customHeadline, setCustomHeadline] = useState("");
  const [customResult, setCustomResult] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/news-insights`)
      .then((res) => res.json())
      .then((data) => {
        setInsights(data.insights);
        setHistory(data.insights);
      });
  }, []);

  const handleAnalyze = async () => {
    const res = await fetch(`${API_BASE}/analyze-headline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline: customHeadline }),
    });
    const data = await res.json();
    setCustomResult(data);
    setHistory((prev) => [data, ...prev]);
  };

  const generateChartData = () => {
    const labels = history.map((item, i) => `#${history.length - i}`);
    return {
      labels,
      datasets: [
        {
          label: "Confidence (%)",
          data: history.map((item) => item.confidence * 100),
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          tension: 0.3,
        },
      ],
    };
  };

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-10">
      <header className="text-center">
        <h1 className="text-4xl font-bold">🌍 Market Insight AI</h1>
        <p className="text-lg text-gray-600 mt-2">AI-powered analysis of global events & market predictions</p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-3">🔍 Analyze a Custom Headline</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            className="flex-1 border p-2 rounded shadow"
            value={customHeadline}
            onChange={(e) => setCustomHeadline(e.target.value)}
            placeholder="Type or paste a political/world event headline..."
          />
          <button
            onClick={handleAnalyze}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Analyze
          </button>
        </div>
        {customResult && (
          <div className="mt-4 border p-4 rounded shadow bg-white space-y-2">
            <p><strong>Headline:</strong> {customResult.headline}</p>
            <p><strong>Sentiment:</strong> {customResult.sentiment} ({(customResult.confidence * 100).toFixed(2)}%)</p>
            <p><strong>Linked Asset:</strong> {customResult.linked_asset}</p>
            <p><strong>Latest Price:</strong> ${customResult.latest_price?.toFixed(2)}</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">📈 Confidence Trend (Last Headlines)</h2>
        <div className="bg-white p-4 rounded-xl shadow">
          <Line data={generateChartData()} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">📡 AI Market Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((item, idx) => (
            <motion.div key={idx} whileHover={{ scale: 1.02 }}>
              <div className="p-4 bg-white rounded shadow space-y-1">
                <p><strong>Headline:</strong> {item.headline}</p>
                <p><strong>Sentiment:</strong> {item.sentiment} ({(item.confidence * 100).toFixed(2)}%)</p>
                <p><strong>Linked Asset:</strong> {item.linked_asset}</p>
                <p><strong>Latest Price:</strong> ${item.latest_price?.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default dynamic(() => Promise.resolve(MarketInsightApp), { ssr: false });
