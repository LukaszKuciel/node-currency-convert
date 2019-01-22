const axios = require('axios');

const getExchangeRate = async(from, to) => {
    try{
        const currencies = await axios.get('http://data.fixer.io/api/latest?access_key=9d75226d7dbb71265815f82ba4708445');
        const euro = 1 / currencies.data.rates[from];
        const rate = euro * currencies.data.rates[to];
        if(isNaN(rate)){
            throw new Error();
        }
        return rate;
    }catch(e){
        throw new Error(`Failed to get exchange rate for ${from} and ${to}.`);
    }
}

const getCountries = async(currency) => {
    try{
        const countries = await axios.get(`https://restcountries.eu/rest/v2/currency/${currency}`);
        return countries.data.map(country => country.name);
    }catch(e){
        throw new Error(`Failed to get countries that uses ${currency} currency.`);
    }
}


const convertCurrency = async(from, to, amount) => {
    const rate = await getExchangeRate(from, to);
    const countries = await getCountries(to);
    const convertedAmount = (amount * rate).toFixed(2);
    return `${amount}${from} is worth ${convertedAmount}${to}. You can spend these in the following countries: ${countries.join(", ")}.`;
}

convertCurrency('USD', 'EUR', 20)
    .then(rate => console.log(rate))
    .catch(err => console.log(err));