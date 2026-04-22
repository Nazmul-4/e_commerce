const resolveUrl = (baseUrl, path) => {
  if (!path) return "";

  // already full URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // protocol-relative URL
  if (path.startsWith("//")) {
    return `https:${path}`;
  }

  // root-relative path
  if (path.startsWith("/")) {
    return `${baseUrl}${path}`;
  }

  // normal relative path
  return `${baseUrl}/${path}`;
};

module.exports = resolveUrl;