import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getAllPosts, getPostsForTopPage } from '@/lib/notionAPI'
import Head from 'next/head'
import SinglePost from '@/components/Post/SinglePost'
import Link from 'next/link'
import Tag from '@/components/Tag/Tag'
import { getAllTags } from '@/lib/notionAPI'

export const getStaticProps = async () => {
  const fourPosts = await getPostsForTopPage(4)
  const allTags = await getAllTags()

  return {
      props: {
          fourPosts,
          allTags,
      },
      revalidate: 60 * 60 * 6,
  }
}

const inter = Inter({ subsets: ['latin'] })

export default function Home({ fourPosts, allTags }) {
  return (
    <div className="container h-full w-full mx-auto">
       <Head>
        <title>Notion Blog</title>
        <link rel="icon" href="/favicon.ico" />
       </Head>

       <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog
        </h1>
        {fourPosts.map((post) => (
          <div className="mx-4" key={post.id}>
            <SinglePost
              title={post.title}
              date={post.date}
              description={post.description}
              tags={post.tags}
              slug={post.slug}
              isPaginationPage={false}
            />
          </div>
        ))}
        <Link href="/posts/page/1" className="mb-6 lg:w-1/2 mx-auto px-5 block text-right">
          ...もっと見る
        </Link>
        <Tag tags={allTags} />
       </main>

    </div>
  )
}
