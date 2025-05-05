import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '@/screens/HomeScreen';

export default function Index() {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<HomeScreen />
		</QueryClientProvider>
	);
}
