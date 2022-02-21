import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    // INFO 修改标题名
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
