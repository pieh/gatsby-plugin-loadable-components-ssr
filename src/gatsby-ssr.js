import path from "path";

import { ChunkExtractor } from "@loadable/server"

import { LOADABLE_STATS_FILE_PATH } from "./constant"

const extractor = new ChunkExtractor({
  // Read the stats file generated by webpack loadable plugin.
  statsFile: path.resolve(LOADABLE_STATS_FILE_PATH),
  entrypoints: [],
})

// extractor.collectChunks() will wrap the application in a ChunkExtractorManager
export const wrapRootElement = ({ element }) => {
  return extractor.collectChunks(element)
}

export const onRenderBody = ({ setPostBodyComponents, setHeadComponents }) => {
  // Set link rel="preload" tags in the head to start the request asap. This will NOT parse the assets fetched
  setHeadComponents(extractor.getLinkElements())

  // Set script and style tags at the end of the document to parse the assets.
  setPostBodyComponents([
    ...extractor.getScriptElements(),
    ...extractor.getStyleElements(),
  ])

  // Reset collected chunks after each page is rendered
  extractor.chunks = []
}
