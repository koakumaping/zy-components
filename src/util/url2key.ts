const url2key = (url: string) => {
  return url.replace('/', '').replaceAll('/', '-') + '-'
}

export default url2key