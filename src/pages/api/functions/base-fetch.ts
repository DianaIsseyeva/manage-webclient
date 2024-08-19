export const baseFetchAsync = async (
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: string | null,
  token?: string
): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:3001/`, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    console.error('Fetch error:', e);
    throw e;
  }
};
