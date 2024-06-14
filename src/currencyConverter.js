import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [exchangeRate, setExchangeRate] = useState();

    useEffect(() => {
        axios.get('https://api.exchangerate-api.com/v4/latest/USD')
            .then(response => {
                const firstCurrency = Object.keys(response.data.rates)[0];
                setCurrencies([response.data.base, ...Object.keys(response.data.rates)]);
                setFromCurrency(response.data.base);
                setToCurrency(firstCurrency);
                setExchangeRate(response.data.rates[firstCurrency]);
            })
            .catch(error => console.error('Error fetching data: ', error));
    }, []);

    useEffect(() => {
        if (fromCurrency != null && toCurrency != null) {
            axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
                .then(response => {
                    setExchangeRate(response.data.rates[toCurrency]);
                })
                .catch(error => console.error('Error fetching data: ', error));
        }
    }, [fromCurrency, toCurrency]);

    function handleAmountChange(e) {
        setAmount(e.target.value);
    }

    

    return (
        <div>
            <h1>Currency Converter</h1>
            <input type="number" value={amount} onChange={handleAmountChange} />
            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>
            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                {currencies.map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                ))}
            </select>
            <h2>Converted Amount: {(amount * (exchangeRate || 0)).toFixed(4)}</h2>
        </div>
    );
};

export default CurrencyConverter;
