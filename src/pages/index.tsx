import { HeadFC } from "gatsby"
import * as React from "react"

const IndexPage = () => {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
