/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import style from './Exchange.module.css';

export default function Exchange(): JSX.Element {
  const [amount, setAmount] = useState<number>(0);
  const [dateTime, setDateTime] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [wantedCurrency, setWantedCurrency] = useState<string>("EUR");
  const [conversionResult, setConversionResult] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);

  async function doExchange(): Promise<void> {
    try {
      setLoading(true);
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/30e7b4e8a850e51afd35d8a7/latest/${baseCurrency}`
      );
      const obj = await res.json();
      const { conversion_rates, time_last_update_utc } = obj;

      const wantedRate = conversion_rates[wantedCurrency];
      const result = (amount * wantedRate).toFixed(2);

      setConversionResult(parseFloat(result));
      setDateTime(time_last_update_utc);
      setError("");
      setHistory((prevHistory) => [
        `${amount} ${baseCurrency} = ${result} ${wantedCurrency} on ${time_last_update_utc}`,
        ...prevHistory,
      ]);
    } catch (error) {
      setError("Error fetching exchange rates. Please try again later.");
      console.error("Error fetching exchange rates:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={style.app}>
      <h1>
        Exchange from {baseCurrency} to {wantedCurrency}
      </h1>
      <label className={style.label} >
        Choose the base currency_
        <select className={style.select}
          
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="CHF">CHF</option>
          <option value="MDL">MDL</option>
        </select>
      </label>
      <label>
        <br />
        Choose the wanted currency_
        <select className={style.select}
          
          value={wantedCurrency}
          onChange={(e) => setWantedCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="JPY">JPY</option>
          <option value="GBP">GBP</option>
          <option value="AUD">AUD</option>
          <option value="CAD">CAD</option>
          <option value="CHF">CHF</option>
          <option value="MDL">MDL</option>
        </select>
      </label>
      <label  className={style.label}>
        <br />
        Amount:
        <input className={style.input}
          
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>

      <button className={style.button} onClick={doExchange} disabled={loading}>
        {loading ? "Loading..." : "Exchange"}
      </button>

      {error  && <p style={{ color: "red" }}>{error}</p>}
      {dateTime && <h3>Last update: {dateTime}</h3>}
      {conversionResult !== 0 && <h3>Conversion result: {conversionResult} {wantedCurrency}</h3>}

      <div className={style.history}>
        <h3 className={style.h3}>History:</h3>
        <ul className={style.ul}>
          {history.map((item, index) => (
            < li className={style.li} key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
