const url = 'https://quantified-self-api-ad.herokuapp.com/'

const handleResponse = (response) => {
  return response.json()
  .then(json => {
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
      }
      return Promise.reject(error);
    }
    return json
  })
}

module.exports = { handleResponse, url }
