import React, { useContext, useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from '~/hooks'
import { selectKbar } from '~/store/kbar/selectors'
import { kbarContext } from './context'
import Tabs, { TabItemProps } from '../Tabs'
import HotkeyHelper from '../Helpers/hotkey'
import { Icon } from '@twilight-toolkit/ui'
import {
	deactivateKbar,
	goToKbarLocation,
	KbarLists,
} from '~/store/kbar/actions'
const ContentLoader = dynamic(
	() => import('react-content-loader').then((mod) => mod.default),
	{ ssr: false }
)

// Kbar list data helper
const currentList = (
	lists: KbarLists,
	location: string[]
): KbarLists[string] => {
	if (location.length - 1 >= 0 && lists[location[location.length - 1]]) {
		return lists[location[location.length - 1]]
	}
	return []
}

// Kbar list helper component
const ListComponent = ({
	tabsListItems,
	verticalListWrapper,
}: {
	tabsListItems: TabItemProps[]
	verticalListWrapper: React.MutableRefObject<HTMLDivElement>
}) => {
	const { resolvedTheme } = useTheme()
	const { loading } = useSelector(selectKbar)
	if (loading || !tabsListItems) {
		return (
			<ContentLoader
				speed={2}
				width={50}
				style={{ width: '100%' }}
				height={45}
				backgroundColor={resolvedTheme === 'dark' ? '#525252' : '#f3f3f3'}
				foregroundColor={resolvedTheme === 'dark' ? '#737373' : '#ecebeb'}
			>
				<rect x="0" y="0" rx="5" ry="5" width="100%" height="45" />
			</ContentLoader>
		)
	}

	if (tabsListItems.length === 0) {
		return (
			<div className="flex gap-x-3 text-gray-500 dark:text-gray-400 p-4">
				<span className="w-5 h-5">
					<Icon name="empty" />
				</span>
				<span>No results found</span>
			</div>
		)
	}

	return (
		<Tabs
			items={tabsListItems}
			direction="vertical"
			defaultHighlighted
			verticalListWrapper={verticalListWrapper}
		/>
	)
}

const KbarPanel = () => {
	const router = useRouter()
	const dispatch = useDispatch()
	const { inputValue, setInputValue } = useContext(kbarContext)
	const { lists, placeholder, animation, location, loading } =
		useSelector(selectKbar)
	const verticalListWrapper = useRef<HTMLDivElement>(null)
	const [initalListItems, setInitalListItems] = useState<TabItemProps[]>([])
	const [tabsListItems, setTabsListItems] = useState<TabItemProps[]>([])

	useEffect(() => {
		// Decorate list item actions
		currentList(lists, location).map((item) => {
			// create action functions for link items
			let actionFunc = item.action

			if (item.link?.external) {
				actionFunc = () => {
					window.open(item.link.external, '_blank').focus()
				}
			} else if (item.link?.internal) {
				actionFunc = () => {
					router.push(item.link.internal)
				}
			}

			item.action = () => {
				actionFunc()
				if (item.singleton !== false) {
					dispatch(deactivateKbar())
				}
			}
		})

		// Construct data for vertical Tabs component
		const initialTabsListItems = currentList(lists, location).map((item) => {
			return {
				label: item.label,
				icon: item.icon,
				color: item.color,
				bgColor: item.bgColor,
				bgDark: item.bgDark,
				link: item.link,
				onClick: item.action,
				hoverable: item.hoverable,
				className: 'w-full !justify-start !p-4',
				component:
					item.hoverable === false ? (
						<p className="text-sm text-gray-400 -my-2">{item.label}</p>
					) : (
						<div className="flex justify-between w-full items-center">
							<div className={`flex gap-x-3 items-center ${item.color || ''}`}>
								{item.icon && (
									<span className="h-5 w-5 -mt-[1px]">
										<Icon name={item.icon} />
									</span>
								)}
								<span>{item.label}</span>
							</div>
							<div className="flex gap-x-2.5 items-center">
								{item.description && (
									<div className="text-sm text-gray-400">
										{item.description}
									</div>
								)}
								{item.shortcut?.length && (
									<ul className="flex list-none gap-x-2 text-gray-500">
										<li className="capitalize bg-gray-100 dark:bg-transparent dark:border-gray-600 rounded-md border py-0.5 text-xs px-2">
											Shift
										</li>
										{item.shortcut.map((shortcut) => (
											<li
												key={shortcut}
												className="capitalize bg-gray-100 dark:bg-transparent dark:border-gray-600 rounded-md border py-0.5 text-xs px-2"
											>
												{shortcut}
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
					),
			}
		})
		setInitalListItems(initialTabsListItems)
		setTabsListItems(initialTabsListItems)
	}, [lists, location])

	// Search list items
	useEffect(() => {
		const resultList = initalListItems.filter((item) => {
			// filter out unhoverable items when input value is not empty
			return (
				!inputValue ||
				(item.hoverable !== false &&
					item.label.toLowerCase().includes(inputValue.toLowerCase()))
			)
		})
		setTabsListItems(resultList)
	}, [inputValue, initalListItems])

	return (
		<div
			data-cy="kbar-panel"
			className="w-screen -ml-10 h-screen flex justify-center pointer-events-auto absolute"
		>
			{
				// register shortcuts of list items
				currentList(lists, location).map((item, index) => {
					if (item.shortcut?.length) {
						return <HotkeyHelper key={index} item={item} />
					}
				})
			}
			<div
				className={`z-50 w-[620px] border dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg bg-white/70 dark:bg-black/70 mt-[8%] h-fit max-h-[420px] ${
					animation === 'transition'
						? 'animate-kbarTransition'
						: animation === 'out'
						? 'animate-kbarOut'
						: animation === 'in'
						? 'animate-kbar'
						: ''
				}`}
			>
				<div className="h-[60px] border-b dark:border-gray-700 flex">
					<input
						data-cy="kbar-input"
						placeholder={placeholder}
						onChange={(e) => setInputValue(e.target.value)}
						autoFocus
						className="flex-1 w-full bg-transparent rounded-tl-lg rounded-tr-lg text-lg py-4.5 px-5 outline-none text-gray-600 dark:text-gray-300"
					/>
					<div className="flex items-center mr-5">
						<ul className="flex list-none gap-x-2 text-gray-400 dark:text-gray-500">
							{location.map((place) => (
								<li
									key={place}
									onClick={() => {
										dispatch(goToKbarLocation(place))
									}}
									className="cursor-pointer capitalize hover:bg-gray-100 dark:hover:bg-gray-800 dark:border-gray-600 border rounded-md py-1 text-xs px-2"
								>
									{place}
								</li>
							))}
						</ul>
					</div>
				</div>
				<div
					data-cy="kbar-list"
					ref={verticalListWrapper}
					className={`px-2.5 py-2.5 overflow-hidden ${
						!loading && 'overflow-y-auto'
					} max-h-[360px] kbar-mask`}
				>
					<ListComponent
						tabsListItems={tabsListItems}
						verticalListWrapper={verticalListWrapper}
					/>
				</div>
			</div>
		</div>
	)
}

export default KbarPanel
