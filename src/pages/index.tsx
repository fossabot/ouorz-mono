import { GetStaticProps } from 'next'
import Head from 'next/head'
import React from 'react'
import Content from '~/components/Content'
import List from '~/components/List'
import Top from '~/components/Top'
// import ChirstmasBanner from '~/components/Banners/Christmas'
import { getApi } from '~/assets/utilities/Api'

interface Sticky {
	stickyNotFound: boolean
	stickyPosts: any
}

export default function Home({ stickyNotFound, stickyPosts }: Sticky) {
	return (
		<div>
			<Head>
				<title>TonyHe</title>
				<link rel="icon" type="image/x-icon" href="/favicon.ico" />
				<meta name="description" content="A developer, blogger, podcaster" />
				<meta
					name="keywords"
					content="TonyHe, Lipeng He, Tony, Developer, Blogger, Podcaster, Blog, Personal Site, WordPress, Next.js, React.js, TypeScript, JavaScript"
				/>
			</Head>
			<Content>
				<div className="lg:mt-20 mt-0 lg:pt-0 pt-24">
					<div>
						<h1 className="flex items-center font-medium text-3xl leading-14 lg:text-1 text-black dark:text-white tracking-wide mb-0.5 whitespace-nowrap">
							<span className="animate-waveHand hover:animate-waveHandAgain inline-block cursor-pointer mr-2.5">
								👋
							</span>{' '}
							Hey, I{"'"}m Tony
							<a
								href="https://www.linkedin.com/in/lipenghe"
								className="ml-2 mt-0.5"
								target="_blank"
								rel="noreferrer"
							>
								<span className="text-sm flex items-center ml-2 py-1 px-2.5 border border-gray-400 hover:shadow-sm hover:border-gray-500 hover:text-gray-600 text-gray-500 dark:text-white dark:border-white dark:hover:opacity-80 rounded-md tracking-normal">
									Open to work →
								</span>
							</a>
						</h1>
						<p className="text-3 lg:text-2 text-gray-500 dark:text-gray-200 leading-14 tracking-wide font-light">
							I{"'"}m a developer, blogger and podcaster; currently studying
							Mathematics at the University of Waterloo (Undergraduate).
						</p>
					</div>
					<Top />
				</div>
				<div className="mt-10">
					{!stickyNotFound && <List posts={stickyPosts} sticky={true} />}
				</div>
				{/* <div className="mt-2.5">
					<ChirstmasBanner />
				</div> */}
				<div className="mt-5">
					<List type="index" />
				</div>
			</Content>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
	const resSticky = await fetch(
		getApi({
			sticky: true,
			perPage: 10,
			cateExclude: '5,2,74',
		})
	)
	const dataSticky = await resSticky.json()

	let stickyNotFound = false

	if (!dataSticky) {
		stickyNotFound = true
	}

	return {
		props: {
			stickyNotFound: stickyNotFound,
			stickyPosts: dataSticky,
		},
	}
}
