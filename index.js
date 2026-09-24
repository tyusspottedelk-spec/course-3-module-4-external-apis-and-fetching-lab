// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

function fetchWeatherAlerts(state) {
	return fetch(`${weatherApi}${state}`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`API request failed: ${response.status}`)
			}

			return response.json()
		})
		.then(data => {
			console.log(data)
			return data
		})
		.catch(error => {
			console.log(error.message)
			throw error
		})
}

function displayAlerts(data) {
	const alertsDisplay = document.querySelector('#alerts-display')
	const features = Array.isArray(data.features) ? data.features : []

	alertsDisplay.replaceChildren()

	const summary = document.createElement('p')
	summary.textContent = `${data.title}: ${features.length}`
	alertsDisplay.append(summary)

	const alertList = document.createElement('ul')
	features.forEach(alert => {
		const listItem = document.createElement('li')
		listItem.textContent = alert.properties?.headline || 'Alert headline unavailable'
		alertList.append(listItem)
	})
	alertsDisplay.append(alertList)
}

function showError(message) {
	const errorMessage = document.querySelector('#error-message')
	errorMessage.textContent = message
	errorMessage.classList.remove('hidden')
}

function clearError() {
	const errorMessage = document.querySelector('#error-message')
	errorMessage.textContent = ''
	errorMessage.classList.add('hidden')
}

function initializeWeatherAlerts() {
	const stateInput = document.querySelector('#state-input')
	const fetchButton = document.querySelector('#fetch-alerts')
	const loadingSpinner = document.querySelector('#loading-spinner')

	fetchButton.addEventListener('click', () => {
		const state = stateInput.value.trim().toUpperCase()

		if (!/^[A-Z]{2}$/.test(state)) {
			showError('Enter a two-letter state abbreviation, such as MN.')
			return
		}

		stateInput.value = ''
		clearError()
		fetchButton.disabled = true
		loadingSpinner.classList.remove('hidden')

		fetchWeatherAlerts(state)
			.then(displayAlerts)
			.catch(error => showError(error.message))
			.finally(() => {
				fetchButton.disabled = false
				loadingSpinner.classList.add('hidden')
			})
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeWeatherAlerts)
} else {
	initializeWeatherAlerts()
}
