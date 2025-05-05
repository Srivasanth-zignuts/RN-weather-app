import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useWeatherQuery = (
	city: string,
	coords?: { lat: number; lon: number } | null
) => {
	return useQuery({
		queryKey: ['weather', city || `${coords?.lat},${coords?.lon}`],
		queryFn: async () => {
			let url = '';
			if (coords) {
				url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${coords.lat},${coords.lon}&days=7&aqi=no&alerts=no`;
			} else {
				url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;
			}
			const res = await axios.get(url);
			return res.data;
		},
		enabled: !!(city || coords),
	});
};
