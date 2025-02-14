import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import MetricsTable from './MetricsTable'
import Tag from 'components/common/Tag'
import DropDown from 'components/common/DropDown'
import { eventTypeFilter } from 'lib/filters'
import usePageQuery from 'hooks/usePageQuery'
import styles from './EventsTable.module.css'

const EVENT_FILTER_DEFAULT = {
	value: 'all',
	label: <FormattedMessage id="label.all-events" defaultMessage="All events" />,
}

export default function EventsTable({ websiteId, ...props }) {
	const [eventType, setEventType] = useState(EVENT_FILTER_DEFAULT.value)
	const [eventTypes, setEventTypes] = useState([])
	const { resolve, router } = usePageQuery()

	const dropDownOptions = [
		EVENT_FILTER_DEFAULT,
		...eventTypes.map((t) => ({ value: t, label: t })),
	]

	function handleDataLoad(data) {
		setEventTypes([...new Set(data.map(({ x }) => x.split('\t')[0]))])
		props.onDataLoad?.(data)
	}

	function handleChange(value) {
		router.replace(resolve({ eventType: value === 'all' ? undefined : value }))
		setEventType(value)
	}

	return (
		<>
			{eventTypes?.length > 1 && (
				<div className={styles.filter}>
					<DropDown
						value={eventType}
						options={dropDownOptions}
						onChange={handleChange}
					/>
				</div>
			)}
			<MetricsTable
				{...props}
				title={<FormattedMessage id="metrics.events" defaultMessage="Events" />}
				type="event"
				metric={
					<FormattedMessage id="metrics.actions" defaultMessage="Actions" />
				}
				websiteId={websiteId}
				dataFilter={eventTypeFilter}
				filterOptions={
					eventType === EVENT_FILTER_DEFAULT.value ? [] : [eventType]
				}
				renderLabel={({ x }) => <Label value={x} />}
				onDataLoad={handleDataLoad}
			/>
		</>
	)
}

const Label = ({ value }) => {
	const [event, label] = value.split('\t')
	return (
		<>
			<Tag>{event}</Tag>
			{label}
		</>
	)
}
