import { useTheme } from 'next-themes'
import ContentLoader from 'react-content-loader'
// import dynamic from 'next/dynamic'
// const ContentLoader = dynamic(
// 	() => import('react-content-loader').then((mod) => mod.default),
// 	{ ssr: false }
// )

export default function CardSkeleton() {
	const { resolvedTheme } = useTheme()
	return (
		<div className="w-full p-10 shadow-sm bg-white dark:bg-gray-800 dark:border-gray-800 rounded-md border mb-6 text-center">
			{/* @ts-ignore */}
			<ContentLoader
				speed={2}
				width={100}
				style={{ width: '100%' }}
				height={100}
				backgroundColor={resolvedTheme === 'dark' ? '#525252' : '#f3f3f3'}
				foregroundColor={resolvedTheme === 'dark' ? '#737373' : '#ecebeb'}
			>
				<rect x="0" y="0" rx="5" ry="5" width="31%" height="100" />
				<rect x="34%" y="0" rx="5" ry="5" width="95%" height="30" />
				<rect x="34%" y="41" rx="2" ry="2" width="60%" height="15" />
				<rect x="34%" y="63" rx="2" ry="2" width="50%" height="15" />
				<rect x="34%" y="85" rx="2" ry="2" width="55%" height="15" />
			</ContentLoader>
		</div>
	)
}
