const api_key = '638d7a7f237e27a868d41f69'
const url = 'https://v6.exchangerate-api.com/v6/638d7a7f237e27a868d41f69/latest/USD'

document.addEventListener('DOMContentLoaded', () => {
    const cur_sel1 = document.getElementById('cur_sel');
    const cur_sel2 = document.getElementById('cur_sel2');
    const btn= document.getElementById('btn'); 
    const top_input = document.getElementById('top_input');
    const bottom_input = document.getElementById('bottom_input'); 
    bottom_input.disabled = true;
    const rate = document.getElementById("rate")

    const allowedCurrencies = ['USD', 'EUR', 'UAH', 'PLN', 'CHF', 'CZK', 'GBP'];
    const currencyNames = {
      USD: "United States Dollar",
      EUR: "Euro",
      UAH: "Ukrainian Hryvnia",
      PLN: "Polish Zloty",
      CHF: "Swiss Franc",
      CZK: "Czech Koruna",
      GBP: "British Pound Sterling"
    };

    function exchanging(amount, fromCurrency, toCurrency, rates) {
      if (!amount || !fromCurrency || !toCurrency || !rates[fromCurrency] || !rates[toCurrency]) {
          console.error("Invalid data for currency exchange");
          return null;
      }
      const amountInBaseCurrency = amount / rates[fromCurrency];
      const result = amountInBaseCurrency * rates[toCurrency];
      return result.toFixed(2);
    }

    function populateSelect(selectElement, rates) {
      Object.keys(rates)
      .filter(currency => allowedCurrencies.includes(currency))
      .forEach(currency => {
        const option = document.createElement('option');
        option.value = currency; 
        option.textContent = currency; 
        selectElement.appendChild(option);
      });
    }

    function showCur(textId, select) {
      const top_text = document.getElementById(textId);
      if (!select || !top_text) return;
      select.addEventListener('change', () => {
        const selectedValue = select.value;
        top_text.textContent = `${currencyNames[selectedValue] || selectedValue}`;
      });
    }

    function updateCur(textId, select) {
      const top_text = document.getElementById(textId);
      if (!select || !top_text) return;
      const selectedValue = select.value;
      top_text.textContent = `${currencyNames[selectedValue] || selectedValue}`;
    }

    function exchangeRate(val1, val2, rates){
      const start_val = 1/rates[val1.value]
      const result = start_val * rates[val2.value];
      rate.textContent = `1 ${val1.value} = ${result.toFixed(2)} ${val2.value}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const rates = data.conversion_rates;

        populateSelect(cur_sel1, rates);
        populateSelect(cur_sel2, rates);

        showCur('top-name', cur_sel1);
        showCur('low-name', cur_sel2);

        function updateConversion() {
          const amount = parseFloat(top_input.value); 
          if (!isNaN(amount)) {
            const fromCurrency = cur_sel1.value; 
            const toCurrency = cur_sel2.value;
            const exchangedAmount = exchanging(amount, fromCurrency, toCurrency, rates);
            bottom_input.value = exchangedAmount || '';
          } else {
            bottom_input.value = '';
          }
          exchangeRate(cur_sel1, cur_sel2, rates)
        }

        top_input.addEventListener('input', updateConversion);

        cur_sel1.addEventListener('change', updateConversion);
        cur_sel2.addEventListener('change', updateConversion);

        btn.addEventListener('click', () => {
          let mid_val = cur_sel1.value;
          let mid_input_value = top_input.value;
          cur_sel1.value = cur_sel2.value;
          top_input.value = bottom_input.value;
          cur_sel2.value = mid_val;
          bottom_input.value = mid_input_value;

          updateCur('top-name', cur_sel1);
          updateCur('low-name', cur_sel2);

          updateConversion();
        });
      })
      .catch(error => console.error('Error:', error));
  });


