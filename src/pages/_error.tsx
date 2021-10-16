import Head from 'next/head'
import React from 'react'
import Content from '~/components/Content'
import Button from '~/components/Button'
import { useRouter } from 'next/router'

function Error({ statusCode }) {
	const router = useRouter()
	return (
		<div>
			<Head>
				<title>500 - TonyHe</title>
				<link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
			</Head>
			<Content>
				<div className="lg:mt-20 mt-0 lg:pt-0 pt-24 justify-center">
					<div className="text-center">
						<h1 className="font-medium text-3xl leading-14 lg:text-1 text-black tracking-wide mb-0.5">
							Oops
						</h1>
						<p className="text-3 lg:text-2 text-gray-500 leading-14 tracking-wide font-light">
							{statusCode
								? `An error with code ${statusCode} has occurred on the server`
								: 'An error has occurred on the client'}
						</p>
						<div className="inline-block justify-center mt-4">
							<Button
								bType="primary"
								onClick={() => {
									router.push('/')
								}}
								className="mx-auto"
							>
								Back to Home
							</Button>
						</div>
					</div>
				</div>
			</Content>
		</div>
	)
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404
	return { statusCode }
}

export default Error
