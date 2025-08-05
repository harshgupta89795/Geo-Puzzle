export const getRandomCapital = async () => {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,capitalInfo');
    const countries: any[] = await res.json();

    if (!Array.isArray(countries)) {
      throw new Error('Invalid API response');
    }

    const valid = countries.filter(
      (c: any) => Array.isArray(c.capital) && c.capital.length > 0 && c.capitalInfo?.latlng
    );

    const rand = valid[Math.floor(Math.random() * valid.length)];

    return {
      country: rand.name.common,
      capital: rand.capital[0],
      lat: rand.capitalInfo.latlng[0],
      lng: rand.capitalInfo.latlng[1],
    };
  } catch (e) {
    console.error('API error:', e);
    return null;
  }
};