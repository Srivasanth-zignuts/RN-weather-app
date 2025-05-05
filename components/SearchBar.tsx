import React, { useState } from 'react';
import {
	View,
	TextInput,
	TouchableOpacity,
	FlatList,
	Text,
	StyleSheet,
	StatusBar,
	Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
	value: string;
	onChangeText: (text: string) => void;
	onSearch: () => void;
	suggestions: any[];
	onSelectSuggestion: (city: string) => void;
}

export default function SearchBar({
	value,
	onChangeText,
	onSearch,
	suggestions,
	onSelectSuggestion,
}: Props) {
	return (
		<View style={styles.wrapper}>
			<View style={styles.searchBar}>
				<TextInput
					placeholder='Search city'
					placeholderTextColor='lightgray'
					style={styles.input}
					value={value}
					onChangeText={onChangeText}
				/>
				<TouchableOpacity
					onPress={onSearch}
					style={styles.icon}
				>
					<Feather
						name='search'
						size={20}
						color='white'
					/>
				</TouchableOpacity>
			</View>
			{suggestions.length > 0 && (
				<FlatList
					style={styles.suggestionList}
					data={suggestions}
					keyExtractor={(item) => item.id?.toString() ?? item.name}
					renderItem={({ item, index }) => (
						<TouchableOpacity onPress={() => onSelectSuggestion(item.name)}>
							<Text
								style={[
									styles.suggestion,
									index === suggestions.length - 1 && { borderBottomWidth: 0 },
								]}
							>
								{item.name}, {item.region}
							</Text>
						</TouchableOpacity>
					)}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: { zIndex: 999, position: 'relative' },
	searchBar: {
		flexDirection: 'row',
		backgroundColor: 'rgba(255,255,255,0.2)',
		borderRadius: 50,
		paddingHorizontal: 20,
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: (StatusBar.currentHeight || 0) + 30,
		marginHorizontal: Platform.OS === 'ios' ? 20 : 0,
	},
	input: {
		flex: 1,
		color: 'white',
		fontSize: 16,
	},
	icon: {
		marginLeft: 10,
	},
	suggestion: {
		padding: 10,
		backgroundColor: '#ffffff33',
		color: 'white',
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	suggestionList: {
		borderRadius: 10,
		width: '100%',
		marginTop: 5,
	},
});
