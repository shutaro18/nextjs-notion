import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getAllPosts, getPostsByPage, getPostsForTopPage } from '@/lib/notionAPI'
import Head from 'next/head'
import SinglePost from '@/components/Post/SinglePost'
import { getNumberOfPages } from '@/lib/notionAPI'
import Pagination from "../../../components/Pagination/Pagination";
import Tag from "../../../components/Tag/Tag";
import { getAllTags } from "../../../lib/notionAPI";

export const getStaticPaths = async () => {
    const numberOfPage = await getNumberOfPages()

    let params = []
    for (let i = 1; i <= numberOfPage; i++) {
        params.push({ params: { page: i.toString() } })
    }

    return {
        paths: params,
        fallback: "blocking", // 404ページを表示する場合はblockingを指定する
    }
}

export const getStaticProps = async (context) => {
    const currentPage = context.params?.page
  const postByPage = await getPostsByPage(parseInt(currentPage.toString(), 10))

  const numberOfPage = await getNumberOfPages()

  const allTags = await getAllTags()


  return {
      props: {
         postByPage,
         numberOfPage,
         allTags,
      },
      revalidate: 60 * 60 * 6,
  }
}

const inter = Inter({ subsets: ['latin'] })

const BlogPageList = ({ postByPage, numberOfPage, allTags }) => {
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
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
            {postByPage.map((post) => (
            <div className="mx-4" key={post.id}>
                <SinglePost
                title={post.title}
                date={post.date}
                description={post.description}
                tags={post.tags}
                slug={post.slug}
                isPaginationPage={true}
                />
            </div>
            ))}
        </section>
        <Pagination numberOfPage={numberOfPage} tag={''} />
        <Tag tags={allTags}/>
       </main>

    </div>
  )
}

export default BlogPageList
