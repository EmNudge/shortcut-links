import { rm, mkdir, readFile, writeFile, stat } from 'fs/promises'
import { join } from 'path'
import { parse as parseTOML } from 'toml'
import { z } from 'zod'

/**
 * @typedef {Object} Link
 * @property {string} id - Unique identifier for the link
 * @property {string} title - Display title for the link
 * @property {string} url - Target URL for redirection
 * @property {string} slug - custom slug for the link
 */

/**
 * @typedef {Object} LinksConfig
 * @property {Link[]} links - Array of link objects
 */


const LinkSchema = z.object({
  slug: z.string(),
  url: z.url('Must be a valid URL'),
  description: z.string().min(1, 'Link description cannot be empty'),
})

const LinksConfigSchema = z.object({
  links: z.array(LinkSchema).min(1, 'Must have at least one link')
})

/**
 * Creates an HTML index page by replacing placeholders in template
 * @param {Link[]} links - Array of link objects to display
 * @returns {Promise<string>} HTML content for the index page
 */
async function getIndexFromTemplate(links) {
  const template = await readFile('index.html', 'utf-8')
  
  const linksList = links.map(link => {
    const slug = link.slug
    return `<li>
      <div>
        <a href="${slug}.html">${slug}</a> → 
        <a href="${link.url}" target="_blank">${link.url}</a>
      </div>
      <div class="title">
        ${link.description}
      </div>
    </li>`
  }).join('\n')
  
  return template
    .replace('{{LINK_COUNT}}', links.length.toString())
    .replace('{{LINK_LIST}}', linksList)
}

async function buildProject() {
  const linksContent = await readFile('links.toml', 'utf-8')
  
  const parsedTOML = parseTOML(linksContent)
  
  const validatedConfig = LinksConfigSchema.parse(parsedTOML)
  
  const links = validatedConfig.links

  try {
    await rm('dist', { recursive: true })
  } catch {
    // ignore if file doesn't exist
  }
  
  await mkdir('dist', { recursive: true })

  for (const link of links) {
    const slug = link.slug || link.id
    const htmlContent = `<!DOCTYPE html>
  <html>
  <head>
  <meta http-equiv="refresh" content="0; url=${link.url}">
  </head>
  </html>`
    const filePath = join('dist', `${slug}.html`)
    
    await writeFile(filePath, htmlContent)
  }
  
  const indexContent = await getIndexFromTemplate(links)
  const indexPath = join('dist', 'index.html')
  
  await writeFile(indexPath, indexContent)
}

buildProject()

console.log('Done')