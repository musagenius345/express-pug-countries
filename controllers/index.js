class CountriesModel {
  constructor() {
    this.apiUrl = 'https://restcountries.com/v3.1/all'; // Replace with the actual API endpoint
    this.countries = [];
  }

  async fetchCountries() {
    try {
      const response = await fetch(this.apiUrl);

      if (!response.ok) {
        throw new Error('Failed to fetch country data');
      }

      const data = await response.json();
      this.countries = data;
      // Notify observers (e.g., controllers or views) that data has been updated.
      this.notifyObservers();
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  // You can add more methods here to manipulate the country data if needed.
  
  // Method to register observers (e.g., controllers or views).
  addObserver(observer) {
    this.observers.push(observer);
  }

  // Method to notify observers when data changes.
  notifyObservers() {
    for (const observer of this.observers) {
      observer.update(this.countries);
    }
  }
}

// Usage example:
const countriesModel = new CountriesModel();

// To fetch countries data and notify observers:
countriesModel.fetchCountries();

// You can add observers (controllers or views) to the model to react to data changes.
