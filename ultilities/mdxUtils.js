import fs from 'fs'
import path from 'path'

// POSTS_PATH is useful when you want to get the path to a specific file
export const getPath = (slug) => {
    return path.join(process.cwd(), `data/journals_mdx/${slug}`);
}

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = (slug) => fs
  .readdirSync(getPath(slug))
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path))