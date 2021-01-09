import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import MainLinks from "../components/main-links"
import { Helmet } from "react-helmet"
require("prismjs/themes/prism-tomorrow.css")

export default function Article({
  data
}) {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  return (
    <>
      <Helmet title={`Mateusz Podlasin - ${frontmatter.title}${frontmatter.subtitle ? `, ${frontmatter.subtitle}` : ''}`} />
      <Layout>
          <MainLinks />
          <div style={{ width: '100%', maxWidth: 800}} className="p-2">
              <h1 className="text-5xl text-center font-light mb-5">{frontmatter.title}</h1>
              {frontmatter.subtitle && <h2 className="text-4xl text-center text-gray-500 mb-5">{frontmatter.subtitle}</h2>}
              <div className="text-md text-center text-gray-600">Published on {frontmatter.date}</div>
              <div
              className="text-2xl font-light mt-10 markdown-article"
              dangerouslySetInnerHTML={{ __html: html }}
              />
          </div>
      </Layout>
    </>
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
        subtitle
      }
    }
  }
`