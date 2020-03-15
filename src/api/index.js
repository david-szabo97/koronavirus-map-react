const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

export const fetchData = async () => {
  const response = await window.fetch(`${BASE_URL}/covid-19-data`)
  const responseJson = await response.json()

  return responseJson
}
