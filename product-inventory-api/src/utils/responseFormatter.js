const formatResponse = (success, message, statusCode, data = null) => {
  const response = {
    success,
    message,
    statusCode
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

export default formatResponse;