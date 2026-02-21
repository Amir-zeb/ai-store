"use client";
import { useState } from "react";
import { products as allProducts } from "@/lib/products";

export default function StorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(allProducts); // show all by default
  const [filters, setFilters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(e: any) {
    e.preventDefault();
    if (!query.trim()) {
      setResults(allProducts);
      setFilters(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResults(data.products);
      setFilters(data.filters);
    } catch (err) {
      setError("Search failed. Please try again." as any);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setQuery("");
    setResults(allProducts);
    setFilters(null);
    setError(null);
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        🛍️ AI-Powered Store
      </h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Search in plain English — try "red shoes under $50" or "black jeans from Zara"
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try: "cheap red shoes" or "high rated dresses"'
          style={{
            flex: 1, padding: "0.75rem 1rem", fontSize: "1rem",
            border: "2px solid #ddd", borderRadius: "8px", outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 1.5rem", background: "#0070f3", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem",
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {filters && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "0.75rem 1rem", background: "#eee",
              border: "none", borderRadius: "8px", cursor: "pointer",
            }}
          >
            Reset
          </button>
        )}
      </form>

      {/* Show what AI understood */}
      {filters && (
        <div style={{
          background: "#f0f7ff", border: "1px solid #bde", borderRadius: "8px",
          padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.9rem"
        }}>
          🤖 <strong>AI understood:</strong>{" "}
          {Object.entries(filters)
            .filter(([, v]) => v !== null)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ") || "No filters applied"}
          {" "}— <strong>{results.length} product(s) found</strong>
        </div>
      )}

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      {/* Product Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1.5rem",
      }}>
        {results.length === 0 ? (
          <p style={{ color: "#999", gridColumn: "1/-1" }}>No products found. Try a different search.</p>
        ) : (
          results.map((product) => (
            <div key={product.id} style={{
              border: "1px solid #eee", borderRadius: "12px", padding: "1.25rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)", background: "white",
            }}>
              <div style={{
                height: 120, background: "#f5f5f5", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.5rem", marginBottom: "1rem"
              }}>
                {product.category === "shoes" ? "👟" : product.category === "dress" ? "👗" : product.category === "jeans" ? "👖" : "👕"}
              </div>
              <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem" }}>{product.name}</h3>
              <p style={{ color: "#888", fontSize: "0.85rem", margin: "0 0 0.5rem" }}>
                {product.brand} · {product.color}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", color: "#0070f3" }}>${product.price}</span>
                <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>⭐ {product.rating}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}