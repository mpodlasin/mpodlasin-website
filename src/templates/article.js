import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import MainLinks from "../components/main-links"
require("prismjs/themes/prism-tomorrow.css")

export default function Article({
  data
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
        <MainLinks />
        <div style={{ width: '100%', maxWidth: 800}} className="p-2">
            <h1 className="text-5xl text-center font-light">{frontmatter.title}</h1>
            <h2 className="text-md text-center text-gray-600">Published on {frontmatter.date}</h2>
            <div
            className="text-2xl font-light mt-10 markdown-article"
            dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    </Layout>
  )
}
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        slug
        title
      }
    }
  }
`