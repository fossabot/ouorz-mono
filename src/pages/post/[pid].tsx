import { GetStaticPaths, GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
const Aside = dynamic(() => import('~/components/Aside'), { ssr: false })

// Components
import Head from 'next/head'
import Page from '~/components/Page'
import SubscriptionBox from '~/components/SubscriptionBox'
import TimeAgo from 'react-timeago'
import CommentBox from '~/components/CommentBox'
import PostContent from '~/components/PostContent'
import Link from 'next/link'
import Label from '~/components/Label'
import { CardTool } from '~/components/Card/WithImage/tool'

// Utilities
import { DesSplit } from '~/assets/utilities/String'
import { getApi } from '~/assets/utilities/Api'
import redirect from 'nextjs-redirect'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Redirect = redirect('/404')

export default function BlogPost({
	status,
	post,
}: {
	status: boolean
	post?: any
}) {
	const router = useRouter()
	const { pid } = router.query

	if (!status) {
		return (
			<Redirect>
				<div className="text-center shadow-sm border rounded-md rounded-tl-none rounded-tr-none border-t-0 w-1/3 mx-auto bg-white py-3 animate-pulse">
					<h1 className="text-lg font-medium">404 Not Found</h1>
					<p className="text-gray-500 font-light tracking-wide text-sm">
						redirecting...
					</p>
				</div>
			</Redirect>
		)
	}

	// Run once, increse post views
	useEffect(() => {
		fetch(
			getApi({
				// @ts-ignore
				visit: pid,
			})
		)
	}, [])

	return (
		<div>
			<Head>
				<title>{post.title.rendered} - TonyHe</title>
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📃</text></svg>"
				/>
				<meta
					name="description"
					content={DesSplit({ str: post.post_excerpt.four, n: 150 })}
				/>
				{post.post_img.url && (
					<meta property="og:image" content={post.post_img.url} />
				)}
			</Head>
			<Page>
				<article
					data-cy="postContent"
					className="lg:shadow-sm lg:border lg:rounded-xl bg-white dark:bg-gray-800 dark:border-gray-800 p-5 lg:p-20 lg:pt-20 pt-24"
				>
					<div className="mb-20">
						<div className="flex mb-3">
							<Link href={`/cate/${post.post_categories[0].term_id}`}>
								<a>
									<Label name="primary" icon="cate">
										{post.post_categories[0].name}
									</Label>
								</a>
							</Link>
						</div>
						<h1 className="text-1.5 lg:text-postTitle font-medium tracking-wider leading-snug">
							{post.title.rendered}
						</h1>
						<p className="flex text-5 lg:text-xl text-gray-500 space-x-2 mt-2 tracking-wide whitespace-nowrap">
							<span>
								Posted <TimeAgo date={post.date} />
							</span>
							<span>·</span>
							<span>{post.post_metas.views} Views</span>
							<span>·</span>
							<span className="group cursor-pointer">
								<span className="group-hover:hidden">
									{post.post_metas.reading.word_count} Words
								</span>
								<span className="hidden group-hover:block">
									<abbr title="Estimated reading time">
										ERT {post.post_metas.reading.time_required} min
									</abbr>
								</span>
							</span>
						</p>
					</div>
					<PostContent content={post.content.rendered} />
					{post.post_categories[0].term_id === 4 && (
						<div className="mt-12">
							<CardTool item={post} preview={false} />
						</div>
					)}
				</article>
				<Aside preNext={post.post_prenext} />
				<div className="lg:mt-5 border-t border-gray-200 lg:border-none">
					<SubscriptionBox type="lg" />
				</div>
				<CommentBox />
			</Page>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async (context) => {
	const pid = context.params.pid

	// Fetch page data
	const resData = await fetch(
		getApi({
			// @ts-ignore
			post: pid,
		})
	)

	if (!resData.ok) {
		return {
			props: {
				status: false,
			},
			revalidate: 10,
		}
	} else {
		const postData = await resData.json()
		return {
			props: {
				status: true,
				post: postData,
			},
			revalidate: 3600 * 24,
		}
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const res = await fetch(
		getApi({
			postIDs: true,
		})
	)
	const postIDs: number[] = await res.json()

	const paths = postIDs.map((id) => ({
		params: { pid: id.toString() },
	}))

	return { paths, fallback: false }
}
