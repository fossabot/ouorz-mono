import { GlowingBackground } from '~/components/Visual'
import { Icon } from '@twilight-toolkit/ui'

interface PropsType {
	footer: string
	value: string
	link: string
	icon: string
	colorHex: string
	subValue?: string
}

const navigateTo = (link: string) => {
	window.open(link)
}

export default function MetricCard({
	footer,
	value,
	link,
	icon,
	colorHex,
	subValue,
}: PropsType) {
	return (
		<div
			onClick={() => navigateTo(link)}
			className="glowing-div flex items-center dark:bg-gray-800 dark:border-gray-800 rounded-md border shadow-sm hover:shadow-md py-4 px-5 bg-white cursor-pointer"
			style={{ borderBottom: `5px solid ${colorHex}` }}
		>
			<GlowingBackground />
			<div className="glowing-div-content">
				<h1
					className={`font-bold text-stats tracking-wide flex items-center -mb-0.5 ${
						!value && 'animate-pulse'
					}`}
				>
					<span>
						{value && value !== 'NaN' ? value : '- - -'}
						{subValue && subValue !== 'NaN' && '/' + subValue}
					</span>
					{value && (!subValue || subValue !== 'NaN') && (
						<span className="w-7 h-7 ml-1 mt-1">
							<Icon name={icon} />
						</span>
					)}
				</h1>
				<p className="text-gray-500 dark:text-gray-400 tracking-wide overflow-hidden text-ellipsis whitespace-nowrap">
					{footer} →
				</p>
			</div>
		</div>
	)
}
