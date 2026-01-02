export const useRouter = () => ({
	push: (url: string) => console.log('Mock router push:', url),
	replace: (url: string) => console.log('Mock router replace:', url),
	refresh: () => console.log('Mock router refresh'),
	back: () => console.log('Mock router back'),
	forward: () => console.log('Mock router forward'),
	prefetch: (url: string) => console.log('Mock router prefetch:', url),
	pathname: '/',
	query: {},
	asPath: '/',
});

export const usePathname = () => '/';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});

export const redirect = (url: string) => console.log('Mock redirect:', url);

export const notFound = () => console.log('Mock notFound');
