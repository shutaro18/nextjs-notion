import { getSingPost } from '@/lib/notionAPI'
import { getAllPosts } from '@/lib/notionAPI'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {vscDarklPlus} from 'react-syntax-highlighter/dist/cjs/styles/prism'
import React from 'react'
import Link from 'next/link'

export const getStaticPaths = async () => {
    const allPosts = await getAllPosts()
    const paths = allPosts.map(({slug}) =>({params: {slug}} ))
    return {
        paths,
        fallback: "blocking", // 404ページを表示する場合はblockingを指定する
    }
}

export const getStaticProps = async ({params}) => {
    const post = await getSingPost(params.slug)

    return {
        props: {
            post,
        },
        revalidate: 60 * 60 * 6,
    }
  }

function Post({post}) {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
        <h2 className="w-full text-2xl font-medium">{post.metadata.title}</h2>
        <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
        <span className="text-gray-500">{post.metadata.date}</span>
        <br />
        {post.metadata.tags.map((tag:string, index: number) => (
             <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2" key={index}>
              <Link href={`posts/tag/${tag}/page/1`}>
             {tag}</Link></p>

            ))
        }

        <div className="mt-10 font-medium">
            <ReactMarkdown children={post.markdown.parent} components={{
      code({node, inline, className, children, ...props}) {
        const match = /language-(\w+)/.exec(className || '')
        return !inline && match ? (
          <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, '')}
            style={vscDarklPlus}
            language={match[1]}
            PreTag="div"
          />
        ) : (
          <code {...props} className={className}>
            {children}
          </code>
        )
      }
    }}></ReactMarkdown>

        <Link href="/">
            <p className="text-sky-900 font-medium mt-10 pb-20">←Back to Home</p>
        </Link>
        </div>
    </section>
  )
}

export default Post
