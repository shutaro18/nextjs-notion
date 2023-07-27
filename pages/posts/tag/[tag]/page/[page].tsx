import Image from 'next/image'
import { Inter } from 'next/font/google'
import { getAllPosts, getNumberOfPagesByTag, getPostsByPage, getPostsForTopPage } from '@/lib/notionAPI'
import Head from 'next/head'
import SinglePost from '@/components/Post/SinglePost'
import { getNumberOfPages } from '@/lib/notionAPI'
import Pagination from "../../../../../components/Pagination/Pagination";
import { getPostsByTagAndPage } from '@/lib/notionAPI'
import { getAllTags } from '@/lib/notionAPI'
import Tag from "../../../../../components/Tag/Tag";



export const getStaticPaths = async () => {
    const allTags = await getAllTags();
    let params = []

    await Promise.all(
        allTags.map((tag: string) => {
            return getNumberOfPagesByTag(tag).then((numberOfPageByTag: number) => {
                for (let i = 1; i <= numberOfPageByTag; i++) {
                    params.push({ params: { tag: tag, page: i.toString() } })
                }
            })
        })
    )



    return {
        paths: params,
        fallback: "blocking", // 404ページを表示する場合はblockingを指定する
    }
}

export const getStaticProps = async (context) => {
  const currentPage: string = context.params?.page.toString();
  const currentTag: string = context.params?.tag.toString();

  const upperCaseCurrentTag = currentTag.charAt(0).toUpperCase() + currentTag.slice(1)

  const posts = await getPostsByTagAndPage(upperCaseCurrentTag, parseInt(currentPage, 10))

  const numberOfPagesByTag = await getNumberOfPagesByTag(upperCaseCurrentTag)

  const allTags = await getAllTags()

  return {
      props: {
         posts,
         numberOfPagesByTag,
         currentTag,
         allTags,
      },
      revalidate: 60 * 60 * 6,
  }
}

const inter = Inter({ subsets: ['latin'] })

const BlogTagPageList = ({ numberOfPagesByTag, posts, currentTag, allTags }) => {
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
            {posts.map((post) => (
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
        <Pagination numberOfPage={numberOfPagesByTag} tag={currentTag} />
        <Tag tags={allTags}/>
       </main>

    </div>
  )
}

export default BlogTagPageList
