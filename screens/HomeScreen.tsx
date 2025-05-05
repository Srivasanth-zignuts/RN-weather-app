import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	FlatList,
	SafeAreaView,
	ActivityIndicator,
	Platform,
} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import { useWeatherQuery } from '../hooks/useWeatherQuery';

export default function HomeScreen() {
	const [query, setQuery] = useState('');
	const [city, setCity] = useState('');
	const [suggestions, setSuggestions] = useState<any[]>([]);
	const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
		null
	);
	const [initialCity, setInitialCity] = useState<string>('');

	const isUsingCoords = !city && coords;
	const { data, isLoading } = useWeatherQuery(city, coords ?? undefined);

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				// setInitialCity('London')
				console.warn('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setCoords({
				lat: location.coords.latitude,
				lon: location.coords.longitude,
			});

			const res = await axios.get(
				`https://api.weatherapi.com/v1/search.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${location.coords.latitude},${location.coords.longitude}`
			);
			if (res.data?.length > 0) {
				setInitialCity(res.data[0].name);
			}
		})();
	}, []);

	const handleInputChange = async (text: string) => {
		setQuery(text);
		if (!text) return setSuggestions([]);
		const res = await axios.get(
			`https://api.weatherapi.com/v1/search.json?key=${process.env.EXPO_PUBLIC_WEATHER_API_KEY}&q=${text}`
		);
		setSuggestions(res.data);
	};

	const handleSearch = () => {
		setCity(query);
		setCoords(null);
		setSuggestions([]);
	};

	const handleSelectSuggestion = (selected: string) => {
		setQuery(selected);
		setCity(selected);
		setCoords(null);
		setSuggestions([]);
	};

	const getIcon = (condition: string) => {
		const lower = condition.toLowerCase();
		if (lower.includes('rain'))
			return require('../assets/images/moderaterain.png');
		if (lower.includes('cloud'))
			return require('../assets/images/partlycloudy.png');
		if (lower.includes('sun')) return require('../assets/images/sun.png');
		if (lower.includes('mist')) return require('../assets/images/mist.png');
		return require('../assets/images/cloud.png');
	};

	const getDate = (localtime: string) => {
		const [datePart] = localtime.split(' ');

		const [year, month, day] = datePart.split('-');
		const formattedDate = `${day}/${month}/${year}`;

		return formattedDate;
	};

	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/images/bg.png')}
				style={styles.bg}
				blurRadius={40}
				resizeMode='cover'
			/>
			<SafeAreaView style={styles.safe}>
				<SearchBar
					value={query}
					onChangeText={handleInputChange}
					onSearch={handleSearch}
					suggestions={suggestions}
					onSelectSuggestion={handleSelectSuggestion}
				/>

				{isLoading || !data ? (
					<View style={styles.loader}>
						<ActivityIndicator
							size='large'
							color='#ffffff'
						/>
						<Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
					</View>
				) : (
					<View style={styles.weatherContainer}>
						<Text style={styles.cityName}>{data.location.name}</Text>
						<Text style={styles.temp}>{data.current.temp_c}°C</Text>
						<Text style={styles.date}>{getDate(data.location.localtime)}</Text>
						<View style={styles.weatherForecast}>
							<Text style={styles.foreCastInner}>
								Feels like{' '}
								<Text style={styles.spanElement}>
									{data.current.feelslike_c}°C
								</Text>
							</Text>
							<Text style={styles.foreCastInner}>
								{/* <SimpleLineIcons
									name='drop'
									color='#fff'
									size={15}
									style={{ marginRight: 5 }}
								/> */}
								Humidity{' '}
								<Text style={styles.spanElement}>
									{data.current.humidity}%{' '}
								</Text>
							</Text>
							<Text style={styles.foreCastInner}>
								Wind{' '}
								<Text style={styles.spanElement}>
									{data.current.wind_kph} km/h
								</Text>
							</Text>
							<Text style={styles.foreCastInner}>
								Visibility{' '}
								<Text style={styles.spanElement}>{data.current.vis_km} km</Text>
							</Text>
						</View>
						<FlatList
							style={styles.flatList}
							horizontal
							data={data.forecast.forecastday}
							keyExtractor={(item) => item.date}
							renderItem={({ item, index }) => (
								<View style={styles.dayBox}>
									<Text style={styles.dayText}>
										{index === 0
											? 'Tomorrow'
											: index === 1
											? 'Day after tomorrow'
											: getDate(item.date)}
									</Text>
									<Image
										source={getIcon(item.day.condition.text)}
										style={styles.icon}
									/>
									{/* <Image
										source={item.day.condition.icon}
										style={styles.icon}
									/> */}
									<Text style={styles.dayText}>
										{item.day.avgtemp_c}°C / {item.day.condition.text}
									</Text>
									<View style={styles.LisitingForcast}>
										<Text style={styles.lisitingInner}>
											Feels like{' '}
											<Text style={styles.spanElement}>
												{data.current.feelslike_c}°C
											</Text>
										</Text>
										<Text style={styles.lisitingInner}>
											Humidity{' '}
											<Text style={styles.spanElement}>
												{data.current.humidity}%{' '}
											</Text>
										</Text>
										<Text style={styles.lisitingInner}>
											Wind{' '}
											<Text style={styles.spanElement}>
												{data.current.wind_kph} km/h
											</Text>
										</Text>
										<Text style={styles.lisitingInner}>
											Visibility{' '}
											<Text style={styles.spanElement}>
												{data.current.vis_km} km
											</Text>
										</Text>
										<Text style={styles.lisitingInner}>
											Pressure{' '}
											<Text style={styles.spanElement}>
												{data.current.pressure_mb} mb
											</Text>
										</Text>
									</View>
								</View>
							)}
							showsHorizontalScrollIndicator={false}
						/>
					</View>
				)}
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	weatherContainer: {
		marginTop: 60,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: '75%',
		paddingHorizontal: Platform.OS === 'ios' ? 20 : 0,
	},
	safe: {
		flex: 1,
		paddingHorizontal: 20,
	},
	bg: {
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	cityName: {
		fontSize: 32,
		fontWeight: '600',
		color: 'white',
		textAlign: 'center',
	},
	temp: {
		fontSize: 60,
		fontWeight: '300',
		color: 'white',
		textAlign: 'center',
	},
	dayBox: {
		backgroundColor: '#ffffff22',
		borderRadius: 16,
		padding: 12,
		marginRight: 12,
		alignItems: 'center',
		width: 150,
	},
	dayText: {
		color: 'white',
		textAlign: 'center',
		marginBottom: 10,
	},
	icon: {
		width: 50,
		height: 50,
		marginBottom: 8,
	},
	date: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
		marginTop: 20,
		marginBottom: 50,
	},
	foreCastInner: {
		fontSize: 16.5,
		textAlign: 'center',
		backgroundColor: '#ffffff22',
		borderRadius: 10,
		padding: 12,
		height: 50,
		width: '48%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		color: 'lightgray',
		fontWeight: '400',
	},
	weatherForecast: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
		width: '100%',
		gap: 10,
		marginBottom: 20,
	},
	spanElement: {
		color: 'white',
		fontWeight: '600',
	},
	LisitingForcast: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	lisitingInner: {
		width: '100%',
		textAlign: 'center',
		color: 'lightgray',
	},
	flatList: {
		marginTop: 10,
	},
});
